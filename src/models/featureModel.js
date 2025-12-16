const mongoose = require('mongoose');

const restaurantFeaturesSchema = new mongoose.Schema({
    // --- IDENTIFIER ---
    
    /**
     * restaurant: Unique reference to the main Restaurant document.
     * CRITICAL: Ensures a 1-to-1 relationship with the Restaurant.
     */
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true,
        unique: true 
    },

    // --- OHE CUISINE VECTOR (Fixed Dimensions) ---
    
    /**
     * cbf_cuisine_vector: One-Hot Encoded vector representing the cuisine.
     * Example: [1, 0, 0, 0, ...]
     */
    cbf_cuisine_vector: {
        type: [Number], // Array of 0s and 1s
        required: true
    },
    
    // --- TF-IDF TAGS VECTOR (Dynamic/Evolving Dimensions) ---
    
    /**
     * cbf_tags_vector: Vector storing the weighted (TF-IDF) scores for all relevant tags.
     * Example: [0.0, 0.82, 0.15, ...]
     */
    cbf_tags_vector: {
        type: [Number],
        required: true
    },

    // --- SCALED NUMERICAL (Optional, but good for scoring) ---
    
    /**
     * cbf_rating_score: Stores the restaurant's average rating, scaled to [0, 1].
     * We'll use this as a single numerical feature for now.
     */
    cbf_rating_score: {
        type: Number,
        min: 0,
        max: 1,
        required: true
    },
    
    // --- METADATA ---
    
    /**
     * last_calculated: Timestamp of when this vector was last generated/updated.
     */
    last_calculated: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true 
});

// Index for fast lookups
restaurantFeaturesSchema.index({ restaurant: 1 });

const RestaurantFeatures = mongoose.model('RestaurantFeatures', restaurantFeaturesSchema);

module.exports = RestaurantFeatures;