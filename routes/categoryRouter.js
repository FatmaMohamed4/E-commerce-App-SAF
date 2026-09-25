const express = require("express");
const { addCategory, getAll, getCategoryByID,deleteCategory, updateCategory } = require("../controller/categoryController.js");
const categoryMiddleware =require("../middleware/categoryMiddleware.js");
const { authMiddleware } = require("../middleware/userMiddleWare.js");
const adminPermission = require("../middleware/adminPermission.js");
const router = express.Router();

router.post(
    '/add',
    authMiddleware,
    adminPermission,
    categoryMiddleware,
    addCategory
);


router.get('/getAll',getAll)
router.get('/:id',getCategoryByID)


router.delete('/delete/:id',authMiddleware,
    adminPermission,
    deleteCategory
)

router.put('/update/:id',authMiddleware,
    adminPermission,
    updateCategory
)

module.exports=router