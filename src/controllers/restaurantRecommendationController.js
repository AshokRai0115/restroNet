// controllers/recommendationController.js
const { getCBFRecommendations } = require('../services/recommendationService');

module.exports.getRecommendedRestaurants = async (req, res, next) => {
    // CRITICAL: You must pass the authenticated user's ID here. 
    // Assuming req.user is populated by middleware.
    const userId = req.user ? req.user._id : 'DEFAULT_USER_ID_FOR_TESTING'; 
    const limit = parseInt(req.query.limit) || 20;

    if (!userId || userId === 'DEFAULT_USER_ID_FOR_TESTING') {
        return res.status(401).json({ msg: "Authentication required for recommendations." });
    }

    try {
        const recommendations = await getCBFRecommendations(userId, limit);

        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });
    } catch (error) {
        console.error("Error generating CBF recommendations:", error);
        next(error);
    }
};