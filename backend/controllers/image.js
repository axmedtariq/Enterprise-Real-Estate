// backend/controllers/imageController.js
const cloudinary = require('cloudinary').v2;

exports.uploadPropertyImages = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "properties",
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }]
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  res.status(200).json({
    success: true,
    images: imagesLinks
  });
});