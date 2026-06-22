import React from 'react';
import { Link } from 'react-router-dom';
import {
    Shield,
    Sparkles,
    UserPlus,
    Search,
    CreditCard,
    ShoppingCart,
    Globe,
    Phone,
    Share2,
    Download
} from 'lucide-react';

import HomeNavbar from '../components/home/HomeNavbar';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import MonetizeBanner from '../components/home/MonetizeBanner';
import Testimonials from '../components/home/Testimonials';
import Footer from '../components/home/Footer';

export default function Home() {
    return (
        <div className="font-display">
            {/* Header & Hero Wrapper */}
            <div className="bg-brand-bg text-white pb-20">
                <HomeNavbar />
                <HeroSection />
            </div>

            {/* Monetize Banner (Brand Background) */}
            <div className="bg-brand-bg text-white py-24 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-8">
                    <MonetizeBanner />
                </div>
            </div>

            {/* How It Works (White Background) */}
            <HowItWorks />

            {/* Testimonials (White Background) */}
            <Testimonials />

            {/* Footer */}
            <Footer />
        </div>
    );
}
