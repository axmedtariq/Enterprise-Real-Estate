import { Request, Response } from 'express';
import prisma from '../data/database';

// 💎 GET ALL PROPERTIES (with filtering)
export const getAdvancedProperties = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;

        const where: any = {};
        if (category) where.category = String(category);
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        if (search) {
            where.OR = [
                { title: { contains: String(search) } },
                { address: { contains: String(search) } }
            ];
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const [properties, totalCount] = await Promise.all([
            prisma.property.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: { images: true },
                skip,
                take: limit
            }),
            prisma.property.count({ where })
        ]);

        res.status(200).json({
            success: true,
            count: properties.length,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 💎 GET PROPERTY DETAILS
export const getPropertyDetails = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const property = await prisma.property.findUnique({
            where: { id },
            include: { images: true }
        });

        if (!property) {
            return res.status(404).json({ success: false, message: "Property Not Found" });
        }

        res.status(200).json({ success: true, data: property });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 💎 CREATE PROPERTY (Admin)
export const createProperty = async (req: Request, res: Response) => {
    try {
        console.log("createProperty called");
        console.log("Headers:", req.headers);
        console.log("Body Type:", typeof req.body);
        console.log("Body Content:", JSON.stringify(req.body));

        const { title, price, location, images, description, has3D, category } = req.body || {};

        const property = await prisma.property.create({
            data: {
                title,
                price: Number(price),
                address: location?.address || "Unknown",
                lat: location?.lat || 0,
                lng: location?.lng || 0,
                description,
                has3D: Boolean(has3D),
                category: category || "buy",
                images: {
                    create: images?.map((img: any) => ({
                        publicId: img.public_id || "default",
                        url: img.url
                    })) || []
                }
            }
        });

        // 🧹 PURGE CACHE: Invalidate all property-related caches globally
        const { clearCache } = require('../middlewares/cacheMiddleware');
        await clearCache('sovereign-cache:/api/v1/properties*'); // Pattern clear if implemented, or manually

        res.status(201).json({
            success: true,
            message: "Sovereign Asset Registered",
            data: property
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Creation Failed" });
    }
};
