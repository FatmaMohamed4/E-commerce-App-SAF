const Cart = require("../model/cartSchema.js");
const Product = require("../model/productSchema.js");

const addCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const userId = req.user.userid;

        // 1. Check product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 2. Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        // 3. Find user's cart
        let cart = await Cart.findOne({ userId });

        // 4. Create cart if doesn't exist
        if (!cart) {
            cart = new Cart({
                userId,
                items: [
                    {
                        productId,
                        quantity,
                        price: product.price
                    }
                ],
                totalPrice: product.price * quantity
            });

            await cart.save();

            return res.status(201).json({
                message: "Product added to cart",
                cart
            });
        }

        // 5. Check if product already exists
        const existingItem = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.price
            });
        }

        // 6. Calculate total price
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        await cart.save();

        return res.status(200).json({
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {
        next(error);
    }
};


// const addCart = async (req, res, next) => {
//     try {
//         const { productId, quantity } = req.body;

//         const userId = req.user.userid;

//         const cartQuantity = Number(quantity);

//         if (!productId || !Number.isFinite(cartQuantity) || cartQuantity < 1) {
//             return res.status(400).json({
//                 message: "Invalid productId or quantity"
//             });
//         }

//         // Find product
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({
//                 message: "Product not found"
//             });
//         }

//         const productPrice = Number(product.price);

//         if (!Number.isFinite(productPrice)) {
//             return res.status(400).json({
//                 message: "Product price is invalid",
//                 price: product.price
//             });
//         }

//         // Check stock
//         if (product.stock < cartQuantity) {
//             return res.status(400).json({
//                 message: "Not enough stock"
//             });
//         }

//         // Find user's cart
//         let cart = await Cart.findOne({ userId });

//         // Create cart
//         if (!cart) {
//             cart = new Cart({
//                 userId,
//                 items: [
//                     {
//                         productId: product._id,
//                         quantity: cartQuantity,
//                         price: productPrice
//                     }
//                 ],
//                 totalPrice: productPrice * cartQuantity
//             });

//             await cart.save();

//             return res.status(201).json({
//                 message: "Product added to cart",
//                 cart
//             });
//         }

//         // Check if product already exists
//         const existingItem = cart.items.find(
//             item => item.productId.toString() === productId
//         );

//         if (existingItem) {

//             existingItem.quantity += cartQuantity;

//         } else {

//             cart.items.push({
//                 productId: product._id,
//                 quantity: cartQuantity,
//                 price: productPrice
//             });

//         }

//         // Calculate total price
//         cart.totalPrice = cart.items.reduce(
//             (total, item) => {
//                 return total + Number(item.price) * Number(item.quantity);
//             },
//             0
//         );

//         await cart.save();

//         return res.status(200).json({
//             message: "Cart updated successfully",
//             cart
//         });

//     } catch (error) {
//         next(error);
//     }
// };



const getCartByID =async (req,res,next)=>{
    try{
        let cart = await Cart.findById(req.params.id)
        if(!cart){
            res.status(404).json({
                message:"cart not found"
            })
        }
        res.status(200).json({
                cart
        })

    }catch(error){
        next(error)
    }
}




// =========================
// DELETE ONE PRODUCT
// DELETE /cart/:productId
// =========================

const deleteFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const userId = req.user.userid;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce(
            (total, item) => {
                return total + item.price * item.quantity;
            },
            0
        );

        await cart.save();

        return res.status(200).json({
            message: "Product removed from cart",
            cart
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// DELETE ENTIRE CART
// DELETE /cart
// =========================

const deleteCart = async (req, res, next) => {
    try {
        const userId = req.user.userid;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();

        return res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        next(error);
    }
};


// =========================
// UPDATE CART QUANTITY
// PUT /cart/:productId
// =========================

const updateCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const userId = req.user.userid;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        item.quantity = quantity;

        cart.totalPrice = cart.items.reduce(
            (total, item) => {
                return total + item.price * item.quantity;
            },
            0
        );

        await cart.save();

        return res.status(200).json({
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addCart,
    getCartByID,
    deleteFromCart,
    deleteCart,
    updateCart



};