import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

/**
 * ⚡ SOVEREIGN CACHE LAYER (Elite Speed)
 * @param duration Duration in seconds
 */
export const cache = (duration: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const key = `sovereign-cache:${req.originalUrl || req.url}`;

        try {
            const cachedBody = await redis.get(key);
            if (cachedBody) {
                // Return cached version immediately
                res.status(200).json(JSON.parse(cachedBody));
                return;
            } else {
                // If not cached, override res.send to capture the data and cache it
                const originalJson = res.json;
                res.json = (body: any): Response<any, Record<string, any>> => {
                    const result = originalJson.call(res, body);
                    // Only cache successful requests
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        redis.set(key, JSON.stringify(body), 'EX', duration);
                    }
                    return result;
                };
                next();
            }
        } catch (error) {
            console.error('⚠️ CACHE ERROR:', error);
            next(); // Continue without caching if Redis is down
        }
    };
};

/**
 * 🧹 PURGE CACHE (Security/Admin)
 * @param pattern Key or wildcard pattern (e.g., 'sovereign-cache:/api/v1/properties*')
 */
export const clearCache = async (pattern: string) => {
    try {
        if (pattern.includes('*')) {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
                console.log(`🧼 CACHE PURGED [pattern]: ${pattern} (${keys.length} keys)`);
            }
        } else {
            await redis.del(pattern);
            console.log(`🧼 CACHE PURGED [key]: ${pattern}`);
        }
    } catch (error) {
        console.error('⚠️ CACHE PURGE FAILED:', error);
    }
};
