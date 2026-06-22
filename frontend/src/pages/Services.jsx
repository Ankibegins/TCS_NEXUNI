import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, Filter, Star,
    Code, PenTool, Edit3, Video, FileText, Search,
    Briefcase, Clock, CheckCircle2
} from 'lucide-react';
import OrderCard from '../components/dashboard/OrderCard';
import EmptyState from '../components/dashboard/EmptyState';
import { apiCache } from '../utils/apiCache';

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({ 
        opacity: 1, 
        y: 0, 
        transition: { 
            delay: Math.min(i * 0.03, 0.25), // Caps cascade delay to prevent slow Popping lag
            duration: 0.25, 
            ease: [0.25, 0.4, 0.25, 1] 
        } 
    })
};

function getIconForCategory(category) {
    switch (category) {
        case 'Development': return Code;
        case 'Design & Creative': return PenTool;
        case 'Writing': return Edit3;
        case 'Video & Audio': return Video;
        default: return FileText;
    }
}

const filterBtn = 'flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-[background] duration-200';

function getReputationBadgeStyle(level) {
    switch (level) {
        case 'Elite Expert':
            return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
        case 'Expert':
            return 'bg-purple-500/15 text-purple-400 border-purple-500/20';
        case 'Professional':
            return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
        case 'Rising Freelancer':
            return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
        default:
            return 'bg-slate-500/15 text-slate-400 border-slate-500/20';
    }
}

