import express from 'express';
import cors from 'cors';
import { connectDatabase } from './data/database';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as client from 'prom-client'; // Monitoring

// Import Routes
import propertyRoutes from './routes/propertyRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

// 🛡️ SECURITY & MIDDLEWARE
app.use(helmet()); // Set Secure HTTP Headers

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" })); // Configure strictly for production

// 🔗 DATABASE
connectDatabase();

// 🚦 ROUTES
app.use('/api/v1', propertyRoutes);
app.use('/api/v1/auth', authRoutes);


// Health Check
app.get('/health', (req, res) => {
    res.status(200).send("SOVEREIGN API: ONLINE");
});

// 📊 MONITORING
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

export default app;
