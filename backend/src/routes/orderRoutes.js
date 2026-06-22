const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus,
    completeOrder
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, createOrder);

router.route('/my-orders')
    .get(protect, getMyOrders);

router.route('/seller-orders')
    .get(protect, getSellerOrders);

router.route('/:id/status')
    .put(protect, updateOrderStatus);

router.route('/:id/complete')
    .put(protect, completeOrder);

module.exports = router;
