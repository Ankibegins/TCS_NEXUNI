import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function TrendingProducts() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-wide">Trending Products</h2>
                <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Explore shop</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white rounded-2xl p-4 flex items-center gap-5 shadow-lg border border-slate-100 group cursor-pointer">
                    <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300" alt="Headphones" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-slate-900 font-bold text-sm mb-1 truncate">Wireless Headphones X10</h3>
                        <p className="text-slate-500 text-[10px] font-medium mb-3">Gently used • 2 months old</p>
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-black text-lg">$120</span>
                            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-colors">
                                <ShoppingCart className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 flex items-center gap-5 shadow-lg border border-slate-100 group cursor-pointer">
                    <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=300" alt="Keyboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-slate-900 font-bold text-sm mb-1 truncate">Mechanical RGB Keyboard</h3>
                        <p className="text-slate-500 text-[10px] font-medium mb-3">Like new • Original box</p>
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-black text-lg">$85</span>
                            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-colors">
                                <ShoppingCart className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
