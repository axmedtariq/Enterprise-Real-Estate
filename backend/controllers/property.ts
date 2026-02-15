import { Request, Response, NextFunction } from 'express';
import Property from '../models/propertyModel';
import catchAsyncErrors from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';

// 💎 INTERFACE FOR ADVANCED SEARCH
interface IPropertyQuery {
  companyId: string;
  $or?: any[];
  amenities?: { $in: string[] };
  price?: { $gte?: number; $lte?: number };
  location?: {
    $near?: {
      $geometry: { type: "Point"; coordinates: [number, number] };
      $maxDistance: number;
    };
  };
}

export const getAdvancedProperties = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { 
    keyword, minPrice, maxPrice, 
    lat, lng, range, 
    page = 1, isAIRecommendation 
  } = req.query;

  // 1. 🛡️ MANDATORY COMPANY ISOLATION (Security Layer)
  const companyId = req.headers['x-company-id'] as string;
  if (!companyId) return next(new ErrorHandler("Portal ID required for data sync", 401));

  let query: Partial<IPropertyQuery> = { companyId };

  // 2. 🔍 INTELLIGENT KEYWORD SEARCH
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword as string, $options: 'i' } },
      { "location.address": { $regex: keyword as string, $options: 'i' } }
    ];
  }

  // 3. 🤖 AI PREFERENCE INJECTION (Personalization Layer)
  // Accessing user profile tags (e.g., "Sea View", "Smart Home")
  const user = (req as any).user;
  if (isAIRecommendation === 'true' && user?.preferredTags) {
    query.amenities = { $in: user.preferredTags };
  }

  // 4. 💰 WEALTH BRACKET FILTERING
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 5. 📍 GEOSPATIAL RADIUS (Map Layer)
  // Returns properties within X meters of a specific lat/lng
  if (lat && lng && range) {
    query.location = {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(range) // range in meters
      }
    };
  }

  // 6. EXECUTE WITH PERFORMANCE OPTIMIZATION
  const resPerPage = 12;
  const skip = resPerPage * (Number(page) - 1);

  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .limit(resPerPage)
    .skip(skip)
    .populate('agent', 'name avatar');

  const totalCount = await Property.countDocuments(query);

  res.status(200).json({
    success: true,
    count: properties.length,
    totalCount,
    currentPage: Number(page),
    totalPages: Math.ceil(totalCount / resPerPage),
    data: properties,
    intel: isAIRecommendation === 'true' ? "AI_OPTIMIZED_RESULTS" : "STANDARD_QUERY"
  });
});