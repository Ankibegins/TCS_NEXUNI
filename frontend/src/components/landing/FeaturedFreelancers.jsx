import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedFreelancers() {
    const navigate = useNavigate();
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-wide">Featured Freelancers</h2>
                <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">View all</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-lg border border-slate-100">
                    <div className="relative mb-4">
                        <div className="w-20 h-20 bg-amber-200 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=transparent" alt="Sarah" className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute bottom-[-4px] right-[-4px] w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full"></span>
                    </div>
                    <h3 className="text-slate-900 font-black text-lg">Sarah Jenkins</h3>
                    <p className="text-slate-500 text-xs font-semibold mb-3 tracking-wide">UI/UX Designer</p>
                    <div className="flex items-center gap-1 mb-5">
                        <span className="text-amber-500 text-xs">⭐</span>
                        <span className="text-amber-500 text-xs font-bold">4.9</span>
                        <span className="text-slate-400 text-[10px] font-medium">(124)</span>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-primary font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                        Hire Now
                    </button>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-lg border border-slate-100">
                    <div className="relative mb-4">
                        <div className="w-20 h-20 bg-orange-200 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mark&backgroundColor=transparent" alt="Mark" className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute bottom-[-4px] right-[-4px] w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full"></span>
                    </div>
                    <h3 className="text-slate-900 font-black text-lg">Mark Chen</h3>
                    <p className="text-slate-500 text-xs font-semibold mb-3 tracking-wide">Full-stack Dev</p>
                    <div className="flex items-center gap-1 mb-5">
                        <span className="text-amber-500 text-xs">⭐</span>
                        <span className="text-amber-500 text-xs font-bold">5.0</span>
                        <span className="text-slate-400 text-[10px] font-medium">(89)</span>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-primary font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                        Hire Now
                    </button>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-lg border border-slate-100">
                    <div className="relative mb-4">
                        <div className="w-20 h-20 bg-emerald-200 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Elena&backgroundColor=transparent" alt="Elena" className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute bottom-[-4px] right-[-4px] w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full"></span>
                    </div>
                    <h3 className="text-slate-900 font-black text-lg">Elena Rodriguez</h3>
                    <p className="text-slate-500 text-xs font-semibold mb-3 tracking-wide">Content Strategist</p>
                    <div className="flex items-center gap-1 mb-5">
                        <span className="text-amber-500 text-xs">⭐</span>
                        <span className="text-amber-500 text-xs font-bold">4.8</span>
                        <span className="text-slate-400 text-[10px] font-medium">(210)</span>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-primary font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                        Hire Now
                    </button>
                </div>
            </div>
        </section>
    );
}
