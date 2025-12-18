const express = require('express');
const router = express.Router();
const discoveryController = require('../controllers/discoveryController');
// const { protect } = require('../middleware/authMiddleware');

// Endpoint: GET /api/v1/discover
router.get('/discover/:id', discoveryController.discover);

module.exports = router;