const Review = require('../models/Review');
const Order = require('../models/Order');
const Service = require('../models/Service');
const { updateProviderStats } = require('../utils/reputation');

// @desc    Create a new rating/review for a completed service
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
    try {
        const { orderId, rating, review } = req.body;

        // 1. Validation
        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
        }

        // 2. Fetch Order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // 3. Authorization Check (Must be the customer)
        if (order.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to review this order' });
        }

        // 4. State Check (Must be Completed)
        if (order.status !== 'Completed') {
            return res.status(400).json({ success: false, message: 'You cannot review a service before it is completed' });
        }

        // 5. Unique Check (One review per order)
        const existingOrderReview = await Review.findOne({ orderId });
        if (existingOrderReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this order' });
        }

        // 6. Unique Check (One review per service per customer)
        const existingServiceReview = await Review.findOne({
            serviceId: order.serviceId,
            clientId: req.user._id
        });
        if (existingServiceReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this service' });
        }

        // 7. Create Review
        const reviewDoc = await Review.create({
            serviceId: order.serviceId,
            orderId: order._id,
            providerId: order.sellerId,
            clientId: req.user._id,
            rating: ratingNum,
            review: review || '',
            completedAt: order.completedAt || new Date()
        });

        // 8. Reference Review on Order
        order.review = reviewDoc._id;
        await order.save();

        // 9. Recalculate Provider Stats & Reputation Level
        await updateProviderStats(order.sellerId);

        // 10. Recalculate Service Stats
        const serviceReviews = await Review.find({ serviceId: order.serviceId });
        const reviewsCount = serviceReviews.length;
        const ratingSum = serviceReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageServiceRating = reviewsCount > 0 ? Number((ratingSum / reviewsCount).toFixed(2)) : 0;

        await Service.findByIdAndUpdate(order.serviceId, {
            $set: {
                rating: averageServiceRating,
                reviews: reviewsCount
            }
        });

        res.status(201).json({
            success: true,
            data: reviewDoc
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview
};
