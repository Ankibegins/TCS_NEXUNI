const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, createReview);

module.exports = router;
