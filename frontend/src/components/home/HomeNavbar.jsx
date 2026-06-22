import React from 'react';
import { Link } from 'react-router-dom';
import PremiumButton from '../ui/PremiumButton';

export default function HomeNavbar() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return (
        <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
            <div className="text-2xl font-black tracking-wide text-white select-none">NEXUNI</div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                <a href="#" className="hover:text-white transition-colors">How it works</a>
                <a href="#" className="hover:text-white transition-colors">Freelancers</a>
                <a href="#" className="hover:text-white transition-colors">Marketplace</a>
            </nav>
            <div className="flex items-center gap-6">
                {user ? (
                    <PremiumButton to="/dashboard" variant="primary" className="px-5 py-2">
                        Go to Dashboard
                    </PremiumButton>
                ) : (
                    <PremiumButton to="/login" variant="primary" className="px-5 py-2">
                        Login / Sign Up
                    </PremiumButton>
                )}
            </div>
        </header>
    );
}
