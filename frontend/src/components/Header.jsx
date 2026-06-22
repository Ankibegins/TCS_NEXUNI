import React, { useState, useEffect, useRef } from 'react';
import { Search, GraduationCap, Briefcase, ShoppingBag, LayoutGrid, User as UserIcon, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS, GPU_ACCELERATION } from '../utils/animationSystem';

const TABS = [
    { id: 'freelance', label: 'My Freelance Services', icon: Briefcase },
    { id: 'take', label: 'Take Services', icon: ShoppingBag },
    { id: 'marketplace', label: 'Marketplace', icon: LayoutGrid },
];

function TabButton({ tab, isActive, onClick }) {
    const Icon = tab.icon;

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={GPU_ACCELERATION}
            className="relative flex items-center gap-1.5 rounded-xl font-semibold transition-colors duration-200 cursor-pointer select-none outline-none px-3.5 py-1.5 text-xs h-8"
        >
            {/* Active pill — static glow, no spinning rings */}
            {isActive && (
                <motion.div
                    layoutId="header-active-tab-indicator"
                    className="absolute inset-0 rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0.08) 100%)',
                        boxShadow: '0 0 0 1px rgba(249,115,22,0.45), 0 2px 12px rgba(249,115,22,0.15), inset 0 1px 0 rgba(255,255,255,0.12)',
                    }}
                />
            )}

            <Icon className={`relative z-10 transition-colors duration-300 w-3.5 h-3.5 ${isActive ? 'text-orange-300' : 'text-slate-400'}`} />
            <span className={`relative z-10 transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                {tab.label}
            </span>
            {isActive && (
                <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="relative z-10 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(249,115,22,0.9)]"
                >
                    <motion.span
                        animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-primary"
                    />
                </motion.span>
            )}
        </motion.button>
    );
}

function TabPillContainer({ children }) {
    return (
        <div
            className="relative flex items-center gap-0.5 rounded-2xl p-1 shrink-0"
            style={{
                background: 'linear-gradient(135deg, rgba(20,20,35,0.97) 0%, rgba(15,15,28,0.98) 100%)',
                boxShadow: '0 0 0 1px rgba(249,115,22,0.25), 0 4px 16px rgba(0,0,0,0.3), 0 0 18px rgba(249,115,22,0.08)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Static top shimmer highlight */}
            <div className="absolute inset-x-8 top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full pointer-events-none" />
            <div className="relative flex items-center gap-0.5">{children}</div>
        </div>
    );
}

export default function Header() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'freelance';
    
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Performance Optimization: Parse localStorage user exactly once on mount, not on every render
    const [user] = useState(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });

    const userName = user?.name || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

    const handleTabChange = (id) => {
        setSearchParams({ tab: id });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setDropdownOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleEscapeKey);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [dropdownOpen]);

    return (
        <header className="h-16 bg-brand-bg/70 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-8 shrink-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.15)] transition-all duration-200">
            {/* Left Logo + Tabs */}
            <div className="flex items-center gap-6 lg:gap-8">
                {/* Logo — navigates to Home "/" */}
                <motion.div
                    className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                    style={GPU_ACCELERATION}
                >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.4)] transition-shadow duration-200 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]">
                        <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-black text-lg tracking-wide">NEXUNI</span>
                </motion.div>

                {/* Dashboard Tabs Inside Main Navbar */}
                <TabPillContainer>
                    {TABS.map(tab => (
                        <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onClick={() => handleTabChange(tab.id)}
                        />
                    ))}
                </TabPillContainer>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm cursor-pointer select-none">
                    <Search className="w-3.5 h-3.5" />
                    <span className="text-xs hidden sm:inline">Search...</span>
                    <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
                </button>

                {/* Profile Trigger + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 pl-3 border-l border-white/10 hover:opacity-95 transition-all outline-none cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-orange-600/80 border border-primary/30 group-hover:border-primary/60 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(249,115,22,0.25)] transition-all">
                            {userInitials}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-bold text-white leading-none group-hover:text-primary transition-colors">{userName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{user?.role === 'client' ? 'Client' : 'Seller'}</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={TRANSITIONS.dropdown}
                                className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 p-1.5 shadow-2xl z-50 overflow-hidden"
                                style={{
                                    transformOrigin: 'top right',
                                    background: 'linear-gradient(135deg, rgba(30,41,59,0.98) 0%, rgba(15,23,42,0.99) 100%)',
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)',
                                    ...GPU_ACCELERATION
                                }}
                            >
                                <div className="px-3 py-2 border-b border-white/5 mb-1">
                                    <p className="text-[10px] text-slate-400 font-medium">Logged in as</p>
                                    <p className="text-xs font-bold text-white truncate">{user?.email || ''}</p>
                                </div>
                                <button
                                    onClick={() => { setDropdownOpen(false); setSearchParams({ tab: 'freelance' }); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                                >
                                    <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Dashboard
                                </button>
                                <button
                                    onClick={() => { setDropdownOpen(false); alert('Profile component coming soon!'); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                                >
                                    <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Profile
                                </button>
                                <button
                                    onClick={() => { setDropdownOpen(false); alert('Settings component coming soon!'); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                                >
                                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" /> Settings
                                </button>
                                <div className="h-px bg-white/5 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left cursor-pointer"
                                >
                                    <LogOut className="w-3.5 h-3.5 text-red-400" /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
