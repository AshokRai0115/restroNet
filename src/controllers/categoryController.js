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
     const newData = { ...req.body };

        if (req.file) {
              const baseUrl = `${req.protocol}://${req.get("host")}`;
       const iconFilename = req?.file?.filename; 
        const imageURL = `${baseUrl}/uploads/${iconFilename}`
        newData.icon = imageURL;
        }
        console.log(newData?.icon)
    try{
        const category = await CategorySchema.create({label:newData.label, icon: newData.icon});
        res.status(201).json({
            msg: "Category created successfully.",
            data: category,
            success: true
        })
    }catch(error){
        next(error)
    }
}

module.exports.update_category = async (req, res, next) => {
    const { id } = req.params;

    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.icon = req.file.path;
        }

        const updatedCategory = await CategorySchema.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        res.status(200).json({
            success: true,
            data: updatedCategory,
            message: "Category updated successfully."
        });
    } catch (error) {
        next(error);
    }
};



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