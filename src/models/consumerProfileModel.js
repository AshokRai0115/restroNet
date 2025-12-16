// models/consumerProfileModel.js
const mongoose = require('mongoose');

const consumerProfileSchema = new mongoose.Schema({
    // --- IDENTIFIER ---
    
    /**
     * consumer: Unique reference to the main Consumer document.
     * This ensures a 1-to-1 relationship between a consumer and their feature profile.
     */
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumers', // Reference to your main Consumer model
        required: true,
        unique: true 
    },

    // --- AGGREGATED FEATURE VECTOR (C) ---
    
    /**
     * cbf_vector: The combined, weighted feature vector for the consumer.
     * This vector must have the same total length/dimensions as the combined 
     * restaurant feature vector (Cuisine + Tags + Rating Score).
     * This is the vector C used in Cosine Similarity.
     */
    cbf_vector: {
        type: [Number], // Array of floats (the weighted averages)
        required: true,
        default: [] // Default to empty array for new consumers (Cold Start)
    },
    
    // --- METADATA ---
    
    /**
     * last_recalculated: Timestamp of when this consumer's profile was last updated.
     */
    last_recalculated: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true 
});

// Index for fast lookups by consumer ID
consumerProfileSchema.index({ consumer: 1 });

const ConsumerProfile = mongoose.model('ConsumerProfile', consumerProfileSchema);

module.exports = ConsumerProfile;