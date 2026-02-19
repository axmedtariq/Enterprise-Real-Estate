import express from 'express';
const router = express.Router();

// Import Sovereign Controllers
import {
  getAdvancedProperties,
  getPropertyDetails,
  createProperty
} from '../controllers/propertyController';

import { uploadPropertyImages } from '../controllers/image';

// Import Security Middleware
import { protect, authorize } from '../middlewares/authMiddleware';

/**
 * @section PUBLIC TERMINAL
 * Accessible by the 1.5M Global Network
 */
router.route('/properties').get(getAdvancedProperties);
router.route('/property/:id').get(getPropertyDetails);

/**
 * @section AGENT TERMINAL (ADMIN)
 * Secured via Identity Verification & Role Clearance
 */

// 1. Separate Media Processing (Optimization)
// Upload images first to get Cloudinary URLs
router.route('/admin/assets/upload')
  .post(protect, authorize('ADMIN'), uploadPropertyImages);

// 2. Asset Registration
// Create the final property document with the URLs
router.route('/admin/property/new')
  .post(protect, authorize('ADMIN'), createProperty);

export default router;