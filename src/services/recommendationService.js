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
    const consumer = await ConsumerProfile.findOne({ consumer: consumerId }); 
    
    if (!consumer || !consumer.cbf_vector) {
        console.warn(`CBF: Consumer profile not found for ID ${consumerId}. Returning empty list.`);
        return [];
    }
    const userVector = consumer.cbf_vector; // This is the Consumer Profile Vector (C)

    
    const allFeatures = await RestaurantFeatures.find()
        .select('restaurant cbf_cuisine_vector cbf_tags_vector cbf_rating_score');

    if (allFeatures.length === 0) {
        return [];
    }

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


/**
 * Unified Discovery: Search by text and/or filter by cuisine, 
 * then rank results by Consumer Profile.
 */
async function discoverVenues(consumerId, params = {}) {
    const { q, cuisine, limit = 20 } = params;

    // 1. Build the MongoDB Query
    const query = {};

    // Filter by Cuisine (Exact Match)
    if (cuisine) {
        query.cuisine = { $regex: `^${cuisine}$`, $options: 'i' };
    }

    // Search by Text (Regex match on name or tags)
   if (q) {
        // Split input: "spicy pizza" -> ["spicy", "pizza"]
        const words = q.trim().split(/\s+/);
        
        // Create an array of regex conditions: [{name: /spicy/i}, {name: /pizza/i}]
        // This ensures the search finds documents containing ANY of the words
        query.$or = [
            { name: { $regex: words.join('|'), $options: 'i' } },
            { tags: { $regex: words.join('|'), $options: 'i' } }
        ];

    }

    const matchedVenues = await Restaurant.find(query).limit(50);
    if (matchedVenues.length === 0) return [];

    // 3. Get Consumer Profile for Ranking
    const profile = await ConsumerProfile.findOne({ consumer: consumerId });
    
    if (!profile || !profile.cbf_vector || profile.cbf_vector.length === 0) {
        return matchedVenues.sort((a, b) => b.averageRating - a.averageRating).slice(0, limit);
    }

    const userVector = profile.cbf_vector;

    const venueIds = matchedVenues.map(v => v._id);
    const featureDocs = await RestaurantFeatures.find({ restaurant: { $in: venueIds } });

    const rankedResults = matchedVenues.map(venue => {
        const features = featureDocs.find(f => f.restaurant.equals(venue._id));
        let score = 0;

        if (features) {
            const restaurantVector = [
                ...features.cbf_cuisine_vector,
                ...features.cbf_tags_vector,
                features.cbf_rating_score
            ];
            
            if (restaurantVector.length === userVector.length) {
                score = cosineSimilarity(userVector, restaurantVector);
            }
        }

        return { 
            ...venue.toObject(), 
            recommendation_score: score 
        };
    });

    // 5. Final Sort: Highest Profile Match first
    return rankedResults.sort((a, b) => b.recommendation_score - a.recommendation_score).slice(0, limit);
}

async function initializeConsumerProfile(consumerId) {
    try {
        const existing = await ConsumerProfile.findOne({ consumer: consumerId });
        if (existing) return;

        const newProfile = new ConsumerProfile({
            consumer: consumerId,
            cbf_vector: [] // Starts empty; will be sized during first interaction
        });

        await newProfile.save();
    } catch (error) {
        console.error("CBF Error: Failed to initialize consumer profile:", error);
    }
}

async function updateConsumerProfile(consumerId, venueId, interactionWeight) {
    if (!consumerId || !venueId || typeof interactionWeight !== 'number' || interactionWeight < 0) {
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
    updateConsumerProfile,
    initializeConsumerProfile,
    discoverVenues
};