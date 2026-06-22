const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Do not return password by default
    },
    role: {
        type: String,
        enum: ['client', 'freelancer', 'admin'],
        default: 'client'
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    // Optional metrics for freelancers
    stats: {
        totalSales: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        completedProjects: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },
        reputationLevel: { type: String, default: 'Beginner' }
    }
}, {
    timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
