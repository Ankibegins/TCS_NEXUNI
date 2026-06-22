import React from 'react';
import { Search } from 'lucide-react';

export default function WelcomeSearch() {
    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back, Alex!</h1>
                <p className="text-sm text-slate-300">Manage your projects, purchases, and connections.</p>
            </div>
            <div className="relative max-w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    placeholder="Search freelancers, products, or services..."
                    className="w-full pl-12 pr-4 py-4 bg-white text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-lg font-medium text-sm"
                />
            </div>
        </section>
    );
}
