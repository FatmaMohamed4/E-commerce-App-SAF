
const mongoose = require("mongoose");
const Review = require("../model/reviewSchema.js")
const Product = require("../model/productSchema.js")
// POST /products/:id/reviews
const createReview = async (req, res, next) => {
    try {
        const { id: productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userid;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (
            rating === undefined ||
            !Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const review = await Review.create({
            userId,
            productId,
            rating: Number(rating),
            comment
        });

        return res.status(201).json({
            message: "Review created successfully",
            review
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this product"
            });
        }

        next(error);
    }
};

// GET /products/:id/reviews
const getProductReviews = async (req, res, next) => {
    try {
        const { id: productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const reviews = await Review.find({ productId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: reviews.length,
            reviews
        });
    } catch (error) {
        next(error);
    }
};

// PUT /reviews/:id
const updateReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userid;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }

        if (rating === undefined && comment === undefined) {
            return res.status(400).json({
                message: "Provide rating or comment to update"
            });
        }

        const updates = {};

        if (rating !== undefined) {
            if (
                !Number.isInteger(Number(rating)) ||
                Number(rating) < 1 ||
                Number(rating) > 5
            ) {
                return res.status(400).json({
                    message: "Rating must be an integer between 1 and 5"
                });
            }

            updates.rating = Number(rating);
        }

        if (comment !== undefined) {
            updates.comment = comment;
        }

        const review = await Review.findOneAndUpdate(
            { _id: id, userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!review) {
            const exists = await Review.exists({ _id: id });

            if (!exists) {
                return res.status(404).json({
                    message: "Review not found"
                });
            }

            return res.status(403).json({
                message: "You can only update your own review"
            });
        }

        return res.status(200).json({
            message: "Review updated successfully",
            review
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /reviews/:id
const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userid;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }

        const review = await Review.findOneAndDelete({
            _id: id,
            userId
        });

        if (!review) {
            const exists = await Review.exists({ _id: id });

            if (!exists) {
                return res.status(404).json({
                    message: "Review not found"
                });
            }

            return res.status(403).json({
                message: "You can only delete your own review"
            });
        }

        return res.status(200).json({
            message: "Review deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
};
