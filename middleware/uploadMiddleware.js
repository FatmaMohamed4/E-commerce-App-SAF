const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Product = require('../model/productSchema.js'); 

// 1. Cloudinary Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// 2. Multer Storage Engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// 3. File Filter (Images Only)
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload image files only.'), false);
  }
}

// 4. Initialize Multer with a max limit of 10 files
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
});

// Middleware for handling up to 10 photos with field name 'photos'
const uploadImagesMiddleware = upload.array('photos', 10);

// 5. Upload Multiple Product Images Controller
const uploadProductImages = async (req, res, next) => {
  try {
    // ✅ التصحيح هنا: استخراج الـ id وتسميته productId
    const { id: productId } = req.params;

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please select at least one image file to upload.'
      });
    }

    // Upload all images to Cloudinary in parallel
    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products'
      });

      // Delete the temporary file from local server after uploading to Cloudinary
      fs.unlinkSync(file.path);

      return result.secure_url;
    });

    const photoUrls = await Promise.all(uploadPromises);

    // Update product in DB (appending new images to existing array)
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { images: {$each: photoUrls } } },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found with the provided ID.'
      });
    }

    // Success response
    res.status(200).json({
      status: 'success',
      message: `${photoUrls.length} image(s) uploaded successfully.`,
      data: {
        product: updatedProduct
      }
    });

  } catch (error) {
    console.error('Upload Error:', error);
    next(error);
  }
};

module.exports = {
  uploadImagesMiddleware,
  uploadProductImages
};