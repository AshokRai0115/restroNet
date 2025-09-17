const CategorySchema = require("../models/categoryModel");

module.exports.all_category = async (req, res, next) => {
    try{
        const allCategories = await CategorySchema.find();
        return res.status(200).json({
            count: allCategories.length, data: allCategories
        }) 
    }catch(error){
        next(error);
    }
    
}

module.exports.create_category = async (req, res, next) => {
    const newCategory = req.body;
    console.log(newCategory, '.............................')
    try{
        const category = await CategorySchema.create(newCategory);
        res.status(201).json({
            msg: "Category created successfully.",
            data: Categorybar,
            success: true
        })
    }catch(error){
        next(error)
    }
}

module.exports.update_category = async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;

    try{
    const updatedCategory = await CategorySchema.findByIdAndUpdate(id, data, {
        new: true
    })
    if(updatedCategory){
         res.status(200).json({
                success: true,
                data: updatedCategory,
                message: "Category updated successfully."
            })
    }
    if(!updatedCategory){
            res.status(404).json({
                success: false,
                data: '',
                message: "Category not found."
            })
        }

    }catch(error){
        next(error);
    }
}

module.exports.get_single_category = async (req, res, next) =>{
    const id = req.params.id;
   try{
     const singleCategory = await CategorySchema.findById(id);
    res.status(200).json({
        success: true,
        data: singleCategory,
        message: "Category fetched successfully."
    })
    if(!singleCategory){
         res.status(404).json({
                success: false,
                data: '',
                message: "Category not found."
            })
    }
   }catch(error){
    next(error)
   }
}

module.exports.delete_category = async (req, res, next) =>{
    const id = req.params.id;
    try{
        const deleteCategory = await CategorySchema.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            data:deleteCategory,
            message: "Category deleted succcessfully."
        })
        if(!deleteCategory){
             res.status(404).json({
                success: false,
                data: '',
                message: "Category not found."
            })
        }
    }catch(error){
        console.log(error)
        next(error)
    }
}