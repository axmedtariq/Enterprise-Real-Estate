import { Request, Response } from 'express';
import prisma from '../data/database';

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
