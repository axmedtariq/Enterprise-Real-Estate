import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../data/database';

interface DecodedToken {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized: No token provided' });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET || JWT_SECRET === 'your_super_secret_jwt_key_here') {
            console.error("🔒 SECURITY BREACH: Attempted access with default or missing JWT_SECRET");
            return res.status(500).json({ message: 'System Security Configuration Error' });
        }

        // Verify the token integrity
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Fetch user to check status and session revision
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { 
                id: true, 
                role: true, 
                email: true, 
                name: true, 
                jwtSecretRevision: true, 
                agencyId: true,
                isActive: true // Assuming this exists or can be added
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Identity Revoked: User no longer exists' });
        }

        // SESSION REVOCATION CHECK (Military Grade)
        // If the 'rev' claim in the token does not match the database, the session was revoked (e.g. password change)
        if (decoded.rev !== user.jwtSecretRevision) {
             return res.status(401).json({ message: 'Security Alert: Session has been remotely revoked or expired' });
        }

        // Attach user and move on
        (req as any).user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Session Expired' });
        }
        console.error("🔒 JWT Security Violation:", (error as any).message);
        return res.status(401).json({ message: 'Access Denied: Invalid Security Token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes((req as any).user.role)) {
            return res.status(403).json({ message: `User role ${(req as any).user.role} is not authorized` });
        }
        next();
    };
};
