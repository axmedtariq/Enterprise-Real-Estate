import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const transports: winston.transport[] = [
    // 1. Console Transport (Dev-friendly)
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }),

    // 2. Local File Transport (Forensic backup)
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.json()
    }),
    new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.json()
    })
];

import { sendSlackNotification } from './sendSlack';

const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'sovereign-backend' },
    transports: transports
});

// 🛡️ SLACK ALERT INTERCEPTOR
// Automatically notify Slack when a critical Error occurs
const originalError = logger.error.bind(logger);
logger.error = (message: any, ...args: any[]) => {
    // Only notify in non-local environments or if explicitly needed
    sendSlackNotification(`[Critical Error]: ${message}`, 'error');
    return originalError(message, ...args);
};

// Capture unhandled exceptions & promise rejections
logger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
);

process.on('unhandledRejection', (ex) => {
    throw ex;
});

console.log(`📡 SOVEREIGN LOGGER: Local File/Console Logging Active`);

export default logger;
