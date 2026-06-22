const Order = require('../models/Order');
const Service = require('../models/Service');

/**
 * Parse a deliveryTime string (from Service schema) into an integer number of days.
 * Handles: "1 Day", "3 Days", "1 Week", "2 Weeks", bare numbers, etc.
 */
function parseDeliveryDays(deliveryTimeStr) {
    if (!deliveryTimeStr) return 7;
    const str = String(deliveryTimeStr).toLowerCase().trim();
    const num = parseInt(str, 10);
    if (isNaN(num)) return 7;          // unparseable → safe default
    if (str.includes('week')) return num * 7;
    return num;                         // "3 Days", "3", etc.
}

// @desc    Create a new order (Consumer hires a service)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { serviceId, totalAmount } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // Prevent user from hiring their own service
        if (service.sellerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot hire your own service' });
        }

        // Derive deadline from the service's own delivery time — NEVER hardcode 7 days
        const deliveryDays = parseDeliveryDays(service.pricing?.deliveryTime);
        const deadline = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);

        const order = await Order.create({
            serviceId,
            customerId: req.user._id,
            sellerId: service.sellerId,
            totalAmount: totalAmount || service.pricing?.basePrice || 0,
            deliveryDays,
            deadline,
            status: 'Taken'
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get orders for the logged-in consumer
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customerId: req.user._id })
            .populate('serviceId', 'title thumbnail pricing')
            .populate('sellerId', 'name email avatar stats')
            .populate('review')
            .sort({ createdAt: -1 });

        const now = new Date();
        const enriched = orders.map(order => {
            const o = order.toObject();
            // deliveryDays: stored on order; fall back to parsing the service string if missing (migration)
            const days = o.deliveryDays || parseDeliveryDays(o.serviceId?.pricing?.deliveryTime) || 7;
            const deadline = o.deadline ? new Date(o.deadline) : new Date(new Date(o.createdAt).getTime() + days * 864e5);
            const msLeft = deadline.setHours(23, 59, 59, 999) - now.getTime();
            const daysRemaining = Math.ceil(msLeft / 864e5);
            return { ...o, deliveryDays: days, deadline: o.deadline || deadline, daysRemaining, isOverdue: daysRemaining < 0 };
        });

        res.json({ success: true, count: enriched.length, data: enriched });
    } catch (error) {
        next(error);
    }
};

// @desc    Get orders for the logged-in provider
// @route   GET /api/orders/seller-orders
// @access  Private
const getSellerOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ sellerId: req.user._id })
            .populate('serviceId', 'title thumbnail pricing')
            .populate('customerId', 'name email avatar')
            .populate('review')
            .sort({ createdAt: -1 });

        const now = new Date();
        const enriched = orders.map(order => {
            const o = order.toObject();
            const days = o.deliveryDays || parseDeliveryDays(o.serviceId?.pricing?.deliveryTime) || 7;
            const deadline = o.deadline ? new Date(o.deadline) : new Date(new Date(o.createdAt).getTime() + days * 864e5);
            const msLeft = deadline.setHours(23, 59, 59, 999) - now.getTime();
            const daysRemaining = Math.ceil(msLeft / 864e5);
            return { ...o, deliveryDays: days, deadline: o.deadline || deadline, daysRemaining, isOverdue: daysRemaining < 0 };
        });

        res.json({ success: true, count: enriched.length, data: enriched });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Taken', 'In Progress', 'Cancelled']; // Disallow manual 'Completed' here

        if (status === 'Completed') {
            return res.status(400).json({ success: false, message: 'Order completion must be initiated by the customer' });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Only seller can update to In Progress.
        // For simplicity, we'll let seller or customer cancel.
        if (order.sellerId.toString() !== req.user._id.toString() && order.customerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this order' });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Complete an order (Consumer confirms completion)
// @route   PUT /api/orders/:id/complete
// @access  Private
const completeOrder = async (req, res, next) => {
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Only the assigned service taker (customerId) can mark as Completed
        if (order.customerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Only the service taker can mark this order as completed' });
        }

        // Must be currently Taken or In Progress
        if (order.status === 'Completed') {
            return res.status(400).json({ success: false, message: 'Order is already completed' });
        }
        if (order.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Cannot complete a cancelled order' });
        }

        order.status = 'Completed';
        order.completedAt = new Date();
        await order.save();

        // Recalculate Provider Stats & Reputation (completed projects count incremented)
        const { updateProviderStats } = require('../utils/reputation');
        await updateProviderStats(order.sellerId);

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus,
    completeOrder
};
