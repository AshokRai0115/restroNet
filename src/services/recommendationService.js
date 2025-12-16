// services/recommendation-service.js

// Import core models and math utilities (assuming CommonJS syntax)
const RestaurantFeatures = require('../models/featureModel');
// FIX: Use ConsumerProfile consistently and remove UserProfile import
const ConsumerProfile = require('../models/consumerProfileModel'); 
const { cosineSimilarity } = require('../utils/vector-math');
const Restaurant = require('../models/venueModel'); 

const ALPHA = 0.5;

const DEFAULT_RECOMMENDATION_LIMIT = 20;

/**
 * Calculates similarity between a Consumer Profile and all available restaurants
 * and returns the sorted list of recommendations.
 * @param {string} consumerId - The ID of the consumer requesting recommendations.
 * @param {number} limit - The maximum number of restaurants to return.
 * @returns {Array<{venue: object, score: number}>} - A sorted list of recommended restaurants.
 */
async function getCBFRecommendations(consumerId, limit = DEFAULT_RECOMMENDATION_LIMIT) {
    // 1. Fetch the Consumer Profile Vector (C)
    // FIX: Use ConsumerProfile model consistently
    const consumer = await ConsumerProfile.findOne({ consumer: consumerId }); 
    
    if (!consumer || !consumer.cbf_vector) {
        console.warn(`CBF: Consumer profile not found for ID ${consumerId}. Returning empty list.`);
        return [];
    }
    const userVector = consumer.cbf_vector; // This is the Consumer Profile Vector (C)

    // ... (rest of the logic is correct)
    
    // 2. Fetch all Item Feature Vectors (R)
    const allFeatures = await RestaurantFeatures.find()
        .select('restaurant cbf_cuisine_vector cbf_tags_vector cbf_rating_score');

    if (allFeatures.length === 0) {
        return [];
    }

    // 3. Score all Candidates
    const scoredRestaurants = [];
    const featureDimension = userVector.length;

    for (const itemFeature of allFeatures) {
        const restaurantVector = [
            ...itemFeature.cbf_cuisine_vector,
            ...itemFeature.cbf_tags_vector,
            itemFeature.cbf_rating_score 
        ];

        if (restaurantVector.length !== featureDimension) {
            continue; 
        }

        const similarityScore = cosineSimilarity(userVector, restaurantVector);
        
        if (similarityScore > 0) {
            scoredRestaurants.push({
                restaurantId: itemFeature.restaurant,
                score: similarityScore
            });
        }
    }

    // 4. Sort and Limit
    scoredRestaurants.sort((a, b) => b.score - a.score);
    const topScores = scoredRestaurants.slice(0, limit);

    // 5. Final Data Retrieval
    const topIds = topScores.map(item => item.restaurantId);
    const recommendedVenues = await Restaurant.find({ _id: { $in: topIds } });

    const finalRecommendations = recommendedVenues.map(venue => {
        const scoreData = topScores.find(s => s.restaurantId.equals(venue._id));
        return {
            ...venue.toObject(),
            recommendation_score: scoreData ? scoreData.score : 0
        };
    });

    return finalRecommendations;
}

// updateConsumerProfile function remains the same and is correct:
async function updateConsumerProfile(consumerId, venueId, interactionWeight) {
    if (!consumerId || !venueId || typeof interactionWeight !== 'number' || interactionWeight <= 0) {
        return;
    }

    try {
        const venueFeatures = await RestaurantFeatures.findOne({ restaurant: venueId })
            .select('cbf_cuisine_vector cbf_tags_vector cbf_rating_score');
        
        if (!venueFeatures) {
            console.warn(`Profile update failed: Features not found for venue ${venueId}.`);
            return;
        }

        const R_interacted = [
            ...venueFeatures.cbf_cuisine_vector,
            ...venueFeatures.cbf_tags_vector,
            venueFeatures.cbf_rating_score 
        ];
        const vectorLength = R_interacted.length;

        let profileDoc = await ConsumerProfile.findOne({ consumer: consumerId });
        let C_old;

        if (!profileDoc) {
            C_old = new Array(vectorLength).fill(0);
            profileDoc = new ConsumerProfile({ consumer: consumerId, cbf_vector: C_old });
        } else {
            C_old = profileDoc.cbf_vector;
        }

        if (C_old.length !== vectorLength) {
             console.warn(`WARNING: Consumer profile vector length (${C_old.length}) mismatch with item vector (${vectorLength}). Recalculating profile with new length.`);
             C_old = new Array(vectorLength).fill(0);
        }

        const C_new = [];
        const beta = 1.0 - ALPHA; 

        for (let i = 0; i < vectorLength; i++) {
            let newFeatureValue = 
                (ALPHA * interactionWeight * R_interacted[i]) + 
                (beta * C_old[i]);
            
            C_new.push(newFeatureValue);
        }

        profileDoc.cbf_vector = C_new;
        profileDoc.last_recalculated = new Date();
        await profileDoc.save();

    } catch (error) {
        console.error(`CRITICAL ERROR updating Consumer Profile ${consumerId}:`, error);
    }
}

module.exports = {
    getCBFRecommendations,
    updateConsumerProfile
};