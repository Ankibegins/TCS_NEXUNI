import React from 'react';
import { CheckCircle2, Truck } from 'lucide-react';

export default function OrderHistory() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-wide">Order History</h2>
                <a href="#" className="text-sm font-medium text-primary-light hover:text-white transition-colors">See all</a>
            </div>
            <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-slate-900 font-bold text-xs">Logo Design Package</h4>
                            <p className="text-slate-400 text-[10px] font-medium">Order #NX-8821 • Oct 12, 2023</p>
                        </div>
                    </div>
                    <span className="text-slate-900 font-black text-xs">$350.00</span>
                </div>

                <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-slate-900 font-bold text-xs">Monitor Stand Pro</h4>
                            <p className="text-slate-400 text-[10px] font-medium">Order #NX-9012 • Oct 08, 2023</p>
                        </div>
                    </div>
                    <span className="text-slate-900 font-black text-xs">$45.00</span>
                </div>
            </div>
        </section>
    );
}
