// backend/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const { getAdvancedProperties } = require('../controllers/propertyController');

// @route   GET /api/v1/properties/search
// @access  Public
router.route('/search').get(getAdvancedProperties);

module.exports = router;