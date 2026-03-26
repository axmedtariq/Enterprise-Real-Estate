import express from 'express';
import {
    getAdvancedProperties,
    getPropertyDetails,
    createProperty
} from '../controllers/propertyController';

const router = express.Router();

// Public Routes
import { cache } from '../middlewares/cacheMiddleware';
import { searchLimiter } from '../middlewares/rateLimiter';

/**
 * @openapi
 * /api/v1/properties:
 *   get:
 *     tags: [Properties]
 *     summary: Retrieve advanced property listings
 *     description: Returns a list of properties with full details. Supports Redis caching.
 *     responses:
 *       200:
 *         description: A list of properties
 */
router.get('/properties', searchLimiter, cache(3600), getAdvancedProperties); // Cache for 1 hour

/**
 * @openapi
 * /api/v1/property/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get specific property details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Property not found
 */
router.get('/property/:id', searchLimiter, cache(600), getPropertyDetails); 

import { protect, authorize } from '../middlewares/authMiddleware';

// Admin Routes (To be protected with middleware)
// Admin Routes
router.post('/admin/property/new', protect, authorize('ADMIN'), createProperty);

// Booking Routes (Protected)
import { createBooking, getPropertyBookings, createCheckoutSession } from '../controllers/bookingController';
router.post('/bookings', protect, createBooking);
router.post('/bookings/checkout', protect, createCheckoutSession);
router.get('/bookings/:propertyId', protect, getPropertyBookings);

export default router;
