const express = require('express');
const router = express.Router();
const { createService, getServices, getMyServices, deleteService, updateService } = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');

// User specific routes
router.route('/me')
    .get(protect, getMyServices); // Protected: User must be logged in to fetch their own services

// Route combinations
router.route('/')
    .post(protect, createService) // Protected: User must be logged in to create
    .get(getServices);            // Public: Anyone can fetch services

router.route('/:id')
    .put(protect, updateService)
    .delete(protect, deleteService);

module.exports = router;
