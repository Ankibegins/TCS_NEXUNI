import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function LandingHeader() {
    return (
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold tracking-wide">NEXUNI</span>
            </div>
            <div className="flex items-center gap-6 text-slate-300">
                <button className="hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <button className="relative hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-bg"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-slate-400 overflow-hidden border border-white/20">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80" alt="User" />
                </div>
            </div>
        </header>
    );
}
