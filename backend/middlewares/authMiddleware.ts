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
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        // 1. Decode WITHOUT verification first to get the revision claim
        const unverifiedDecoded = jwt.decode(token) as any;
        if (!unverifiedDecoded || !unverifiedDecoded.id) {
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        // 2. Fetch user to get their CURRENT secret revision
        const user = await prisma.user.findUnique({
            where: { id: unverifiedDecoded.id },
            select: { id: true, role: true, email: true, name: true, jwtSecretRevision: true }
        });

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        // 3. Verify the token using the user-specific dynamic secret
        const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
        const dynamicSecret = `${JWT_SECRET}-${user.jwtSecretRevision}`;

        jwt.verify(token, dynamicSecret);

        // 4. Attach user and move on
        (req as any).user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return res.status(401).json({ message: 'Session expired or security reset' });
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
