const express = require("express");

const router = express.Router();

const {
    getCartByID,
    updateCart,
    deleteFromCart,
    deleteCart,
    addCart
} = require("../controller/cartController.js");

const { authMiddleware } = require("../middleware/userMiddleWare.js");

router.get('/get/:id',authMiddleware,getCartByID)

router.post('/add', authMiddleware, addCart);
// Update quantity
router.put("/update/:productId", authMiddleware, updateCart);


// Delete one product
router.delete("/delete/:productId", authMiddleware, deleteFromCart);


// Delete entire cart
router.delete("/delete", authMiddleware, deleteCart);


module.exports = router;