import React from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon = HelpCircle, title, description, actionText, onActionClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col items-center justify-center py-16 px-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center max-w-md mx-auto"
            style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 0 12px rgba(255,255,255,0.01)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                <Icon className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <h4 className="text-base font-bold text-white mb-1.5 tracking-wide">{title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium mb-5 max-w-[280px]">{description}</p>
            {actionText && onActionClick && (
                <button
                    onClick={onActionClick}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-orange-600 rounded-lg text-xs font-bold text-white shadow-[0_0_12px_rgba(249,115,22,0.25)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                    {actionText}
                </button>
            )}
        </motion.div>
    );
}
