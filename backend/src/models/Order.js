const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Taken', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Taken'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryDays: {
        type: Number,
        default: 7       // populated from service.pricing.deliveryTime at order creation
    },
    deadline: {
        type: Date,
        required: true
    },
    extrasIncluded: [{
        name: String,
        price: Number
    }],
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Refunded'],
        default: 'Unpaid'
    },
    completedAt: {
        type: Date
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
