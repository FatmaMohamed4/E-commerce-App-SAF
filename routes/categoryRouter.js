const express = require("express");
const { addCategory } = require("../controller/categoryController.js");
const categoryMiddleware =require("../middleware/categoryMiddleware.js")
const router = express.Router();

router.post('/add', categoryMiddleware,addCategory)

module.exports=router