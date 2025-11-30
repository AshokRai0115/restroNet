const TagSchema = require("../models/tagModel");

module.exports.all_tag = async (req, res, next) => {
    try{
        const allTags = await TagSchema.find();
        return res.status(200).json({
            count: allTags.length, data: allTags
        }) 
    }catch(error){
        next(error);
    }
}

module.exports.create_tag = async (req, res, next) => {
    const newData = { ...req.body };
    try{
        const tag = await TagSchema.create({name:newData.name});
        res.status(201).json({
            msg: "Tag created successfully.",
            data: tag,
            success: true
        })
    }catch(error){
        next(error)
    }   
}


module.exports.update_tag = async (req, res, next) => {
    const { id } = req.params;

    try {
        const updateData = { ...req.body };

        const updatedTag = await TagSchema.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedTag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found."
            });
        }

        res.status(200).json({
            success: true,
            data: updatedTag,
            message: "Tag updated successfully."
        });
    } catch (error) {
        next(error);
    }
};



module.exports.get_single_tag = async (req, res, next) =>{
    const id = req.params.id;
   try{
     const singleTag = await TagSchema.findById(id);
    res.status(200).json({
        success: true,
        data: singleTag,
        message: "Tag fetched successfully."
    })
    if(!singleTag){
         res.status(404).json({
                success: false,
                data: '',
                message: "Tag not found."
            })
    }
   }catch(error){
    next(error)
   }
}

module.exports.delete_tag = async (req, res, next) =>{
    const id = req.params.id;
    try{
        const deleteTag = await TagSchema.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            data:deleteTag,
            message: "Tag deleted succcessfully."
        })
        if(!deleteTag){
             res.status(404).json({
                success: false,
                data: '',
                message: "Tag not found."
            })
        }
    }catch(error){
        console.log(error)
        next(error)
    }
}