const axios = require("axios");
const Order = require("../model/orderSchema.js");

const createPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.userid;

        const order = await Order.findOne({
            _id: orderId,
            userId,
            paymentStatus: "pending"
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const amount = Math.round(order.totalPrice * 100);

        const response = await axios.post(
            "https://accept.paymob.com/v1/intention/",
            {
                amount,
                currency: "EGP",

                payment_methods: [
                    Number(process.env.PAYMOB_INTEGRATION_ID)
                ],

                items: [],

                billing_data: {
                    apartment: "NA",
                    first_name: "Customer",
                    last_name: "User",
                    street: "NA",
                    building: "NA",
                    phone_number: "01000000000",
                    city: "Cairo",
                    country: "EG",
                    email: "customer@example.com",
                    floor: "NA",
                    state: "Cairo"
                },

                special_reference: orderId
            },
            {
                headers: {
                    Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("PAYMOB RESPONSE:", response.data);

        return res.status(200).json({
            message: "Payment initialized 🎉",
            clientSecret: response.data.client_secret,
            paymobOrderId: response.data.order?.id,
            intentionId: response.data.id
        });

    } catch (error) {
        console.log(
            "Paymob Error:",
            error.response?.data || error.message
        );

        next(error);
    }
};

module.exports = {
    createPayment
};