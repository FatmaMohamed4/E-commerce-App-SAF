const Product = require("../model/productSchema.js");
const Category = require("../model/categorySchema.js");

const addCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        console.log("NAME:", name);

        const existCategory = await Category.findOne({ name });

        console.log("EXIST:", existCategory);

        if (existCategory) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        const category = await Category.create({ name });

        return res.status(201).json({
            message: "Category Created",
            category
        });

    } catch (error) {
        console.log("ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Category name already exists"
            });
        }

        next(error);
    }
};



const getAll =async (req,res,next)=>{
    try{
        let data = await Category.find()

          res.status(200).json({
            message:"Data Found :",
            categories : data
        })  

    }catch(error){
        next(error)
    }
}


const getCategoryByID = async (req, res, next) => {
    try {
        const data = await Category
            .findById(req.params.id)
            .populate("products");

        if (!data) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            Category: data
        });

    } catch (error) {
        next(error);
    }
};

const deleteCategory =async(req,res,next)=>{
    try{
        const category =await Category.findByIdAndDelete(req.params.id)
        if(!category){
            return res.status(404).json({
                message: "Category not found"
            });
        }
        res.status(200).json({
            message: "Category Deleted"
        });

    }catch(error){
        next(error);
    }
}
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        

       
        // Check if another category has the same name
        const existCategory = await Category.findOne({
            name,
            _id: { $ne: id }
        });

        if (existCategory) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        next(error);
    }
};



module.exports={
    addCategory,
    getAll ,
    getCategoryByID,
    deleteCategory,
    updateCategory
}