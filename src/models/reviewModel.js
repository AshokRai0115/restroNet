const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review is required."],
    },

    rating: {
        type: Number,
        // required: [true, "Rating is required."]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },

    // WHICH venue was rated
    venue_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        // required: true
    }


}, {
    timestamps: true
})

const ReviwSchema = mongoose.model("Rating", reviewSchema);
module.exports = ReviwSchema;