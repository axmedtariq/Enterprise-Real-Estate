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

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

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