export default function Services() {
    const [activeTab, setActiveTab] = useState('available'); // 'available', 'taken', 'completed'
    const [servicesData, setServicesData] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Performance Optimization: lazy state initializer runs localStorage check exactly once
    const [user] = useState(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });

    const fetchData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const serviceCacheKey = user?._id ? `services_${user._id}` : 'services_all';
            const ordersCacheKey = user?._id ? `orders_${user._id}` : 'orders_none';

            // 1. Check in-memory cache for instant SWR loading
            const cachedServices = apiCache.get(serviceCacheKey);
            if (cachedServices) {
                setServicesData(cachedServices);
                setIsLoading(false);
            }
            const cachedOrders = apiCache.get(ordersCacheKey);
            if (cachedOrders) {
                setMyOrders(cachedOrders);
            }

            // 2. Fetch available services, excluding our own
            const serviceUrl = user?._id 
                ? `http://localhost:5000/api/services?excludeSeller=${user._id}`
                : 'http://localhost:5000/api/services';
            
            const sRes = await fetch(serviceUrl);
            const sData = await sRes.json();
            
            if (sData.success) {
                const grouped = {};
                sData.data.forEach(service => {
                    const cat = service.category || 'Other';
                    if (!grouped[cat]) {
                        grouped[cat] = { category: cat.toUpperCase(), icon: getIconForCategory(cat), items: [] };
                    }
                    grouped[cat].items.push({
                        id: service._id,
                        title: service.title,
                        price: service.pricing?.basePrice || 0,
                        currency: service.pricing?.currency || 'INR',
                        experience: service.sellerId?.stats?.reputationLevel || 'Beginner',
                        completedProjects: service.sellerId?.stats?.completedProjects || 0,
                        sellerAverageRating: service.sellerId?.stats?.averageRating || 0,
                        sellerTotalRatings: service.sellerId?.stats?.totalRatings || 0,
                        published: new Date(service.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        rating: service.rating || 5.0,
                        reviews: service.reviews || 0,
                        user: service.sellerId?.name || 'Anonymous',
                        avatar: service.sellerId?.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=anon&backgroundColor=1e293b',
                        thumbnail: service.thumbnail === 'no-photo.jpg'
                            ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop'
                            : service.thumbnail
                    });
                });
                
                const finalServices = Object.values(grouped);
                setServicesData(finalServices);
                apiCache.set(serviceCacheKey, finalServices); // update cache
            }

            // 3. Fetch my orders if logged in
            if (user?.token) {
                const oRes = await fetch('http://localhost:5000/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const oData = await oRes.json();
                if (oData.success) {
                    setMyOrders(oData.data);
                    apiCache.set(ordersCacheKey, oData.data); // update cache
                }
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    }, [user?._id, user?.token]);

    useEffect(() => {
        // Fetch on mount (will pull from cache instantly, then revalidate silently)
        const hasCache = user?._id && apiCache.get(`services_${user._id}`);
        fetchData(!!hasCache);
    }, [fetchData, user?._id]);

    const handleHire = async (serviceId) => {
        if (!user?.token) {
            alert('Please login to hire a service');
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ serviceId })
            });
            const data = await res.json();
            if (data.success) {
                apiCache.clear(); // invalidate cache on order create
                // Refresh orders
                const oRes = await fetch('http://localhost:5000/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const oData = await oRes.json();
                if (oData.success) {
                    setMyOrders(oData.data);
                    setActiveTab('taken'); // switch tab
                }
            } else {
                alert(data.message || 'Failed to hire service');
            }
        } catch (err) {
            console.error(err);
            alert('Error hiring service');
        }
    };

    const takenOrders = myOrders.filter(o => o.status === 'Taken' || o.status === 'In Progress');
    const completedOrders = myOrders.filter(o => o.status === 'Completed');

    return (
        <div className="w-full space-y-5 pb-16">
            {/* Section Header & Sub-Tabs */}
            <div className="pb-2 border-b border-white/8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">Take Services</h2>
                    <p className="text-sm text-slate-400 font-medium">Discover and hire professional freelancers across all categories.</p>
                </div>
                
                <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'available' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" /> Available
                    </button>
                    <button
                        onClick={() => setActiveTab('taken')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'taken' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Clock className="w-4 h-4" /> Taken ({takenOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'completed' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Completed ({completedOrders.length})
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: AVAILABLE SERVICES */}
            {activeTab === 'available' && (
                <div className="space-y-5">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <button className={filterBtn}>
                                Category <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className={filterBtn}>
                                Price Range <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className={filterBtn}>
                                Experience <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button className={filterBtn}>
                                Rating <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <div className="w-px h-5 bg-white/10 mx-1" />
                            <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200">
                                <Filter className="w-3.5 h-3.5" /> Clear All
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-[border-color] duration-200 w-52"
                            />
                        </div>
                    </div>

                    {/* Services List */}
                    <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden min-h-[300px]">
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 bg-white/3">
                            <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</div>
                            <div className="col-span-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</div>
                            <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level</div>
                            <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Published</div>
                            <div className="col-span-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</div>
                            <div className="col-span-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right"></div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-3">
                                <div className="flex gap-1.5">
                                    {[0,1,2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-2 h-2 rounded-full bg-primary"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Loading services…</p>
                            </div>
                        ) : servicesData.length === 0 ? (
                            <div className="flex items-center justify-center min-h-[350px] w-full py-8">
                                <EmptyState
                                    icon={Briefcase}
                                    title="No services available"
                                    description="No services available yet. Try adjusting your filters or check back later."
                                />
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {servicesData.map((group, gIndex) => {
                                    const GroupIcon = group.icon;
                                    return (
                                        <div key={gIndex}>
                                            <div className="px-5 py-2.5 flex items-center gap-2 bg-white/3">
                                                <GroupIcon className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.category}</span>
                                                <span className="text-[10px] text-slate-600 font-medium">({group.items.length})</span>
                                            </div>

                                            <div className="divide-y divide-white/5">
                                                {group.items.map((item, iIndex) => (
                                                    <motion.div
                                                        key={item.id}
                                                        custom={iIndex}
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        className="grid grid-cols-12 gap-4 px-5 py-4 items-center cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.02] border-b border-white/5 last:border-b-0 transition-colors duration-200 group"
                                                    >
                                                        {/* Service title + seller */}
                                                        <div className="col-span-12 lg:col-span-5 flex items-center gap-3">
                                                            <div
                                                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-orange-400 font-bold text-xl shadow-[inset_0_2px_10px_rgba(249,115,22,0.15)]"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.02) 100%)',
                                                                    border: '1px solid rgba(249,115,22,0.25)',
                                                                }}
                                                            >
                                                                {item.user.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors duration-200">
                                                                    {item.title}
                                                                </h4>
                                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                                    <img src={item.avatar} alt={item.user} className="w-4 h-4 rounded-full object-cover border border-white/10" />
                                                                    <span className="text-xs text-slate-400 truncate font-semibold">{item.user}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-6 lg:col-span-1 text-sm font-bold text-white">
                                                            {item.currency === 'USD' ? '$' : '₹'}{item.price.toLocaleString()}
                                                        </div>

                                                        <div className="col-span-6 lg:col-span-2 flex flex-col items-start gap-1">
                                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getReputationBadgeStyle(item.experience)}`}>
                                                                {item.experience}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 font-medium">
                                                                {item.completedProjects} Completed Projects
                                                            </span>
                                                        </div>

                                                        <div className="col-span-4 lg:col-span-2 text-xs text-slate-500">
                                                            {item.published}
                                                        </div>

                                                        <div className="col-span-4 lg:col-span-1 flex items-center gap-1 text-sm font-bold text-white">
                                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                                                            <span>{Number(item.sellerAverageRating || 0).toFixed(1)}/5</span>
                                                            <span className="text-xs text-slate-500 font-medium">({item.sellerTotalRatings || 0})</span>
                                                        </div>

                                                        {/* Action - Hire Button */}
                                                        <div className="col-span-4 lg:col-span-1 flex justify-end">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleHire(item.id);
                                                                }}
                                                                className="px-3.5 py-1.5 bg-gradient-to-r from-primary/10 to-orange-500/10 hover:from-primary/25 hover:to-orange-500/25 text-primary hover:text-white border border-primary/20 hover:border-primary/40 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-[0_0_12px_rgba(249,115,22,0.15)] cursor-pointer"
                                                            >
                                                                Hire
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: TAKEN / COMPLETED SERVICES */}
            {(activeTab === 'taken' || activeTab === 'completed') && (
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="flex gap-1.5">
                                {[0,1,2].map(i => (
                                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
                                ))}
                            </div>
                        </div>
                    ) : (activeTab === 'taken' ? takenOrders : completedOrders).length === 0 ? (
                        <div className="flex items-center justify-center min-h-[350px] w-full py-8">
                            <EmptyState
                                icon={activeTab === 'taken' ? Clock : CheckCircle2}
                                title={activeTab === 'taken' ? "No taken services" : "No completed services"}
                                description={
                                    activeTab === 'taken'
                                        ? "You haven't hired any services yet. Try adjusting your filters or browse the available services tab."
                                        : "You don't have any completed services yet."
                                }
                            />
                        </div>
                    ) : (
                        (activeTab === 'taken' ? takenOrders : completedOrders).map((order) => (
                            <OrderCard key={order._id} order={order} role="consumer" onUpdateStatus={fetchData} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
