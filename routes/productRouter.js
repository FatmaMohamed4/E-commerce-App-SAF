const express = require("express");

const router = express.Router();

const {
    addProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    updateProduct,
    deleteProduct,
    deleteAllProducts
} = require("../controller/productController.js");

const { authMiddleware } = require("../middleware/userMiddleWare.js");
const adminPermission = require("../middleware/adminPermission.js");
const productMiddleware = require("../middleware/productMiddleware.js");



// ==================== ADMIN ROUTES ====================

// Add product
router.post(
    "/add",
    authMiddleware,
    adminPermission,
    productMiddleware,
    addProduct
);

// Update product
router.put(
    "/:id",
    authMiddleware,
    adminPermission,
    updateProduct
);


// Delete product
router.delete(
    "/:id",
    authMiddleware,
    adminPermission,
    deleteProduct
);


// Delete all products
router.delete(
    "/deleteAll",
    authMiddleware,
    adminPermission,
    deleteAllProducts
);


// ==================== PUBLIC ROUTES ====================

// Get all products
router.get(
    "/all",
    getAllProducts
);


// Get product by name
router.get(
    "/name/:name",
    getProductByName
);


// Get product by ID
router.get(
    "/:id",
    getProductById
);


module.exports = router;