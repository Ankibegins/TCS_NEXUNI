import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CreditCard, Tag, Info, Trash2, Edit2, AlertCircle, CheckCircle2, Plus, X, Briefcase, Clock } from 'lucide-react';
import DarkSelect from '../components/ui/DarkSelect';
import OrderCard from '../components/dashboard/OrderCard';
import EmptyState from '../components/dashboard/EmptyState';
import { apiCache } from '../utils/apiCache';

/* ─── Shared input/select styles (dark, compact) ─── */
const inputCls = [
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white',
    'placeholder:text-slate-500 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40',
    'transition-[border-color,box-shadow] duration-200',
].join(' ');

const labelCls = 'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5';

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

const sectionCls = [
    'bg-white/5 border border-white/8 rounded-xl p-5',
].join(' ');

/* ─── Section header ─── */
function SectionHeader({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <Icon className="w-4 h-4 text-primary" style={{ willChange: 'transform' }} />
            <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
        </div>
    );
}

export default function MyFreelanceService() {
    const [activeTab, setActiveTab] = useState('services'); // 'services', 'active', 'completed'
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Development');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('1 Day');
    const [revisions, setRevisions] = useState('1 Revision');
    const [currency, setCurrency] = useState('INR');
    const [extras, setExtras] = useState([{ name: '', description: '', price: '' }]);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [editingId, setEditingId] = useState(null);
    
    const [services, setServices] = useState([]);
    const [sellerOrders, setSellerOrders] = useState([]);
    const [profile, setProfile] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => { 
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const hasCache = userObj?._id && apiCache.get(`my_services_${userObj._id}`);
        fetchData(!!hasCache); 
    }, []);

    const fetchData = async (silent = false) => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const cachedUser = JSON.parse(userStr);
            const { token } = cachedUser;

            const servicesKey = `my_services_${cachedUser._id}`;
            const ordersKey = `seller_orders_${cachedUser._id}`;
            const profileKey = `my_profile_${cachedUser._id}`;

            // Stale-While-Revalidate: Instant cache restoration
            const cachedServices = apiCache.get(servicesKey);
            if (cachedServices) setServices(cachedServices);

            const cachedOrders = apiCache.get(ordersKey);
            if (cachedOrders) setSellerOrders(cachedOrders);

            const cachedProfile = apiCache.get(profileKey);
            if (cachedProfile) setProfile(cachedProfile);

            if (!silent && !cachedServices) setIsLoading(true);

            // Fetch My Services
            const sRes = await fetch('https://tcs-nexuni.onrender.com/api/services/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const sData = await sRes.json();
            if (sData.success) {
                setServices(sData.data);
                apiCache.set(servicesKey, sData.data);
            }

            // Fetch My Orders (as Seller)
            const oRes = await fetch('https://tcs-nexuni.onrender.com/api/orders/seller-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const oData = await oRes.json();
            if (oData.success) {
                setSellerOrders(oData.data);
                apiCache.set(ordersKey, oData.data);
            }

            // Fetch Profile Stats
            const pRes = await fetch('https://tcs-nexuni.onrender.com/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const pData = await pRes.json();
            if (pData.success) {
                setProfile(pData);
                apiCache.set(profileKey, pData);
            }

        } catch (err) { 
            console.error('Failed to fetch data', err); 
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const { token } = JSON.parse(userStr);

            const res = await fetch(`https://tcs-nexuni.onrender.com/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                apiCache.clear(); // invalidate cache on order updates
                fetchData(true);
            } else {
                alert(data.message || 'Failed to update order status');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating order status');
        }
    };

    const handleEditClick = (service) => {
        const container = document.getElementById('dashboard-scroll-container');
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setEditingId(service._id);
        setTitle(service.title);
        setCategory(service.category);
        setDescription(service.description);
        setBasePrice(service.pricing?.basePrice?.toString() || '');
        setDeliveryTime(service.pricing?.deliveryTime || '1 Day');
        setRevisions(service.pricing?.revisions || '1 Revision');
        setCurrency(service.pricing?.currency || 'INR');
        setExtras(service.extras?.length > 0 ? service.extras : [{ name: '', description: '', price: '' }]);
        setTags(service.tags?.length > 0 ? service.tags : []);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setBasePrice('');
        setExtras([{ name: '', description: '', price: '' }]);
        setTags([]);
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            const { token } = JSON.parse(localStorage.getItem('user') || '{}');
            const res = await fetch(`https://tcs-nexuni.onrender.com/api/services/${serviceId}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                apiCache.clear(); // invalidate cache
                fetchData(true);
            }
            else setError(data.message || 'Failed to delete');
        } catch { setError('Failed to delete service'); }
    };

    const handleExtraChange = (i, field, val) => {
        const n = [...extras]; n[i][field] = val; setExtras(n);
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); setSuccess(false); setIsLoading(true);
        try {
            const { token } = JSON.parse(localStorage.getItem('user') || '{}');
            if (!token) throw new Error('Please login first.');
            if (!title || !description || !basePrice) throw new Error('Please fill in all required fields.');
            const payload = {
                title, category, subcategory: 'General', description,
                pricing: { basePrice: Number(basePrice), deliveryTime, revisions, currency },
                extras: extras.filter(ex => ex.name && ex.price).map(ex => ({ ...ex, price: Number(ex.price) })),
                tags, status: 'Published'
            };
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `https://tcs-nexuni.onrender.com/api/services/${editingId}` : 'https://tcs-nexuni.onrender.com/api/services';
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to publish service');
            apiCache.clear(); // invalidate cache on service creates/updates
            setSuccess(true);
            cancelEdit();
            fetchData(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

    const displayServices = services.filter(s => s._id !== editingId);
    const activeOrders = sellerOrders.filter(o => o.status === 'Taken' || o.status === 'In Progress');
    const completedOrders = sellerOrders.filter(o => o.status === 'Completed');

    return (
        <div className="w-full space-y-5 pb-16">
            {/* Section Header & Sub-Tabs */}
            <div className="pb-2 border-b border-white/8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">My Freelance Services</h2>
                    <p className="text-sm text-slate-400 font-medium">Manage your published services and active orders.</p>
                </div>
                
                <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'services' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" /> My Services
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'active' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Clock className="w-4 h-4" /> Active Orders ({activeOrders.length})
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

            {/* Seller Reputation Header Card */}
            {profile?.stats && (
                <div className="bg-gradient-to-r from-primary/10 via-white/[0.02] to-primary/5 border border-white/10 rounded-xl p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 border border-primary/30 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {profile.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white leading-tight">{profile.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getReputationBadgeStyle(profile.stats.reputationLevel)}`}>
                                    {profile.stats.reputationLevel || 'Beginner'}
                                </span>
                                <span className="text-slate-600 text-xs">•</span>
                                <span className="text-[10px] text-slate-400 font-medium">Freelancer Profile</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 sm:gap-8">
                        <div className="text-center">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Average Rating</p>
                            <p className="text-sm font-black text-amber-400">⭐ {profile.stats.averageRating ? profile.stats.averageRating.toFixed(1) : '0.0'}/5</p>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="text-center">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Completed Projects</p>
                            <p className="text-sm font-black text-white">{profile.stats.completedProjects || 0}</p>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="text-center">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Total Ratings</p>
                            <p className="text-sm font-black text-white">{profile.stats.totalRatings || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: SERVICES FORM & LIST */}
            {activeTab === 'services' && (
                <div className="space-y-6">
                    {/* ── Alerts ── */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2.5 rounded-lg text-sm font-medium"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ willChange: 'transform' }} />
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-lg text-sm font-medium"
                            >
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ willChange: 'transform' }} />
                                Service published successfully!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Main Form ── */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Left — Service Details */}
                            <div className={sectionCls}>
                                <SectionHeader icon={FileText} title="Service Details" />
                                <div className="space-y-3">
                                    <div>
                                        <label className={labelCls}>Title *</label>
                                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="I will design a SaaS landing page..." className={inputCls} />
                                    </div>
                                    <div>
                                        <DarkSelect label="Category" value={category} onChange={setCategory} options={['Development', 'Design & Creative', 'Writing', 'Marketing', 'Video & Audio']} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Description *</label>
                                        <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe your service. What makes you stand out?" className={inputCls + ' resize-none'} />
                                    </div>
                                </div>
                            </div>

                            {/* Right — Pricing + Tags stacked */}
                            <div className="flex flex-col gap-4">
                                <div className={sectionCls}>
                                    <SectionHeader icon={CreditCard} title="Pricing Setup" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelCls}>Base Price *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">₹</span>
                                                <input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} required placeholder="0.00" className={inputCls + ' pl-7 font-bold'} />
                                            </div>
                                        </div>
                                        <div>
                                            <DarkSelect label="Currency" value={currency} onChange={setCurrency} options={['INR', 'USD', 'EUR', 'GBP']} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Delivery Time</label>
                                            <div className="flex items-center rounded-lg w-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
                                                <button type="button" onClick={() => { const v = Math.max(1, (parseInt(deliveryTime) || 1) - 1); setDeliveryTime(`${v} ${v === 1 ? 'Day' : 'Days'}`); }}
                                                    className="flex items-center justify-center text-white font-bold text-lg w-9 h-9 border-r border-white/10 rounded-l-lg hover:bg-white/10 active:scale-95 transition-all select-none flex-shrink-0 cursor-pointer"
                                                >
                                                    −
                                                </button>
                                                <div className="flex-1 flex items-center justify-center gap-1.5 px-1">
                                                    <span className="text-sm font-bold text-white">{parseInt(deliveryTime) || 1}</span>
                                                    <span className="text-xs text-slate-400 font-medium">{(parseInt(deliveryTime) || 1) === 1 ? 'Day' : 'Days'}</span>
                                                </div>
                                                <button type="button" onClick={() => { const v = Math.min(90, (parseInt(deliveryTime) || 1) + 1); setDeliveryTime(`${v} ${v === 1 ? 'Day' : 'Days'}`); }}
                                                    className="flex items-center justify-center text-white font-bold text-lg w-9 h-9 border-l border-white/10 rounded-r-lg hover:bg-white/10 active:scale-95 transition-all select-none flex-shrink-0 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <DarkSelect label="Revisions" value={revisions} onChange={setRevisions} options={['1 Revision', '2 Revisions', 'Unlimited']} />
                                        </div>
                                    </div>
                                </div>

                                <div className={sectionCls}>
                                    <SectionHeader icon={Tag} title="Tags & Skills" />
                                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type a skill and press Enter..." className={inputCls} />
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                                            {tags.map(tag => (
                                                <span key={tag} onClick={() => setTags(tags.filter(t => t !== tag))} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full cursor-pointer">
                                                    {tag} <X className="w-3 h-3 opacity-60" />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={sectionCls}>
                            <div className="flex items-center justify-between mb-3">
                                <SectionHeader icon={Plus} title="Service Extras" />
                                <button type="button" onClick={() => setExtras([...extras, { name: '', description: '', price: '' }])} className="text-xs font-bold text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-lg cursor-pointer">
                                    + Add Extra
                                </button>
                            </div>
                            <div className="grid grid-cols-12 gap-3 mb-1.5 px-1">
                                <span className="col-span-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</span>
                                <span className="col-span-7 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</span>
                                <span className="col-span-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price</span>
                            </div>
                            <div className="space-y-2">
                                {extras.map((extra, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-center">
                                        <div className="col-span-3"><input type="text" value={extra.name} onChange={e => handleExtraChange(index, 'name', e.target.value)} placeholder="Fast Delivery" className={inputCls} /></div>
                                        <div className="col-span-7"><input type="text" value={extra.description} onChange={e => handleExtraChange(index, 'description', e.target.value)} placeholder="Deliver in 24 hours" className={inputCls} /></div>
                                        <div className="col-span-2 flex items-center gap-1.5">
                                            <input type="number" value={extra.price} onChange={e => handleExtraChange(index, 'price', e.target.value)} placeholder="500" className={inputCls + ' text-center font-bold'} />
                                            <button type="button" onClick={() => setExtras(extras.filter((_, i) => i !== index))} className="p-1.5 text-slate-500 rounded-lg flex-shrink-0 hover:text-red-400 cursor-pointer">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-slate-500 flex items-center gap-1.5"><Info className="w-3.5 h-3.5 flex-shrink-0" />By publishing you agree to our Seller Guidelines.</p>
                            <div className="flex items-center gap-3">
                                {editingId && (
                                    <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg text-sm font-bold border border-white/15 text-slate-300 cursor-pointer">Cancel</button>
                                )}
                                <button type="submit" disabled={isLoading} className={`px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-primary to-orange-600 shadow-[0_0_16px_rgba(249,115,22,0.3)] cursor-pointer ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                                    {isLoading ? (editingId ? 'Updating…' : 'Publishing…') : (editingId ? 'Update Service' : 'Publish Service')}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-3 pt-4 border-t border-white/8">
                        <h3 className="text-sm font-bold text-white tracking-wide">Created Services</h3>
                        <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[540px]">
                                    <thead>
                                        <tr className="border-b border-white/8 bg-white/3">
                                            {['Service / Project', 'Status', 'Base Price', ''].map(h => <th key={h} className={`px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${h === '' ? 'text-right' : ''}`}>{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {displayServices.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-12">
                                                    <EmptyState
                                                        icon={Briefcase}
                                                        title="No published services"
                                                        description="You haven't published any freelance services yet. Fill in the form above to publish your first service!"
                                                    />
                                                </td>
                                            </tr>
                                        ) : displayServices.map(service => (
                                            <tr key={service._id} className="group hover:bg-white/[0.04] transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-slate-400" /></div>
                                                        <div><p className="text-sm font-semibold text-white leading-tight">{service.title}</p><p className="text-[11px] text-slate-500">{service.category}</p></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${service.status === 'Published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-slate-400'}`}>{service.status || 'Draft'}</span></td>
                                                <td className="px-4 py-3 text-sm font-bold text-white">{service.pricing?.currency === 'USD' ? '$' : '₹'}{service.pricing?.basePrice}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button type="button" onClick={() => handleEditClick(service)} className="p-1.5 text-slate-400 hover:text-orange-500 rounded-lg cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                                                        <button type="button" onClick={() => handleDeleteService(service._id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: ACTIVE / COMPLETED ORDERS */}
            {(activeTab === 'active' || activeTab === 'completed') && (
                <div className="space-y-4">
                    {(activeTab === 'active' ? activeOrders : completedOrders).length === 0 ? (
                        <div className="flex items-center justify-center min-h-[350px] w-full py-8">
                            <EmptyState
                                icon={activeTab === 'active' ? Clock : CheckCircle2}
                                title={activeTab === 'active' ? "No active orders" : "No completed orders"}
                                description={
                                    activeTab === 'active'
                                        ? "You don't have any active orders from clients right now."
                                        : "You haven't completed any orders yet."
                                }
                            />
                        </div>
                    ) : (
                        (activeTab === 'active' ? activeOrders : completedOrders).map((order) => (
                            <OrderCard 
                                key={order._id} 
                                order={order} 
                                role="provider" 
                                onUpdateStatus={handleUpdateOrderStatus}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
