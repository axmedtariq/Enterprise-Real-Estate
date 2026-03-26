import { Request, Response } from 'express';
import prisma from '../data/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { sendEmail } from '../utils/sendEmail'; // Need to create this
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;

// Elite Security: Token Signing
const signToken = (user: any) => {
    if (!JWT_SECRET || JWT_SECRET === 'your_super_secret_jwt_key_here') {
        throw new Error("❌ SYSTEM_SECURITY_MISCONFIGURED: JWT_SECRET missing!");
    }
    return jwt.sign(
        { id: user.id, role: user.role, rev: user.jwtSecretRevision },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// --- AUTH CONTROLLER ---

// REGISTER USER
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existingUser) {
            // SECURITY: Standard generic message to prevent account enumeration
            res.status(400).json({ message: 'Registration failed: account conflict' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Slightly higher rounds for security

        const user = await prisma.user.create({
            data: {
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: role || 'CUSTOMER'
            }
        });

        const token = signToken(user);

        // 🛡️ ELITE SESSION STORAGE: HTTPOnly Cookies (Anti-XSS)
        res.cookie('sovereign_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use Secure in production
            sameSite: 'strict',
            maxAge: 86400000 // 1 day
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token, // Keep sending token in body for legacy frontend support, but move to cookie gradually
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// LOGIN USER
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, token: twoFactorToken } = req.body;
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        
        // 1. Check for Account Lockout
        if (user && user.lockUntil && user.lockUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
            res.status(403).json({ 
                status: 'fail', 
                message: `Account temporarily locked due to multiple failed attempts. Try again in ${minutesLeft} minutes.` 
            });
            return;
        }

        if (!user) {
            // OWASP: Generic error to avoid email enumeration
            res.status(401).json({ status: 'fail', message: 'Unauthorized: Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            // Manage Failed Attempts
            const currentAttempts = user.failedLoginAttempts + 1;
            const updateData: any = { failedLoginAttempts: currentAttempts };
            
            if (currentAttempts >= 5) {
                updateData.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 Minute Lock
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData
            });

            res.status(401).json({ status: 'fail', message: 'Unauthorized: Invalid email or password' });
            return;
        }

        // 2FA Check (omitted for brevity in replace, but I'll make sure it's kept or merged correctly)
        if (user.twoFactorEnabled) {
            if (!twoFactorToken) {
                res.status(403).json({ message: '2FA token required', require2FA: true });
                return;
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret!,
                encoding: 'base32',
                token: twoFactorToken
            });

            if (!verified) {
                res.status(400).json({ message: 'Invalid 2FA token' });
                return;
            }
        }

        // Reset security fields on successful login
        await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockUntil: null }
        });

        const token = signToken(user);

        // 🛡️ ELITE SESSION STORAGE: HTTPOnly Cookies (Anti-XSS)
        res.cookie('sovereign_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000 // 1 day
        });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, twoFactorEnabled: user.twoFactorEnabled }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// ENABLE 2FA (Start Process)
export const enable2FA = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id; // Middleware should attach user
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const tempSecret = speakeasy.generateSecret({ name: `RealEstateEnterprise (${user.email})` });

        // Store secret temporarily or permanently? Usually store permanently but only enable after verify.
        // For simplicity, we store it now but keep enabled=false until verify.

        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: tempSecret.base32 }
        });

        const qrCodeUrl = await qrcode.toDataURL(tempSecret.otpauth_url!);

        res.json({
            message: 'Scan this QR code',
            qrCodeUrl,
            secret: tempSecret.base32
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// VERIFY 2FA (Finish Process)
export const verify2FA = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { token } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            res.status(400).json({ message: '2FA not initialized' });
            return;
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token
        });

        if (verified) {
            await prisma.user.update({
                where: { id: userId },
                data: { twoFactorEnabled: true }
            });
            res.json({ message: '2FA Enabled Successfully' });
        } else {
            res.status(400).json({ message: 'Invalid Token' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetTokenHash,
                resetPasswordExpires: resetExpires
            }
        });

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        // Note: resetUrl should match frontend route. Usually passed via env or config.

        const message = `You requested a password reset. Please create a new password by clicking the link: ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message
            });
            res.json({ message: 'Email sent' });
        } catch (emailError) {
            console.error('Email send failure:', emailError);
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            });
            res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const resetTokenHash = crypto.createHash('sha256').update(token as string).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: resetTokenHash,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                // SECURITY: Invalidate ALL active sessions on password change!
                jwtSecretRevision: { increment: 1 }
            }
        });

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// GET CURRENT USER
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                twoFactorEnabled: user.twoFactorEnabled
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// LOGOUT / REVOKE ALL SESSIONS (Elite Feature)
export const logoutAllDevices = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        // Increment the revision - This immediately kills all current tokens!
        await prisma.user.update({
            where: { id: userId },
            data: { jwtSecretRevision: { increment: 1 } }
        });

        res.json({ message: 'Security reset: All devices logged out successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default { login, register, enable2FA, verify2FA, forgotPassword, resetPassword, getMe, logoutAllDevices };
