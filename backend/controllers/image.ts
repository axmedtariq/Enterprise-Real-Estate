import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";

// Ensure cloudinary v2
const cloudinaryV2 = cloudinary.v2;

interface UploadedImage {
  public_id: string;
  url: string;
}

interface UploadPropertyImagesRequest extends Request {
  body: {
    images?: string[] | string;
  };
}

export const uploadPropertyImages = catchAsyncErrors(
  async (req: UploadPropertyImagesRequest, res: Response, next: NextFunction) => {
    let images = req.body.images;

    if (!images || (Array.isArray(images) && images.length === 0)) {
      return next(new ErrorHandler("No visual assets provided for upload", 400));
    }

    // Ensure we are working with an array
    const imagesArray: string[] = Array.isArray(images) ? images : [images];

    // 💎 ELITE PARALLEL UPLOAD: Uploads all images simultaneously
    const uploadPromises: Promise<cloudinary.UploadApiResponse>[] = imagesArray.map(
      (image) =>
        cloudinaryV2.uploader.upload(image, {
          folder: "sovereign_properties",
          resource_type: "image",
          transformation: [
            { fetch_format: "auto", quality: "auto" }, // best compression/quality
            { width: 1920, crop: "limit" }, // limit width
            {
              overlay: "sovereign_watermark",
              opacity: 15,
              width: 300,
              gravity: "center",
              effect: "brightness:30",
            },
          ],
        })
    );

    const results = await Promise.all(uploadPromises);

    const imagesLinks: UploadedImage[] = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    res.status(200).json({
      success: true,
      count: imagesLinks.length,
      images: imagesLinks,
      network_status: "Global CDN Synchronized",
    });
  }
);
