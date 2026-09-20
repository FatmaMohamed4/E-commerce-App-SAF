const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        // required: true,
        trim: true
    },

    brand: {
        type: String,
        // required: true,
        trim: true
    },

    price: {
        type: Number,
        // required: true,
        min: 0
    },

    description: {
        type: String,
        // required: true,
        trim: true
    },

    category: {
        type: String,
        // required: true,
        trim: true
    },

    stock: {
        type: Number,
        // required: true,
        min: 0,
        default: 0
    },

    images: [{
        type: String
    }],

    colors: [{
        type: String
    }],

    sizes: [{
        type: String
    }],

    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        comment: {
            type: String,
            trim: true
        },

        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }]

});

module.exports = mongoose.model("Product", productSchema);