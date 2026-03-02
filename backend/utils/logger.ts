import winston from 'winston';
import { LogstashTransport } from 'winston-logstash-ts';

// 🏛️ SOVEREIGN LOGGING INFRASTRUCTURE (ELK Integrated)
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

// 3. 🛡️ LOGSTASH TRANSPORT (Centralized ELK Stack)
// For local PC deployment, these connect to the 'sovereign_logstash' container on 5044
const logstashHost = process.env.LOGSTASH_HOST || 'logstash';
const logstashPort = parseInt(process.env.LOGSTASH_PORT || '5044');

transports.push(new LogstashTransport({
    host: logstashHost,
    port: logstashPort,
    protocol: 'tcp',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.logstash()
    )
}));

const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'sovereign-backend' },
    transports: transports
});

// Capture unhandled exceptions & promise rejections
logger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
);

process.on('unhandledRejection', (ex) => {
    throw ex;
});

console.log(`📡 SOVEREIGN LOGGER: Centralized ELK Transport Active on ${logstashHost}:${logstashPort}`);

export default logger;
