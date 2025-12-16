// services/recommendation-service.js

// Import core models and math utilities (assuming CommonJS syntax)
const RestaurantFeatures = require('../models/featureModel');
const UserProfile = require('../models/userProfileModel'); // ASSUME a model for user features
const { cosineSimilarity } = require('../utils/vector-math');
const Restaurant = require('../models/venueModel'); // Venue model for final lookup

const DEFAULT_RECOMMENDATION_LIMIT = 20;

/**
 * Calculates similarity between a User Profile and all available restaurants
 * and returns the sorted list of recommendations.
 * @param {string} userId - The ID of the user requesting recommendations.
 * @param {number} limit - The maximum number of restaurants to return.
 * @returns {Array<{venue: object, score: number}>} - A sorted list of recommended restaurants.
 */
async function getCBFRecommendations(userId, limit = DEFAULT_RECOMMENDATION_LIMIT) {
    // 1. Fetch the User Profile Vector (U)
    // NOTE: We assume you have a UserProfile model that stores the user's combined feature vector.
    const user = await UserProfile.findOne({ user: userId }); 
    
    if (!user || !user.cbf_vector) {
        console.warn(`CBF: User profile not found for user ${userId}. Returning empty list.`);
        return [];
    }
    const userVector = user.cbf_vector; // This is the User Profile Vector (U)

    // 2. Fetch all Item Feature Vectors (R)
    // Fetch all restaurant features and the associated Venue ID
    const allFeatures = await RestaurantFeatures.find()
        .select('restaurant cbf_cuisine_vector cbf_tags_vector cbf_rating_score');

    if (allFeatures.length === 0) {
        return [];
    }

    // 3. Score all Candidates
    const scoredRestaurants = [];
    const featureDimension = userVector.length; // Ensure vectors match dimension if needed

    for (const itemFeature of allFeatures) {
        // Concatenate the feature parts into one large vector (R)
        // Ensure the order matches the creation logic in cbf-pipeline.js!
        const restaurantVector = [
            ...itemFeature.cbf_cuisine_vector,
            ...itemFeature.cbf_tags_vector,
            itemFeature.cbf_rating_score 
        ];

        // Ensure user and restaurant vectors are the same length before comparison
        if (restaurantVector.length !== featureDimension) {
            // In a production system, you'd handle this mismatch error gracefully.
            continue; 
        }

        const similarityScore = cosineSimilarity(userVector, restaurantVector);
        
        // Only include items with a positive score
        if (similarityScore > 0) {
            scoredRestaurants.push({
                restaurantId: itemFeature.restaurant,
                score: similarityScore
            });
        }
    }

    // 4. Sort and Limit
    scoredRestaurants.sort((a, b) => b.score - a.score); // Sort descending by score
    const topScores = scoredRestaurants.slice(0, limit);

    // 5. Final Data Retrieval (Fetch full restaurant details for the top IDs)
    const topIds = topScores.map(item => item.restaurantId);
    const recommendedVenues = await Restaurant.find({ _id: { $in: topIds } });

    // OPTIONAL: Merge scores back into venue data for frontend
    const finalRecommendations = recommendedVenues.map(venue => {
        const scoreData = topScores.find(s => s.restaurantId.equals(venue._id));
        return {
            ...venue.toObject(),
            recommendation_score: scoreData ? scoreData.score : 0
        };
    });

    return finalRecommendations;
}

module.exports = {
    getCBFRecommendations
};