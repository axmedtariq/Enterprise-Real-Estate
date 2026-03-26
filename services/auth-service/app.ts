import express from 'express';
import cors from 'cors';
import { connectDatabase } from './data/database';
import helmet from 'helmet';
import hpp from 'hpp';
import { apiLimiter } from './middlewares/rateLimiter';
import { xssClean } from './middlewares/xss'; // OWASP XSS Protection
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import client from 'prom-client';

// 📊 MONITORING: PROMETHEUS METRICS (Sovereign Observability)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestTimer = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
register.registerMetric(httpRequestTimer);

const app = express();

// Expose Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

// Import Routes
import propertyRoutes from './routes/propertyRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

// Middleware to calculate request duration
import logger from './utils/logger';
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;

        // Record metrics
        httpRequestTimer.observe({ method: req.method, route, code: res.statusCode }, duration);

        // 📝 ELK Logging
        logger.info(`HTTP ${req.method} ${req.originalUrl}`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}s`,
            ip: req.ip
        });
    });
    next();
});

// 🛡️ SECURITY & MIDDLEWARE (MILITARY GRADE)
// 1. Helmet: Sets 14+ secure HTTP headers (OWASP Security Misconfiguration)
app.use(helmet());

// 2. Rate Limiting: Professional Tiered Protection
// apiLimiter defined in middlewares/rateLimiter.ts
app.use('/api/v1', apiLimiter);

// Parse JSON payload (Increased to 50kb for reservation stability)
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// 3. XSS Protection: Deep sanitization of HTML & JS tags in body/query/params
app.use(xssClean);

// 4. HTTP Parameter Pollution (HPP) prevent double parameter exploits
app.use(hpp());

// 5. Strict CORS Policy (Prevents Cross-Origin Exploits)
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ["https://sovereign-real-estate.com"] // Restricted prod origin
    : ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000", "http://127.0.0.1:5000"];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// 🔗 DATABASE (Moved to server boot sequence)
// connectDatabase();

// 🚦 ROUTES
app.use('/api/v1', propertyRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);


// Health Check
app.get('/health', (req, res) => {
    res.status(200).send("SOVEREIGN API: SECURE & ONLINE");
});

// 📚 API DOCUMENTATION (SWAGGER)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Sovereign API Docs",
    customCss: '.swagger-ui .topbar { display: none }', // Cleaner enterprise look
}));

// 🛡️ GLOBAL ERROR WATCHTOWER (Sovereign Safety)
import { sendSlackNotification } from './utils/sendSlack';

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ SOVEREIGN CRITICAL ERROR:', err);

    // 🛰️ Alert Slack on Critical Business Errors (500+)
    if (!err.status || err.status >= 500) {
        sendSlackNotification(`*Critical System Error*\n*Path:* ${req.path}\n*Error:* ${err.message}`, 'error');
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Sovereign Engine Error",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;
