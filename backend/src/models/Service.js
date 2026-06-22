const mongoose = require('mongoose');

const extraRowSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }
});

const serviceSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a service title'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Design & Creative', 'Development', 'Marketing', 'Writing', 'Video & Audio']
    },
    subcategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    pricing: {
        basePrice: { type: Number, required: true },
        deliveryTime: { type: String, required: true },
        revisions: { type: String, default: '1 Revision' },
        currency: { type: String, default: 'USD' }
    },
    extras: [extraRowSchema],
    tags: [{
        type: String
    }],
    thumbnail: {
        type: String,
        default: 'no-photo.jpg'
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    // Metrics derived from orders/reviews
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    reviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
