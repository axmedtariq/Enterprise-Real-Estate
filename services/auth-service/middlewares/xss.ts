import xss from 'xss';
import { Request, Response, NextFunction } from 'express';

// Recursive function to sanitize objects, arrays, and strings
// 🛡️ Handles XSS (HTML/JS) and NoSQL Injection (stripping $ and .)
const clean = (data: any): any => {
    if (typeof data === 'string') {
        // 1. Remove NoSQL Injection operators (stripping $, typical for MongoDB-style attacks)
        let sanitized = data.replace(/\$|\./g, ''); 
        
        // 2. Filter out malicious HTML/JS scripts (XSS)
        return xss(sanitized); 
    }

    if (Array.isArray(data)) {
        return data.map((item) => clean(item));
    }

    if (typeof data === 'object' && data !== null) {
        const cleanedData: any = {};
        for (const [key, value] of Object.entries(data)) {
            // Sanitize keys too (vital for NoSQL protection)
            const cleanKey = typeof key === 'string' ? key.replace(/\$|\./g, '') : key;
            cleanedData[cleanKey] = clean(value);
        }
        return cleanedData;
    }

    return data;
};

// OWASP XSS Protection Middleware
export const xssClean = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = clean(req.body);

    if (req.query) {
        for (const key in req.query) {
            req.query[key] = clean(req.query[key]);
        }
    }

    if (req.params) {
        for (const key in req.params) {
            req.params[key] = clean(req.params[key]);
        }
    }

    next();
};
