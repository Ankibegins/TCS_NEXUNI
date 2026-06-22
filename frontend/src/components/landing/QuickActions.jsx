import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Heart, Clock } from 'lucide-react';

export default function QuickActions() {
    const navigate = useNavigate();
    
    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { icon: Users, label: 'Freelancers', color: 'text-blue-500', bg: 'bg-blue-50', path: '/dashboard' },
                { icon: ShoppingBag, label: 'Marketplace', color: 'text-amber-500', bg: 'bg-amber-50' },
                { icon: Heart, label: 'Saved', color: 'text-rose-500', bg: 'bg-rose-50' },
                { icon: Clock, label: 'History', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map((action) => {
                const Icon = action.icon;
                return (
                    <button 
                        key={action.label} 
                        onClick={() => action.path && navigate(action.path)}
                        className="bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-all group"
                    >
                        <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`w-6 h-6 ${action.color}`} />
                        </div>
                        <span className="text-slate-900 font-bold text-sm tracking-wide">{action.label}</span>
                    </button>
                );
            })}
        </section>
    );
}
