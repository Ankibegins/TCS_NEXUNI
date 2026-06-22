import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function TechDeals() {
    return (
        <div className="max-w-7xl mx-auto px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black mb-2">Pre-Loved Tech Deals</h2>
                    <p className="text-slate-300 text-sm font-medium">Quality gear at unbeatable prices, tested and verified.</p>
                </div>
                <button className="bg-[#314a7e] hover:bg-[#3b5998] text-white px-6 py-2.5 rounded-md font-bold text-sm transition-colors border border-white/10 shadow-sm">Browse Marketplace</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product 1 */}
                <div className="bg-white rounded-3xl p-4 flex flex-col gap-4 shadow-xl border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer group">
                    <div className="w-full h-48 bg-[#fdf2e9] rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400" alt="Macbook" className="w-[80%] h-[80%] object-contain group-hover:scale-105 transition-transform drop-shadow-lg" />
                    </div>
                    <div className="px-2 pb-2">
                        <span className="text-[9px] font-black uppercase text-blue-500 tracking-wider bg-blue-50 px-2 py-1 rounded-md">LIKE NEW</span>
                        <h3 className="text-slate-900 font-black text-lg mt-3 mb-1 truncate">Macbook Pro M1 2021</h3>
                        <p className="text-slate-500 text-xs font-medium mb-4">16GB RAM, 512GB SSD</p>
                        <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-black text-2xl">$899</span>
                            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors">
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product 2 */}
                <div className="bg-white rounded-3xl p-4 flex flex-col gap-4 shadow-xl border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer group">
                    <div className="w-full h-48 bg-[#111111] rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400" alt="Camera" className="w-[70%] h-[70%] object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="px-2 pb-2">
                        <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider bg-amber-50 px-2 py-1 rounded-md">USED - GOOD</span>
                        <h3 className="text-slate-900 font-black text-lg mt-3 mb-1 truncate">Canon EOS R5 Body</h3>
                        <p className="text-slate-500 text-xs font-medium mb-4">Low shutter count, 45MP</p>
                        <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-black text-2xl">$2,450</span>
                            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors">
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product 3 */}
                <div className="bg-white rounded-3xl p-4 flex flex-col gap-4 shadow-xl border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer group">
                    <div className="w-full h-48 bg-[#facfa8] rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400" alt="Headphones" className="w-[80%] h-[80%] object-contain group-hover:scale-105 transition-transform drop-shadow-xl" />
                    </div>
                    <div className="px-2 pb-2">
                        <span className="text-[9px] font-black uppercase text-blue-500 tracking-wider bg-blue-50 px-2 py-1 rounded-md">NEW IN BOX</span>
                        <h3 className="text-slate-900 font-black text-lg mt-3 mb-1 truncate">Sony WH-1000XM4</h3>
                        <p className="text-slate-500 text-xs font-medium mb-4">Noise Cancelling Wireless</p>
                        <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-black text-2xl">$199</span>
                            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors">
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
