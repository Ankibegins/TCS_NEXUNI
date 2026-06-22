import React from 'react';

export default function Testimonials() {
    return (
        <div className="bg-brand-bg text-white py-24">
            <div className="max-w-7xl mx-auto px-8 space-y-16">
                <h2 className="text-4xl font-black text-center text-white">What our users say</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-brand-card rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all border border-primary/20 flex flex-col">
                        <div className="flex items-center gap-1 text-amber-400 mb-6 text-xl">
                            {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-1 font-medium">
                            "I sold my old camera and found a freelance developer for my startup project on the same day. NEXUNI is exactly what I needed."
                        </p>
                        <div className="flex items-center gap-4">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Michael" alt="Michael" className="w-12 h-12 rounded-full bg-brand-sidebar border border-primary/50 shadow-sm" />
                            <div>
                                <h4 className="font-bold text-white text-sm">Michael Reed</h4>
                                <p className="text-xs text-slate-400 font-medium tracking-wide">Entrepreneur</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-brand-card rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all border border-primary/20 flex flex-col">
                        <div className="flex items-center gap-1 text-amber-400 mb-6 text-xl">
                            {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-1 font-medium">
                            "As a freelance designer, NEXUNI provides a steady stream of high-quality leads. The payment process is incredibly smooth and fair."
                        </p>
                        <div className="flex items-center gap-4">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Jessica" alt="Jessica" className="w-12 h-12 rounded-full bg-brand-sidebar border border-primary/50 shadow-sm" />
                            <div>
                                <h4 className="font-bold text-white text-sm">Jessica Lane</h4>
                                <p className="text-xs text-slate-400 font-medium tracking-wide">Freelance Designer</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-brand-card rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all border border-primary/20 flex flex-col">
                        <div className="flex items-center gap-1 text-amber-400 mb-6 text-xl">
                            {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-1 font-medium">
                            "Found a high-end lens for my photography business at half the retail price. The verification process gave me peace of mind."
                        </p>
                        <div className="flex items-center gap-4">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Robert" alt="Robert" className="w-12 h-12 rounded-full bg-brand-sidebar border border-primary/50 shadow-sm" />
                            <div>
                                <h4 className="font-bold text-white text-sm">Robert Thompson</h4>
                                <p className="text-xs text-slate-400 font-medium tracking-wide">Photographer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
