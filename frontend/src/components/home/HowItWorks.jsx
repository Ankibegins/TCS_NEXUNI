import React from 'react';
import { UserPlus, Search, CreditCard } from 'lucide-react';

export default function HowItWorks() {
    return (
        <div className="bg-brand-bg text-white py-24">
            <div className="max-w-7xl mx-auto px-8 text-center space-y-16">
                <div className="space-y-4">
                    <h3 className="text-primary text-xs font-bold tracking-[0.2em] uppercase">SIMPLE PROCESS</h3>
                    <h2 className="text-4xl font-black text-white">How NEXUNI Works</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-brand-card text-white rounded-2xl p-10 flex flex-col items-center text-center shadow-lg border border-primary/20 transition-transform hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/40 mb-6 group-hover:scale-110 transition-transform">
                            <UserPlus className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Create Profile</h3>
                        <p className="text-slate-200 text-sm leading-relaxed">Join our community in minutes. Specify if you're looking to hire talent or sell items.</p>
                    </div>
                    <div className="bg-brand-card text-white rounded-2xl p-10 flex flex-col items-center text-center shadow-lg border border-primary/20 transition-transform hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/40 mb-6 group-hover:scale-110 transition-transform">
                            <Search className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">List or Browse</h3>
                        <p className="text-slate-200 text-sm leading-relaxed">Search for specialized services or list your high-quality second-hand items for sale.</p>
                    </div>
                    <div className="bg-brand-card text-white rounded-2xl p-10 flex flex-col items-center text-center shadow-lg border border-primary/20 transition-transform hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/40 mb-6 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
                        <p className="text-slate-200 text-sm leading-relaxed">Transact with confidence. Our escrow system ensures safety for both buyers and sellers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
