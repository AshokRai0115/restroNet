const ReviewSchema = require("../models/reviewModel");

module.exports.all_review = async (req, res, next) => {
    try{
        const allReviews = await ReviewSchema.find();
        return res.status(200).json({
            count: allReviews.length, data: allReviews
        }) 
    }catch(error){
        next(error);
    }
}

module.exports.get_venue_reviews = async (req, res, next) => {
  try {
    const { venueId } = req.params;

    const reviews = await ReviewSchema.find({ venue_id: venueId })
      .populate("user_id", "username email")            
      .populate("venue_id", "restaurant_name")        
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this venue"
      });
    }

    // ✅ Calculate average rating
    const avgRating =
      reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;

    res.status(200).json({
      success: true,
      total_reviews: reviews.length,
      average_rating: Number(avgRating.toFixed(1)),
      data: reviews
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.create_review = async (req, res, next) => {
    const newData = req.body;
    console.log(newData, "soalr..................")
    try{
        const review = await ReviewSchema.create(newData);
        res.status(201).json({
            msg: "Review created successfully.",
            data: review,
            success: true
        })
    }catch(error){
        next(error)
    }   
}


module.exports.update_review = async (req, res, next) => {
    const { id } = req.params;

    try {
        const updateData = { ...req.body };

        const updatedTag = await ReviewSchema.findByIdAndUpdate(
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



module.exports.get_single_review = async (req, res, next) =>{
    const id = req.params.id;
   try{
     const singleTag = await ReviewSchema.findById(id);
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

module.exports.delete_review = async (req, res, next) =>{
    const id = req.params.id;
    try{
        const deleteTag = await ReviewSchema.findByIdAndDelete(id);
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