import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PremiumButton({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  disabled, 
  type = 'button',
  to = null
}) {
  const isPrimary = variant === 'primary';

  // Base glowing shadow and border settings
  const baseShadow = isPrimary 
    ? '0px 4px 20px rgba(249,115,22,0.3)' 
    : '0px 4px 15px rgba(255,255,255,0.05)';
    
  const hoverShadow = isPrimary 
    ? '0px 0px 40px rgba(249,115,22,0.6), inset 0px 0px 15px rgba(255,255,255,0.2)' 
    : '0px 0px 25px rgba(255,255,255,0.2), inset 0px 0px 15px rgba(255,255,255,0.1)';

  const baseBg = isPrimary 
    ? 'bg-gradient-to-br from-primary/90 to-orange-600/90' 
    : 'bg-white/5';
    
  const borderClass = isPrimary 
    ? 'border border-orange-400/50' 
    : 'border border-white/20';

  const ButtonContent = (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.04, boxShadow: hoverShadow }}
      whileTap={{ scale: 0.97 }}
      initial={{ boxShadow: baseShadow }}
      animate={{ boxShadow: baseShadow }}
      className={`group relative overflow-hidden rounded-xl px-8 py-3.5 font-bold text-sm text-white backdrop-blur-xl transition-colors ${baseBg} ${borderClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Animated Light Streak (Reflection) */}
      <motion.div
        animate={{ x: ['-200%', '200%'] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3.5, 
          ease: "linear",
          repeatDelay: 1.5
        }}
        className="absolute inset-y-0 left-0 z-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
      />
      
      {/* Subtle top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-0 opacity-50" />
      
      {/* Ambient hover glow inside button */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 z-0 pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );

  if (to) {
    return <Link to={to}>{ButtonContent}</Link>;
  }

  return ButtonContent;
}
