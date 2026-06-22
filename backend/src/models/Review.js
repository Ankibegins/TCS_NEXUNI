const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true
    },
    completedAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Enforce unique review per service per client
reviewSchema.index({ serviceId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
