// controllers/recommendationController.js
const { getCBFRecommendations } = require('../services/recommendationService');
const Venue = require("../models/venueModel")

module.exports.getRecommendedRestaurants = async (req, res, next) => {
    // const consumerId = req.user._id;
    const  consumerId = req.params.id

    try {
        let results = await getCBFRecommendations(consumerId);

        if (!results || results.length === 0) {
            console.log("Fetching top-rated venues.");
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