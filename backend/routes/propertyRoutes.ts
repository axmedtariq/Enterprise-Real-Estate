import express from 'express';
import {
    getAdvancedProperties,
    getPropertyDetails,
    createProperty
} from '../controllers/propertyController';

const router = express.Router();

// Public Routes
router.get('/properties', getAdvancedProperties);
router.get('/property/:id', getPropertyDetails);

// Admin Routes (To be protected with middleware)
router.post('/admin/property/new', createProperty);

// Booking Routes
import { createBooking, getPropertyBookings } from '../controllers/bookingController';
router.post('/bookings', createBooking);
router.get('/bookings/:propertyId', getPropertyBookings);

export default router;
