import express from 'express';
import cors from 'cors';
import { connectDatabase } from './data/database';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import * as client from 'prom-client'; // Monitoring
import { xssClean } from './middlewares/xss'; // OWASP XSS Protection

// Import Routes
import propertyRoutes from './routes/propertyRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// 🛡️ SECURITY & MIDDLEWARE (MILITARY GRADE)
// 1. Helmet: Sets 14+ secure HTTP headers (OWASP Security Misconfiguration)
app.use(helmet());

// 2. Rate Limiting: Prevent Brute Force & DDoS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Strict 100 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, strict rate-limit enforced.'
});
app.use(limiter);

// Parse JSON payload (Size limited to 10kb to prevent payload overflow attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. XSS Protection: Deep sanitization of HTML & JS tags in body/query/params
app.use(xssClean);

// 4. HTTP Parameter Pollution (HPP) prevent double parameter exploits
app.use(hpp());

// 5. Strict CORS Policy (Prevents Cross-Origin Exploits)
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"], // Set strict production hosts later
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// 🔗 DATABASE
connectDatabase();

// 🚦 ROUTES
app.use('/api/v1', propertyRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);


// Health Check
app.get('/health', (req, res) => {
    res.status(200).send("SOVEREIGN API: SECURE & ONLINE");
});

// 📊 MONITORING
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

export default app;
