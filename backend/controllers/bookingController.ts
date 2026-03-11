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