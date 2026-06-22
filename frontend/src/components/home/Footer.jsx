import React from 'react';
import { Globe, Phone, Share2, Download } from 'lucide-react';

export default function Footer() {
    return (
        <>
            <div className="border-t-[6px] border-primary w-full" />
            <footer className="bg-brand-bg text-white pb-10 pt-16 border-t border-primary/20">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-16">
                        <div className="md:col-span-2 space-y-6 pr-8">
                            <h2 className="text-2xl font-black text-primary tracking-wide">NEXUNI</h2>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                The ultimate destination for professional services and quality second-hand goods. Bridging the gap between talent and needs.
                            </p>
                            <div className="flex items-center gap-4 pt-2">
                                <a href="#" className="p-3 bg-brand-card hover:bg-brand-sidebar border border-primary/30 text-white rounded-full transition-colors shadow-sm"><Globe className="w-4 h-4" /></a>
                                <a href="#" className="p-3 bg-brand-card hover:bg-brand-sidebar border border-primary/30 text-white rounded-full transition-colors shadow-sm"><Phone className="w-4 h-4" /></a>
                                <a href="#" className="p-3 bg-brand-card hover:bg-brand-sidebar border border-primary/30 text-white rounded-full transition-colors shadow-sm"><Share2 className="w-4 h-4" /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-slate-300">Platform</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">Freelancers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Marketplace</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-slate-300">Resources</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-slate-300">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-slate-300">Mobile App</h4>
                            <div className="space-y-3">
                                <button className="w-full bg-brand-sidebar text-white flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold hover:bg-brand-card transition-colors shadow-sm border border-primary/40">
                                    <Download className="w-4 h-4" /> App Store
                                </button>
                                <button className="w-full bg-brand-sidebar text-white flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold hover:bg-brand-card transition-colors shadow-sm border border-primary/40">
                                    <Download className="w-4 h-4" /> Google Play
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-primary/20">
                        <p className="text-xs text-slate-400 font-medium mb-4 md:mb-0">© 2024 NEXUNI Marketplace. All rights reserved.</p>
                        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
                            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
                            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
