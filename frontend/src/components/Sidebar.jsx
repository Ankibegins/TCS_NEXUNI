import React from 'react';
import {
    LayoutDashboard,
    Briefcase,
    Package,
    ShoppingCart,
    BarChart3,
    MessageSquare
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userName = user?.name || 'John Doe';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'JD';

    return (
        <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-brand-sidebar flex flex-col justify-between">
            <div className="flex flex-col">
                {/* Logo Area */}
                <div className="flex flex-col gap-1 p-6 border-b border-white/10">
                    <h1 className="text-white text-xl font-bold leading-tight tracking-wide">NEXUNI</h1>
                    <p className="text-slate-300 text-[10px] uppercase font-bold tracking-widest">Seller Central</p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 p-4 mt-2">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
                        { icon: Briefcase, label: 'Services', href: '/dashboard' },
                        { icon: Package, label: 'Products', href: '/dashboard' },
                        { icon: ShoppingCart, label: 'Orders', href: '/dashboard' },
                        { icon: BarChart3, label: 'Analytics', href: '/dashboard' },
                        { icon: MessageSquare, label: 'Messages', href: '/dashboard' },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.label}
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-white/10 text-white font-medium shadow-sm border border-white/5'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile Area */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-10 w-10 rounded-full bg-slate-700/50 flex items-center justify-center text-white font-bold text-sm border border-white/20">
                        {userInitials}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-white">{userName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{user?.role === 'client' ? 'Client' : 'Premium Seller'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
