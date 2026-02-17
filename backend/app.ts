import express from 'express';
import cors from 'cors';
import { connectDatabase } from './data/database';

// Import Routes
import propertyRoutes from './routes/propertyRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

// 🛡️ SECURITY & MIDDLEWARE
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

export default app;
