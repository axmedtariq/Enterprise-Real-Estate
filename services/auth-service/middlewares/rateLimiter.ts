import rateLimit from 'express-rate-limit';

/**
 * 🛡️ GENERAL API LIMITER
 * Prevents automated scraping and general resource exhaustion.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: '🚀 Sovereign Security: Too many requests. Relax and try again in 15 minutes.'
    }
});

/**
 * 🔐 AUTHENTICATION LIMITER (STRICT)
 * Military-grade protection against Brute Force and Credential Stuffing.
 * Targeting: Login, Register, Password Reset.
 */
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // Only 5 attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: '🚨 CRITICAL ADVISORY: Too many authentication attempts. Account locked for 1 hour for your protection.'
    },
    // Handler for when limit is reached - can be used to log audit event
    handler: (req, res, next, options) => {
        console.warn(`🕵️ BRUTE FORCE ALERT: IP ${req.ip} has hit the Auth Rate Limit.`);
        res.status(options.statusCode).send(options.message);
    }
});

/**
 * 🏘️ PROPERTY SEARCH LIMITER
 * Protects expensive database search queries.
 */
export const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 searches per minute is plenty for a human
    message: {
        success: false,
        message: '✋ Search speed exceeded. Please narrow your search criteria.'
    }
});
