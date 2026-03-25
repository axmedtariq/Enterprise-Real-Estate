import express from 'express';
import {
    register,
    login,
    enable2FA,
    verify2FA,
    forgotPassword,
    resetPassword,
    getMe
} from '../controllers/authController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { authLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema, resetPasswordSchema } from '../utils/validations';

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, email]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', authLimiter, validate(registerSchema), register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in to get a JWT session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);

// Protected Routes
router.use(protect);
router.get('/me', getMe);

// 2FA Management
router.post('/2fa/enable', enable2FA);
router.post('/2fa/verify', verify2FA);

// Admin Only Example (placeholder)
router.get('/admin', authorize('ADMIN'), (req, res) => {
    res.status(200).json({ message: 'Admin Access Granted' });
});

export default router;
