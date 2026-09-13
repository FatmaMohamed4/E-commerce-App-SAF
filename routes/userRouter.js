const express = require("express");
const router = express.Router();

const { register ,login,deleteAllUsers } = require("../controller/userController.js");
const userValidator = require("../middleware/userMiddleWare.js");
const adminPermission =require("../middleware/adminPermission.js")
router.post("/register", userValidator, register);

router.post("/login",login);

router.delete("/deleteAllUsers",userValidator,adminPermission,deleteAllUsers)
module.exports = router;