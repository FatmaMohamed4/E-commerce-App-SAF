const express = require('express');
const router = express.Router();
const { uploadImagesMiddleware, uploadProductImages } = require("../middleware/uploadMiddleware.js")

router.patch('/product/upload/:id', uploadImagesMiddleware, uploadProductImages);

module.exports = router;