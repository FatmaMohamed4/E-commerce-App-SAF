const express = require("express");
const router = express.Router();

const { register ,login,deleteAllUsers ,forgotPassword ,verifyOTP,resetPassword,updateProfile,getAllUsers} = require("../controller/userController.js");
const userValidator = require("../middleware/userMiddleWare.js");
const adminPermission =require("../middleware/adminPermission.js");
const {authMiddleware,validateRegister} = require("../middleware/userMiddleWare.js");


router.post("/register", validateRegister, register);

router.post("/login",login);

router.delete("/deleteAllUsers",authMiddleware,adminPermission,deleteAllUsers)
router.get('/all',authMiddleware,adminPermission,getAllUsers)
// password 
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);


// update profile
router.put("/profile", authMiddleware, updateProfile);


module.exports = router;
