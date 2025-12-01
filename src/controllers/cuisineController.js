const CuisineSchema = require('../models/cuisineSchema');

module.exports.all_cuisine = async (req, res, next) => {
    try{
        const allCuisines = await CuisineSchema.find();
        return res.status(200).json({
            count: allCuisines.length, data: allCuisines
        }) 
    }catch(error){
        next(error);
    }
}

module.exports.create_cuisine = async (req, res, next) => {
    const newData = { ...req.body };
    try{
        const cuisine = await CuisineSchema.create({name:newData.name});
        res.status(201).json({
            msg: "Cuisine created successfully.",
            data: cuisine,
            success: true
        })
    }catch(error){
        next(error)
    }   
}


module.exports.update_cuisine = async (req, res, next) => {
    const { id } = req.params;

    try {
        const updateData = { ...req.body };

        const updatedCuisine = await CuisineSchema.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedCuisine) {
            return res.status(404).json({
                success: false,
                message: "Cuisine not found."
            });
        }

        res.status(200).json({
            success: true,
            data: updatedCuisine,
            message: "Cuisine updated successfully."
        });
    } catch (error) {
        next(error);
    }
};



module.exports.get_single_cuisine = async (req, res, next) =>{
    const id = req.params.id;
   try{
     const singleCuisine = await CuisineSchema.findById(id);
    res.status(200).json({
        success: true,
        data: singleCuisine,
        message: "Cuisine fetched successfully."
    })
    if(!singleCuisine){
         res.status(404).json({
                success: false,
                data: '',
                message: "Cuisine not found."
            })
    }
   }catch(error){
    next(error)
   }
}

module.exports.delete_cuisine = async (req, res, next) =>{
    const id = req.params.id;
    try{
        const deleteCuisine = await CuisineSchema.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            data:deleteCuisine,
            message: "Cuisine deleted succcessfully."
        })
        if(!deleteCuisine){
             res.status(404).json({
                success: false,
                data: '',
                message: "Cuisine not found."
            })
        }
    }catch(error){
        console.log(error)
        next(error)
    }
}