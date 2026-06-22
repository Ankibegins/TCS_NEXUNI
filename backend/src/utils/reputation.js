const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

/**
 * Recalculates all provider stats and updates the User document.
 * @param {string} providerId - User ID of the provider.
 * @returns {Promise<object>} Updated stats details.
 */
const updateProviderStats = async (providerId) => {
    try {
        // 1. Count completed projects
        const completedProjectsCount = await Order.countDocuments({
            sellerId: providerId,
            status: 'Completed'
        });

        // 2. Fetch all reviews for this provider
        const reviews = await Review.find({ providerId });
        const totalRatings = reviews.length;

        let averageRating = 0;
        if (totalRatings > 0) {
            const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
            averageRating = Number((ratingSum / totalRatings).toFixed(2));
        }

        // 3. Determine Reputation Level
        let reputationLevel = 'Beginner';
        if (completedProjectsCount >= 75 && averageRating >= 4.7) {
            reputationLevel = 'Elite Expert';
        } else if (completedProjectsCount >= 30 && averageRating >= 4.5) {
            reputationLevel = 'Expert';
        } else if (completedProjectsCount >= 15 && averageRating >= 4.0) {
            reputationLevel = 'Professional';
        } else if (completedProjectsCount >= 5 && averageRating >= 3.5) {
            reputationLevel = 'Rising Freelancer';
        }

        // 4. Cache in User document
        const updateData = {
            'stats.completedProjects': completedProjectsCount,
            'stats.averageRating': averageRating,
            'stats.totalRatings': totalRatings,
            'stats.reputationLevel': reputationLevel,
            // Keep old fields compatible just in case
            'stats.reviewsCount': totalRatings,
            'stats.rating': averageRating
        };

        await User.findByIdAndUpdate(providerId, {
            $set: updateData
        });

        return {
            completedProjects: completedProjectsCount,
            averageRating,
            totalRatings,
            reputationLevel
        };
    } catch (err) {
        console.error('Error updating provider stats:', err);
        throw err;
    }
};

module.exports = {
    updateProviderStats
};
