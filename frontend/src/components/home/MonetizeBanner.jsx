import React from 'react';
import { Sparkles } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';

export default function MonetizeBanner() {
    return (
        <div className="mt-20 bg-gradient-to-br from-brand-card to-brand-bg rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl border border-primary/20 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 mix-blend-screen"></div>

            <div className="relative z-10 w-full md:w-1/2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-black leading-[1.1] text-white">Ready to monetize your skills?</h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-md font-medium">Join thousands of creators, designers, and tech experts who have turned their passion into a career on NEXUNI.</p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <PremiumButton to="/login" variant="primary">Start Selling Now</PremiumButton>
                    <PremiumButton variant="secondary">Learn More</PremiumButton>
                </div>
            </div>

            {/* Fake UI Overlay Graphic */}
            <div className="relative z-10 w-full md:w-auto flex justify-center lg:justify-end">
                <div className="bg-brand-sidebar/50 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-2xl w-full max-w-[320px]">
                    <div className="bg-brand-bg rounded-xl p-6 shadow-lg border border-primary/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">EARNINGS FORECAST</p>
                                <p className="text-2xl font-black text-white">$2,450.00</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full bg-brand-sidebar rounded-full h-2.5 overflow-hidden">
                                <div className="bg-primary h-full rounded-full w-[75%] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-slate-400">Weekly Progress</span>
                                <span className="text-primary">75%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
