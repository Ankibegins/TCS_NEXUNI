import React from 'react';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PremiumButton from '../ui/PremiumButton';

export default function HeroSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } }
    };

    return (
        <section className="relative w-full overflow-hidden min-h-[90vh] flex items-center">
            {/* Animated Ambient Background Gradients (Gradient Mesh) */}
            <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-orange-600/10 blur-[100px] pointer-events-none mix-blend-screen" />
            
            <div className="max-w-7xl mx-auto px-8 py-20 relative z-10 w-full flex flex-col lg:flex-row items-center gap-16">
                
                {/* Left Content Area */}
                <motion.div 
                    className="w-full lg:w-[55%] space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
                        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">NEW: AI-MATCHING FOR FREELANCERS</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 variants={itemVariants} className="text-5xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight text-white">
                        Your Premium <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                            Freelance
                        </span>
                        <br /> Market
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p variants={itemVariants} className="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-lg font-medium">
                        Connect with top-tier creative talent. Elevate your projects with enterprise-grade professionals secured by Nexuni trust.
                    </motion.p>

                    {/* Actions */}
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5 pt-2">
                        <PremiumButton to="/login" variant="primary">
                            <span>Start Freelancing</span>
                            <ArrowRight className="w-4 h-4" />
                        </PremiumButton>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div variants={itemVariants} className="flex items-center gap-5 pt-6 mt-4 border-t border-white/10">
                        <div className="flex -space-x-3">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=user1&backgroundColor=0f172a" alt="user" className="w-10 h-10 rounded-full border-2 border-brand-bg bg-brand-card shadow-sm" />
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=user2&backgroundColor=1e293b" alt="user" className="w-10 h-10 rounded-full border-2 border-brand-bg bg-brand-card shadow-sm" />
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=user3&backgroundColor=334155" alt="user" className="w-10 h-10 rounded-full border-2 border-brand-bg bg-brand-card shadow-sm" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-amber-400 text-[10px] tracking-widest mb-0.5">★★★★★</div>
                            <span className="text-xs text-slate-400 font-medium tracking-wide">Trusted by <strong className="text-white">12k+</strong> creators</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Image/Graphic Area */}
                <motion.div 
                    className="w-full lg:w-[45%] relative mt-16 lg:mt-0"
                    initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                >
                    {/* Main Image Container with Glassmorphism Frame */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative rounded-2xl p-2.5 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="rounded-xl overflow-hidden relative border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/90 via-transparent to-transparent z-10 mix-blend-multiply" />
                            <img 
                                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000" 
                                alt="Modern Workspace" 
                                className="w-full h-full object-cover rounded-xl aspect-[4/3] filter contrast-[1.1] brightness-[0.9]" 
                            />
                        </div>
                        
                        {/* Inner subtle stroke */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
                    </motion.div>

                    {/* Floating Glassmorphism Badge */}
                    <motion.div 
                        animate={{ y: [0, -12, 0] }}
                        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                        className="absolute -bottom-8 -left-6 lg:-left-12 bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 flex items-center gap-4 z-20"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1">ENTERPRISE GRADE</p>
                            <p className="text-sm font-black text-white">Verified Talent Pool</p>
                        </div>
                    </motion.div>
                    
                    {/* Floating Tech Badge */}
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                        className="absolute top-10 -right-4 lg:-right-8 bg-white/5 backdrop-blur-lg rounded-xl p-3 shadow-2xl border border-white/10 flex items-center gap-3 z-20"
                    >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                           <div className="w-2 h-2 rounded-full bg-emerald-400 relative" />
                        </div>
                        <p className="text-xs font-bold text-white pr-2 tracking-wide">99.9% Uptime</p>
                    </motion.div>
                    
                </motion.div>
            </div>
        </section>
    );
}
