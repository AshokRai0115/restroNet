const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        // required: [true, "Review is required."],
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
reviewSchema.statics.calculateAverageRating = async function(venueId) {
    const stats = await this.aggregate([
        // FIX: Match using 'venue_id' (matching your schema field)
        { $match: { venue_id: venueId } }, 
        {
            $group: {
                _id: '$venue_id',
                nRating: { $sum: 1 },
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Venue').findByIdAndUpdate(venueId, {
            averageRating: stats[0].averageRating.toFixed(1), // Optional: rounds to 1 decimal
            ratingsCount: stats[0].nRating
        });
    } else {
        // Reset if all reviews are deleted
        await mongoose.model('Venue').findByIdAndUpdate(venueId, {
            averageRating: 0,
            ratingsCount: 0
        });
    }
};

// FIX: Use this.venue_id to match your schema
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.venue_id);
});

// For transparency, it's good to handle updates/deletes too
reviewSchema.post(/^findOneAnd/, async function(doc) {
    if (doc) await doc.constructor.calculateAverageRating(doc.venue_id);
});

const Rating = mongoose.model("Rating", reviewSchema);
module.exports = Rating;