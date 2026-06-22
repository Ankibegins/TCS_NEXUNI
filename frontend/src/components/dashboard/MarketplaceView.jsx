import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';

export default function MarketplaceView() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            {/* Icon */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative mb-8"
            >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-orange-600/10 border border-primary/20 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.2)] backdrop-blur-sm">
                    <Rocket className="w-10 h-10 text-primary" />
                </div>
                {/* Sparkle */}
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-2 -right-2"
                >
                    <Sparkles className="w-5 h-5 text-orange-400" />
                </motion.div>
            </motion.div>

            {/* Text */}
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">Soon</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
                The Marketplace is under construction. We're building something exceptional — stay tuned.
            </p>

            {/* Animated dashes / progress dots */}
            <div className="flex items-center gap-2 mt-8">
                {[0, 1, 2, 3, 4].map(i => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                        className={`rounded-full bg-primary ${i === 2 ? 'w-6 h-2' : 'w-2 h-2'}`}
                    />
                ))}
            </div>
        </motion.div>
    );
}
