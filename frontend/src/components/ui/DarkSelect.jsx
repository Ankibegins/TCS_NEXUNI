import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS, GPU_ACCELERATION } from '../../utils/animationSystem';

export default function DarkSelect({ label, value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    /* Close on outside click */
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative w-full">
            {label && (
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-display select-none">
                    {label}
                </span>
            )}

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-white font-medium text-left cursor-pointer"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: open
                        ? '1px solid rgba(249,115,22,0.55)'
                        : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: open ? '0 0 0 2px rgba(249,115,22,0.12)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
            >
                <span className={value ? 'text-white' : 'text-slate-500'}>{value || 'Select…'}</span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={TRANSITIONS.dropdown}
                >
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </motion.div>
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
                        animate={{ opacity: 1, y: 0,  scaleY: 1 }}
                        exit={{   opacity: 0, y: -6, scaleY: 0.92 }}
                        transition={TRANSITIONS.dropdown}
                        className="absolute left-0 right-0 z-50 mt-1.5 rounded-xl overflow-hidden"
                        style={{
                            transformOrigin: 'top',
                            background: 'linear-gradient(135deg, rgba(20,22,40,0.98) 0%, rgba(14,16,32,0.99) 100%)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(249,115,22,0.08)',
                            backdropFilter: 'blur(24px)',
                            ...GPU_ACCELERATION
                        }}
                    >
                        {/* Top accent line */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                        <div className="py-1.5 max-h-52 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                            {options.map((opt) => {
                                const isSelected = opt === value;
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-white/[0.06] hover:text-white transition-colors duration-150 cursor-pointer"
                                        style={{
                                            color: isSelected ? '#f97316' : '#cbd5e1',
                                            background: isSelected ? 'rgba(249,115,22,0.1)' : 'transparent',
                                            fontWeight: isSelected ? 600 : 400,
                                        }}
                                    >
                                        <span>{opt}</span>
                                        {isSelected && (
                                            <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
