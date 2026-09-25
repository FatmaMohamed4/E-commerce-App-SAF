const Product = require("../model/productSchema.js");
const Category =require("../model/categorySchema.js")
const jwt=require("jsonwebtoken")
// ==================== ADD PRODUCT ====================

const addProduct = async (req, res, next) => {
    try {
        const {
            productName,
            brand,
            price,
            description,
            category,
            stock,
            images,
            colors,
            sizes,
            discount
        } = req.body;

        const existCategory = await Category.findById(category);

        if (!existCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const product = await Product.create({
            productName,
            brand,
            price,
            description,
            category,
            stock,
            images,
            colors,
            sizes,
            discount
        });
        existCategory.products.push(product._id);

        await existCategory.save();
        return res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        next(error);
    }
};


// ==================== GET ALL PRODUCTS ====================

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        next(error);
    }
};


// ==================== GET PRODUCT BY ID ====================

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            product
        });

    } catch (error) {
        next(error);
    }
};


// ==================== GET PRODUCT BY NAME ====================

const getProductByName = async (req, res, next) => {
    try {
        const { name } = req.params;

        const product = await Product.findOne({
            productName: {
                $regex: `^${name}$`,
                $options: "i"
            }
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product found successfully",
            product
        });

    } catch (error) {
        next(error);
    }
};


// ==================== UPDATE PRODUCT ====================

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        next(error);
    }
};


// ==================== DELETE PRODUCT ====================

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            product
        });

    } catch (error) {
        next(error);
    }
};


// ==================== DELETE ALL PRODUCTS ====================

const deleteAllProducts = async (req, res, next) => {
    try {
        const result = await Product.deleteMany({});

        return res.status(200).json({
            message: "All products deleted successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        next(error);
    }
};


// ==================== EXPORTS ====================

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    updateProduct,
    deleteProduct,
    deleteAllProducts
};