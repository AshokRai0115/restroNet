// routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/restaurantRecommendationController'); 


router.get(
    '/recommend/:id', 
   
    recommendationController.getRecommendedRestaurants
);

module.exports = router;