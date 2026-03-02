import express from 'express';
import {
    getAdvancedProperties,
    getPropertyDetails,
    createProperty
} from '../controllers/propertyController';

const router = express.Router();

// Public Routes
import { cache } from '../middlewares/cacheMiddleware';
router.get('/properties', cache(3600), getAdvancedProperties); // Cache for 1 hour (Enterprise Scale)
router.get('/property/:id', cache(600), getPropertyDetails); // Cache specific property for 10 min

import { protect, authorize } from '../middlewares/authMiddleware';

// Admin Routes (To be protected with middleware)
router.post('/admin/property/new', protect, authorize('ADMIN'), createProperty);

// Booking Routes
import { createBooking, getPropertyBookings, createCheckoutSession } from '../controllers/bookingController';
router.post('/bookings', createBooking);
router.post('/bookings/checkout', createCheckoutSession);
router.get('/bookings/:propertyId', getPropertyBookings);

export default router;
