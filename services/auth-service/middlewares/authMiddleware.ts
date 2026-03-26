import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../data/database';

interface DecodedToken {
    id: string;
    role: string;
    iat: number;
    exp: number;
    rev: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized: No token provided' });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET || JWT_SECRET === 'your_super_secret_jwt_key_here') {
            console.error("🔒 SECURITY BREACH: Attempted access with default or missing JWT_SECRET");
            return res.status(500).json({ success: false, message: 'System Security Configuration Error' });
        }

        // Verify the token integrity
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Fetch user to check status and session revision
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                jwtSecretRevision: true,
                lockUntil: true
            }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Identity Revoked: User no longer exists' });
        }

        // 🛡️ Lockout Check
        if (user.lockUntil && user.lockUntil > new Date()) {
            return res.status(423).json({ success: false, message: "Account Locked for Security" });
        }

        // SESSION REVOCATION CHECK (Military Grade)
        if (decoded.rev !== user.jwtSecretRevision) {
             return res.status(401).json({ success: false, message: 'Security Alert: Session revoked' });
        }

        // Attach user and move on
        (req as any).user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: 'Session Expired' });
        }
        console.error("🔒 JWT Security Violation:", (error as any).message);
        return res.status(401).json({ success: false, message: 'Access Denied' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes((req as any).user.role)) {
            return res.status(403).json({ success: false, message: `Access Forbidden` });
        }
        next();
    };
};
