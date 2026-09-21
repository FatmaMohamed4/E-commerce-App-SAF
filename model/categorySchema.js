const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
});

module.exports = mongoose.model("Category", categorySchema);