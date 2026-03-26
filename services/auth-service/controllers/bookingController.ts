import { Request, Response } from 'express';
import prisma from '../data/database';
import Stripe from 'stripe';
let stripe: Stripe;

// 💳 STRIPE INITIALIZATION (Elite Grade)
const getStripe = () => {
    if (!stripe) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key || key.includes('...')) {
            console.error('❌ SOVEREIGN SECURITY: Stripe Secret Key is missing or invalid (placeholder detected).');
            throw new Error('STRIPE_CONFIG_ERROR');
        }
        stripe = new Stripe(key, {
            apiVersion: '2024-06-20' as any, // Using stable enterprise version
        });
    }
    return stripe;
};

// 📅 CREATE BOOKING (Hardened & Financially Validated)
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { propertyId, startDate, endDate } = req.body;
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        // 1. Fetch the absolute source of truth for pricing
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { id: true, price: true }
        });

        if (!property) {
            return res.status(404).json({ success: false, message: "Asset Not Found" });
        }

        // 2. Calculate Nights Securely
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({ success: false, message: "Invalid residency period." });
        }

        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const nights = Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay);

        if (nights <= 0) {
            return res.status(400).json({ success: false, message: "Stays must be at least 1 night." });
        }

        // 3. SERVER-SIDE PRICE RE-CALCULATION (Anti-Manipulation)
        // We ignore any 'totalPrice' sent from the client-side to prevent fraud.
        const calculatedTotalPrice = property.price * nights;

        // 4. Double-Booking Mitigation (Race Condition Protection)
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                propertyId,
                status: { not: "cancelled" },
                OR: [
                    { startDate: { lte: end }, endDate: { gte: start } }
                ]
            }
        });

        if (conflictingBooking) {
            return res.status(400).json({ success: false, message: "Dates already reserved." });
        }

        const booking = await prisma.booking.create({
            data: {
                propertyId,
                startDate: start,
                endDate: end,
                totalPrice: calculatedTotalPrice, // Use the server-side truth!
                guestId: user.id,
                status: "confirmed"
            }
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        console.error("❌ SOVEREIGN BOOKING ERROR:", error);
        res.status(500).json({ success: false, message: "System failure during asset reservation." });
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
        console.log(`💳 Initiating Sovereign Checkout for Asset: ${propertyId}`);

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            console.error(`❌ Checkout Failed: Asset ${propertyId} not found.`);
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        const totalAmount = (Number(totalPrice) + 5000) * 100;

        try {
            const session = await getStripe().checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `Sovereign Booking: ${property.title}`,
                                description: `Exclusive Residency: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
                            },
                            unit_amount: totalAmount,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${req.headers.origin || 'http://localhost:3000'}/success?property_id=${propertyId}`,
                cancel_url: `${req.headers.origin || 'http://localhost:3000'}/property/${propertyId}`,
                metadata: {
                    propertyId,
                    startDate,
                    endDate,
                    guestId: guestId || 'GUEST_USER'
                }
            });

            console.log(`✅ Session Created: ${session.id}`);
            res.status(200).json({ success: true, url: session.url });
        } catch (stripeErr: any) {
            console.error("❌ Stripe Session Creation Failed:", stripeErr.message);
            if (stripeErr.message.includes("api_key")) {
                return res.status(400).json({
                    success: false,
                    message: "Sovereign Payment Layer is currently in sandbox mode with an invalid key. Please update STRIPE_SECRET_KEY in .env"
                });
            }
            throw stripeErr;
        }
    } catch (error: any) {
        console.error("❌ Checkout Controller Error:", error);
        res.status(error.message === 'STRIPE_CONFIG_ERROR' ? 400 : 500).json({
            success: false,
            message: error.message === 'STRIPE_CONFIG_ERROR' ? "Payment configuration error. Check server logs." : "Checkout Synchronization Failed"
        });
    }
};