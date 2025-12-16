// routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/restaurantRecommendationController'); 

// Placeholder for your authentication middleware
// CRITICAL: This middleware MUST populate req.consumer._id or req.user._id
const { protect } = require('../middleware/authMiddleware'); // Adjust path as needed

// GET /api/v1/recommendations
// Returns a list of restaurants recommended specifically for the authenticated consumer.
router.get(
    '/', 
    protect, // Use your authentication middleware
    recommendationController.getRecommendedRestaurants
);

module.exports = router;