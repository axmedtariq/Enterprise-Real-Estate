import { Request, Response, NextFunction } from 'express';
import Property from '../models/property';
import catchAsyncErrors from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';

// 💎 TYPE DEFINITIONS FOR SOVEREIGN ASSETS
interface IPropertyQuery {
  category?: string;
  price?: { $gte?: number; $lte?: number };
  search?: string;
}

/**
 * @desc    REGISTER NEW ASSET
 * @route   POST /api/v1/admin/property/new
 */
export const createProperty = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  // Add the Agent (Admin) ID to the property
  req.body.user = (req as any).user.id;

  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    message: "Asset Registered in Global Atlas",
    property
  });
});

/**
 * @desc    GET ALL ASSETS (With Sovereign Filtering)
 * @route   GET /api/v1/properties
 */
export const getProperties = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { category, minPrice, maxPrice, search } = req.query;

  let query: any = {};

  // 1. FILTER BY CATEGORY (Villa, Penthouse, etc.)
  if (category) query.category = category;

  // 2. FILTER BY PRICE RANGE
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 3. SEARCH LOGIC (Title or Location)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { "location.address": { $regex: search, $options: 'i' } }
    ];
  }

  const properties = await Property.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    properties,
    intel: "Market data synchronized"
  });
});

/**
 * @desc    GET SINGLE ASSET DETAILS
 * @route   GET /api/v1/property/:id
 */
export const getPropertyDetails = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const property = await Property.findById(req.params.id).populate('user', 'name email');

  if (!property) {
    return next(new ErrorHandler("Asset not found in registry", 404));
  }

  // Increment View Count for the 1.5M views metric
  property.views = (property.views || 0) + 1;
  await property.save();

  res.status(200).json({
    success: true,
    property
  });
});