import React from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import WelcomeSearch from '../components/landing/WelcomeSearch';
import QuickActions from '../components/landing/QuickActions';
import FeaturedFreelancers from '../components/landing/FeaturedFreelancers';
import TrendingProducts from '../components/landing/TrendingProducts';
import OrderHistory from '../components/landing/OrderHistory';
import RecentMessages from '../components/landing/RecentMessages';

export default function Landing() {
    return (
        <div className="min-h-screen bg-brand-bg text-white font-display">
            {/* Header */}
            <LandingHeader />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-8 py-8 space-y-12">
                {/* Welcome & Search */}
                <WelcomeSearch />

                {/* Quick Actions Grid */}
                <QuickActions />

                {/* Featured Freelancers */}
                <FeaturedFreelancers />

                {/* Trending Products */}
                <TrendingProducts />

                {/* Bottom Section (Orders & Messages) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                    <OrderHistory />
                    <RecentMessages />
                </div>
            </main>
        </div>
    );
}
