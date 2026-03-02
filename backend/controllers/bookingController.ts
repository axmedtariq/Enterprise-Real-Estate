import { Request, Response } from 'express';
import prisma from '../data/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

// 📅 CREATE BOOKING
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { propertyId, startDate, endDate, totalPrice, guestId } = req.body;

        // Check for overlaps
        const start = new Date(startDate);
        const end = new Date(endDate);

        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                propertyId,
                OR: [
                    { startDate: { lte: end }, endDate: { gte: start } }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(400).json({ success: false, message: "Dates already booked." });
        }

        let finalGuestId = guestId;

        if (!finalGuestId) {
            const guestUser = await prisma.user.upsert({
                where: { email: 'guest@sovereign.com' },
                update: {},
                create: {
                    name: 'Guest User',
                    email: 'guest@sovereign.com',
                    password: 'no-password',
                    role: 'GUEST'
                }
            });
            finalGuestId = guestUser.id;
        }

        const booking = await prisma.booking.create({
            data: {
                propertyId,
                startDate: start,
                endDate: end,
                totalPrice: Number(totalPrice),
                guestId: finalGuestId,
                status: "confirmed"
            }
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Booking Failed" });
    }
};

// 📅 GET PROPERTY BOOKINGS (Availability)
export const getPropertyBookings = async (req: Request, res: Response) => {
    try {
        const propertyId = String(req.params.propertyId);
        const bookings = await prisma.booking.findMany({
            where: { propertyId },
            select: { startDate: true, endDate: true }
        });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching availability" });
    }
};

// 💳 CREATE STRIPE CHECKOUT SESSION
export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { propertyId, startDate, endDate, totalPrice, guestId } = req.body;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        // Add 5000 concierge fee (fixed)
        const totalAmount = (Number(totalPrice) + 5000) * 100; // in cents

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Booking for ${property.title}`,
                            description: `Dates: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
                        },
                        unit_amount: totalAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/success?property_id=${propertyId}`,
            cancel_url: `http://localhost:3000/property/${propertyId}`,
            metadata: {
                propertyId,
                startDate,
                endDate,
                guestId: guestId || 'GUEST_USER'
            }
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Stripe Session Failed" });
    }
};