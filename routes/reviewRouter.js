
const express = require("express");
const router = express.Router();

const {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
} = require("../controller/reviewController.js");

const {authMiddleware} = require("../middleware/userMiddleWare.js")

// Product review routes
router.post(
    "/:id",
    authMiddleware,
    createReview
);

router.get(
    "/products/:id",
    getProductReviews
);

// Review-specific routes
router.put(
    "/update/:id",
    authMiddleware,
    updateReview
);

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteReview
);

module.exports = router;
