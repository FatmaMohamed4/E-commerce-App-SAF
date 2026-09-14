const express = require("express");
const router = express.Router();

const { register ,login,deleteAllUsers ,forgotPassword ,verifyOTP,resetPassword} = require("../controller/userController.js");
const userValidator = require("../middleware/userMiddleWare.js");
const adminPermission =require("../middleware/adminPermission.js");
const userMiddleWare = require("../middleware/userMiddleWare.js");


router.post("/register", userValidator, register);

router.post("/login",login);

router.delete("/deleteAllUsers",userMiddleWare,adminPermission,deleteAllUsers)

// password 
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);


module.exports = router;
