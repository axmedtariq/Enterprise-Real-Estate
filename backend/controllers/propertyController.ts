import { Request, Response } from 'express';
import prisma from '../data/database';

// 💎 GET ALL PROPERTIES (with filtering)
export const getAdvancedProperties = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice } = req.query;

        const where: any = {};
        if (category) where.category = String(category);
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { images: true }
        });

        res.status(200).json({
            success: true,
            count: properties.length,
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
