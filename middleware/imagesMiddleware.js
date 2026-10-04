const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../model/productSchema.js');

// 1. Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// 2. استخدام Memory Storage المخصص لبيئات Serverless مثل Vercel
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload image files only.'), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadImagesMiddleware = upload.array('photos', 10);

// 3. رفع الصور مباشرة من الـ Buffer إلى Cloudinary
const uploadProductImages = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please select at least one image file to upload.'
      });
    }

    // الرفع من الذاكرة (buffer) باستخدام upload_stream
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    });

    const photoUrls = await Promise.all(uploadPromises);

    // تحديث قاعدة البيانات
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
const getProductImages = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    // البحث عن المنتج في قاعدة البيانات وجلب حقل الصور فقط
    const product = await Product.findById(productId).select('images');

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found with the provided ID.'
      });
    }

    // إرجاع قائمة الصور
    res.status(200).json({
      status: 'success',
      count: product.images ? product.images.length : 0,
      data: {
        images: product.images || []
      }
    });

  } catch (error) {
    console.error('Get Images Error:', error);
    next(error);
  }
};


module.exports = {
  uploadImagesMiddleware,
  uploadProductImages,
  getProductImages
};