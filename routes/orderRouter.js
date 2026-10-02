const express = require("express");
const { authMiddleware } = require("../middleware/userMiddleWare.js");
const {createOrder,getOrders,getOrderByID,updateOrderStatus}=require("../controller/orderController.js")
const adminPermission =require("../middleware/adminPermission.js")
const router = express.Router();


router.post(
    "/create",authMiddleware,createOrder
);
router.get("/all",authMiddleware,adminPermission,getOrders)

router.get("/:id",authMiddleware,adminPermission,getOrderByID)
router.put('/update/:id',authMiddleware,adminPermission,updateOrderStatus)
module.exports=router