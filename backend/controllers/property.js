// backend/controllers/propertyController.js
const Property = require('../models/property');
const catchAsyncErrors = require('../middleware/catchAsyncErrors'); // Middleware to handle try/catch

exports.getAdvancedProperties = catchAsyncErrors(async (req, res, next) => {
  const { 
    keyword, 
    minPrice, 
    maxPrice, 
    amenities, 
    lat, 
    lng, 
    range, 
    sort, 
    page = 1 
  } = req.query;

  // 1. Initialize empty query object
  let query = {};

  // 2. Keyword Search (Title or Address)
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { "location.address": { $regex: keyword, $options: 'i' } }
    ];
  }

  // 3. Price Range Filtering
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 4. Amenities Filtering (Matches all selected amenities)
  if (amenities) {
    const amenitiesArray = amenities.split(',');
    query.amenities = { $all: amenitiesArray };
  }

  // 5. Advanced Geospatial Search (Location-based)
  // Logic: Find properties within 'range' (km) of 'lat/lng'
  if (lat && lng) {
    const radius = range ? range / 6371 : 10 / 6371; // Default 10km radius (in radians)
    query["location.coordinates"] = {
      $geoWithin: {
        $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius]
      }
    };
  }

  // 6. Sorting Logic (Price High/Low, Newest)
  let sortBy = { createdAt: -1 }; // Default: Newest first
  if (sort === 'price_asc') sortBy = { price: 1 };
  if (sort === 'price_desc') sortBy = { price: -1 };

  // 7. Pagination Logic
  const resPerPage = 12;
  const skip = resPerPage * (page - 1);

  // 8. Execute Query with Pagination
  const properties = await Property.find(query)
    .sort(sortBy)
    .limit(resPerPage)
    .skip(skip)
    .populate('agent', 'name avatar'); // Get agent details for the UI

  const totalCount = await Property.countDocuments(query);

  res.status(200).json({
    success: true,
    results: properties.length,
    totalCount,
    resPerPage,
    data: properties
  });
});