const express = require("express");

const { authMiddleware } = require("../middleware/userMiddleWare.js");
const { createPayment } = require("../controller/paymentController.js");

const router = express.Router();

router.post(
    "/create/:orderId",
    authMiddleware,
    createPayment
);

module.exports = router;