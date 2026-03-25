import { Request, Response } from 'express';
import prisma from '../data/database';

// GET Dashboard Stats for Sovereign Control Root
export const getSuperAdminStats = async (req: Request, res: Response) => {
    try {
        const usersCount = await prisma.user.count({ where: { role: 'CUSTOMER' } });
        const propertiesCount = await prisma.property.count();
        const agenciesCount = await prisma.agency.count();

        // Calculate Gross Merchandise Volume (GMV) by summing all booking revenues
        const bookingsAggregate = await prisma.booking.aggregate({
            _sum: {
                totalPrice: true
            },
            where: {
                status: {
                    in: ['pending', 'confirmed']
                }
            }
        });
        const gmV = bookingsAggregate._sum.totalPrice || 0;

        // Fetch all partner agencies and their property counts
        const allAgencies = await prisma.agency.findMany({
            select: {
                id: true,
                name: true,
                commissionRate: true,
                status: true,
                _count: {
                    select: { properties: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format for frontend
        const formattedAgencies = allAgencies.map((agency: any) => ({
            id: agency.id,
            name: agency.name,
            commissionRate: agency.commissionRate,
            status: agency.status,
            properties: agency._count.properties
        }));

        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    users: usersCount,
                    agencies: agenciesCount,
                    properties: propertiesCount,
                    gmV: gmV
                },
                agencies: formattedAgencies
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving stats' });
    }
};

// Update Agency Status (Approve / Suspend)
export const updateAgencyStatus = async (req: Request, res: Response) => {
    try {
        const { agencyId, status } = req.body;

        if (!agencyId || !status) {
            return res.status(400).json({ success: false, message: 'Please provide agency ID and new status' });
        }

        const updatedAgency = await prisma.agency.update({
            where: { id: agencyId },
            data: { status: String(status).toUpperCase() },
            select: { id: true, name: true, status: true }
        });

        res.status(200).json({
            success: true,
            message: `Agency ${updatedAgency.name} status updated to ${updatedAgency.status}`,
            data: updatedAgency
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update agency status' });
    }
};

// Permanently Delete Agency (And cascade its properties)
export const deleteAgency = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);

        await prisma.agency.delete({
            where: { id }
        });

        res.status(200).json({ success: true, message: 'Agency and associated data deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete agency' });
    }
};
