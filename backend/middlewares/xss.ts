import xss from 'xss';
import { Request, Response, NextFunction } from 'express';

// Recursive function to sanitize objects, arrays, and strings
const clean = (data: any): any => {
    if (typeof data === 'string') {
        return xss(data); // Filters out malicious HTML/JS scripts
    }

    if (Array.isArray(data)) {
        return data.map((item) => clean(item));
    }

    if (typeof data === 'object' && data !== null) {
        const cleanedData: any = {};
        for (const [key, value] of Object.entries(data)) {
            cleanedData[key] = clean(value);
        }
        return cleanedData;
    }

    return data;
};

// OWASP XSS Protection Middleware
export const xssClean = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);

    next();
};
