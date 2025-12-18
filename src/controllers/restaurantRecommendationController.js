// controllers/recommendationController.js
const { getCBFRecommendations } = require('../services/recommendationService');
const Venue = require("../models/venueModel")

// module.exports.getRecommendedRestaurants = async (req, res, next) => {

//     // CRITICAL: You must pass the authenticated user's ID here. 
//     // Assuming req.user is populated by middleware.
//     const userId = req.user ? req.user._id : 'DEFAULT_USER_ID_FOR_TESTING'; 
//     const limit = parseInt(req.query.limit) || 20;

//     if (!userId || userId === 'DEFAULT_USER_ID_FOR_TESTING') {
//         return res.status(401).json({ msg: "Authentication required for recommendations." });
//     }

//     try {
//         const recommendations = await getCBFRecommendations(userId, limit);

//         res.status(200).json({
//             success: true,
//             count: recommendations.length,
//             data: recommendations
//         });
//     } catch (error) {
//         console.error("Error generating CBF recommendations:", error);
//         next(error);
//     }
// };

module.exports.getRecommendedRestaurants = async (req, res, next) => {
    // const consumerId = req.user._id;
    const  consumerId = req.params.id

    try {
        let results = await getCBFRecommendations(consumerId);

        if (!results || results.length === 0) {
            console.log("Cold Start: Fetching top-rated venues as fallback.");
            results = await Venue.find()
                .sort({ averageRating: -1, ratingsCount: -1 })
                .limit(10);
        }

        res.status(200).json({
            success: true,
            count: results.length,
            // Tagging the data so the frontend knows if it's personalized
            type: results[0]?.recommendation_score ? 'personalized' : 'popular',
            data: results
        });

    } catch (error) {
        next(error);
    }
};