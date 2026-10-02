const Order = require("../model/orderSchema.js");
const Cart = require("../model/cartSchema.js");
const Product = require("../model/productSchema.js");

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userid;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.productName}`
        });
      }

      orderItems.push({
        productId: product._id,
        productName: product.productName,
        quantity: item.quantity,
        price: product.price
      });
    }

    const totalPrice = orderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    const order = await Order.create({
      userId,
      items: orderItems,
      totalPrice,
      status: "pending",
      paymentMethod: "paymob",
      paymentStatus: "pending"
    });

    // decrease stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity
          }
        }
      );
    }

    // clear cart
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      order
    });


    
  } catch (error) {
    next(error);
  }
};


const getOrders = async (req, res, next) => {
    try {

        const orders = await Order.find()
            .populate("userId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All orders fetched successfully",
            orders
        });

    } catch (error) {
        next(error);
    }
};
const getOrderByID = async (req, res, next) => {
    try {

        const order = await Order.findById(req.params.id)

        return res.status(200).json({
           order
        });

    } catch (error) {
        next(error);
    }
};


const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        next(error);
    }
};




module.exports = {
  createOrder,
  getOrders,getOrderByID ,updateOrderStatus
};