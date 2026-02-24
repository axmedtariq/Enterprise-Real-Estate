import express from 'express';
import { getSuperAdminStats, updateAgencyStatus, deleteAgency } from '../controllers/adminController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protect);
router.use(authorize('SUPER_ADMIN')); // Upgraded to SUPER_ADMIN

router.get('/stats', getSuperAdminStats);
router.put('/agency/status', updateAgencyStatus);
router.delete('/agency/:id', deleteAgency);

export default router;
