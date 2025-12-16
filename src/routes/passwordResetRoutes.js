// routes/passwordRoutes.js
const express = require('express');
const router = express.Router();

const controller = require('../controllers/passwordResetcontroller');
router.post("/request-reset", controller.requestReset);
router.post("/reset-password", controller.resetPassword);


module.exports = router;
