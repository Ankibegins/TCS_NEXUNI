import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Mail, User, AlertCircle, PlayCircle, Star, X, CalendarDays, AlertTriangle } from 'lucide-react';
import { TRANSITIONS, GPU_ACCELERATION } from '../../utils/animationSystem';

// ─── Deadline helpers ─────────────────────────────────────────────────────────
/**
 * Derives deadline display data entirely from DB-stored fields.
 * - order.deadline       : Date — stored at order creation, derived from service.pricing.deliveryTime
 * - order.deliveryDays   : Number — stored at order creation (e.g. 3 for "3 Days")
 * - order.daysRemaining  : Number — pre-computed by the API response enrichment
 * - order.isOverdue      : Boolean — pre-computed by the API response enrichment
 *
 * No hardcoded 7-day fallbacks. No client-side arithmetic.
 */
function computeDeadline(order) {
    const orderedOn   = new Date(order.createdAt);
    const dueDate     = order.deadline ? new Date(order.deadline) : null;
    const deliveryDays = order.deliveryDays ?? null;

    // Prefer server-computed values; fall back to client calculation only when
    // the API hasn't enriched the object yet (cache hit from before this deploy)
    let daysRemaining = order.daysRemaining ?? null;
    let isOverdue     = order.isOverdue     ?? false;

    if (daysRemaining === null && dueDate) {
        const msLeft  = new Date(dueDate).setHours(23, 59, 59, 999) - Date.now();
        daysRemaining = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
        isOverdue     = daysRemaining < 0;
    }

    return {
        orderedOn,
        dueDate,
        deliveryDays,
        daysRemaining,
        isOverdue,
        isWarning: !isOverdue && daysRemaining !== null && daysRemaining <= 1,
    };
}

function formatDate(date) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── DeadlineBlock component ──────────────────────────────────────────────────
function DeadlineBlock({ order, isCompleted }) {
    const { orderedOn, dueDate, deliveryDays, daysRemaining, isOverdue, isWarning } = computeDeadline(order);

    // Countdown label + style
    let countdownLabel, countdownColor, CountdownIcon;
    if (isCompleted) {
        countdownLabel  = 'Completed';
        countdownColor  = '#4ade80';
        CountdownIcon   = CheckCircle2;
    } else if (isOverdue) {
        const days       = Math.abs(daysRemaining);
        countdownLabel  = `Overdue by ${days} Day${days !== 1 ? 's' : ''}`;
        countdownColor  = '#f87171';
        CountdownIcon   = AlertTriangle;
    } else if (isWarning) {
        countdownLabel  = daysRemaining === 0 ? 'Due Today!' : '1 Day Remaining';
        countdownColor  = '#fb923c';
        CountdownIcon   = AlertCircle;
    } else {
        countdownLabel  = daysRemaining !== null ? `${daysRemaining} Days Remaining` : '—';
        countdownColor  = '#94a3b8';
        CountdownIcon   = Clock;
    }

    const overdueStyle  = { color: '#f87171' };
    const warningStyle  = { color: '#fb923c' };
    const neutralStyle  = { color: '#64748b' };
    const dueDateColor  = isOverdue ? overdueStyle : isWarning ? warningStyle : {};

    return (
        <div className="mt-1 pt-3 border-t border-white/[0.06] grid grid-cols-1 gap-1.5">
            {/* 📅 Ordered On */}
            <div className="flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="text-[11px] text-slate-500 font-medium w-24 flex-shrink-0">Ordered On</span>
                <span className="text-[11px] text-slate-300 font-semibold">{formatDate(orderedOn)}</span>
            </div>

            {/* 🚀 Delivery Time — from service definition */}
            {deliveryDays !== null && (
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="text-[11px] text-slate-500 font-medium w-24 flex-shrink-0">Delivery Time</span>
                    <span className="text-[11px] text-slate-300 font-semibold">{deliveryDays} Day{deliveryDays !== 1 ? 's' : ''}</span>
                </div>
            )}

            {/* 📌 Due Date */}
            {!isCompleted && dueDate && (
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" style={isOverdue ? overdueStyle : isWarning ? warningStyle : neutralStyle} />
                    <span className="text-[11px] text-slate-500 font-medium w-24 flex-shrink-0">Due Date</span>
                    <span className="text-[11px] font-semibold" style={dueDateColor}>{formatDate(dueDate)}</span>
                </div>
            )}

            {/* ⏳ Remaining / Status */}
            <div className="flex items-center gap-2 mt-0.5">
                <CountdownIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: countdownColor }} />
                <span className="text-[11px] text-slate-500 font-medium w-24 flex-shrink-0">Remaining</span>
                <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                        color: countdownColor,
                        background: isCompleted
                            ? 'rgba(34,197,94,0.08)'
                            : isOverdue   ? 'rgba(248,113,113,0.1)'
                            : isWarning   ? 'rgba(251,146,60,0.1)'
                            : 'rgba(148,163,184,0.08)',
                        border: `1px solid ${
                            isCompleted   ? 'rgba(34,197,94,0.15)'
                            : isOverdue   ? 'rgba(248,113,113,0.2)'
                            : isWarning   ? 'rgba(251,146,60,0.2)'
                            : 'rgba(148,163,184,0.12)'
                        }`,
                    }}
                >
                    {isCompleted ? '✓ Done'
                        : isOverdue  ? `❌ ${countdownLabel}`
                        : isWarning  ? `⚠ ${countdownLabel}`
                        : `⏳ ${countdownLabel}`}
                </span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

const OrderCard = ({ order, role = 'consumer', onUpdateStatus }) => {
    // role: 'consumer' (user bought the service) or 'provider' (user is selling the service)
    const [isLoading, setIsLoading] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    
    // Rating Form State
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const otherParty = role === 'consumer' ? order.sellerId : order.customerId;
    const isCompleted = order.status === 'Completed';
    const isInProgress = order.status === 'In Progress';
    const isTaken = order.status === 'Taken';

    const [currentUser] = useState(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });
    const token = currentUser?.token;

    const handleStatusChange = async (newStatus) => {
        setIsLoading(true);
        try {
            await onUpdateStatus(order._id, newStatus);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteOrder = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://https://tcs-nexuni.onrender.com/api/orders/${order._id}/complete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                // Refresh parent order state
                if (onUpdateStatus) {
                    await onUpdateStatus(order._id, 'Completed');
                }
                // Automatically open rating modal upon completion
                setShowRatingModal(true);
            } else {
                alert(data.message || 'Failed to complete order');
            }
        } catch (err) {
            console.error(err);
            alert('Error completing order');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingReview(true);
        setErrorMsg('');
        try {
            const res = await fetch('http://https://tcs-nexuni.onrender.com/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: order._id,
                    rating,
                    review: feedback
                })
            });
            const data = await res.json();
            if (data.success) {
                setShowRatingModal(false);
                if (onUpdateStatus) {
                    await onUpdateStatus(order._id, 'Reviewed');
                }
            } else {
                setErrorMsg(data.message || 'Failed to submit review');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Error submitting review');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/8 rounded-xl p-5 relative overflow-hidden group">
            {/* Background subtle gradient based on status */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${isCompleted ? 'rgba(34,197,94,0.03)' : isInProgress ? 'rgba(59,130,246,0.03)' : 'rgba(249,115,22,0.03)'} 0%, transparent 100%)`
                }}
            />

            <div className="flex flex-col md:flex-row gap-5 relative z-10">
                {/* Service Details Area */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 text-white font-bold text-lg shadow-inner border"
                            style={{
                                background: isCompleted ? 'rgba(34,197,94,0.1)' : isInProgress ? 'rgba(59,130,246,0.1)' : 'rgba(249,115,22,0.1)',
                                borderColor: isCompleted ? 'rgba(34,197,94,0.2)' : isInProgress ? 'rgba(59,130,246,0.2)' : 'rgba(249,115,22,0.2)',
                                color: isCompleted ? '#4ade80' : isInProgress ? '#60a5fa' : '#fb923c'
                            }}
                        >
                            {order.serviceId?.title?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-white">{order.serviceId?.title || 'Unknown Service'}</h4>
                            <p className="text-sm font-bold text-primary">
                                {order.serviceId?.pricing?.currency === 'USD' ? '$' : '₹'}{order.totalAmount}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase"
                        style={{
                            background: isCompleted ? 'rgba(34,197,94,0.1)' : isInProgress ? 'rgba(59,130,246,0.1)' : 'rgba(249,115,22,0.1)',
                            color: isCompleted ? '#4ade80' : isInProgress ? '#60a5fa' : '#fb923c',
                            border: `1px solid ${isCompleted ? 'rgba(34,197,94,0.2)' : isInProgress ? 'rgba(59,130,246,0.2)' : 'rgba(249,115,22,0.2)'}`
                        }}>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isInProgress && <PlayCircle className="w-3.5 h-3.5" />}
                        {isTaken && <Clock className="w-3.5 h-3.5" />}
                        {order.status}
                    </div>

                    {/* Date / Deadline Information */}
                    <DeadlineBlock order={order} isCompleted={isCompleted} />
                </div>

                {/* Contact Info Area */}
                <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-lg p-4 flex flex-col justify-center">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {role === 'consumer' ? 'Provider Details' : 'Consumer Details'}
                    </h5>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <User className="w-4 h-4 text-slate-500" />
                            {otherParty?.name || 'Unknown User'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Mail className="w-4 h-4 text-slate-500" />
                            {otherParty?.email || 'No email provided'}
                        </div>
                    </div>
                </div>

                {/* Action Buttons for Consumer (Mark as Completed) */}
                {role === 'consumer' && !isCompleted && (
                    <div className="flex flex-col gap-2 justify-center ml-auto">
                        <button
                            onClick={handleCompleteOrder}
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-sm font-bold transition-colors shadow-lg"
                        >
                            Mark Completed
                        </button>
                    </div>
                )}

                {/* Action Buttons for Provider */}
                {role === 'provider' && !isCompleted && (
                    <div className="flex flex-col gap-2 justify-center ml-auto">
                        {isTaken && (
                            <button
                                onClick={() => handleStatusChange('In Progress')}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-bold transition-colors"
                            >
                                Mark In Progress
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Display Given Review on Completed Cards */}
            {isCompleted && order.review && (
                <div className="mt-4 pt-4 border-t border-white/8 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Feedback Given:</span>
                            <div className="flex text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                            i < order.review.rating
                                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]'
                                                : 'text-slate-700'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-amber-400 font-bold">({order.review.rating}/5)</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">
                            Completed on {new Date(order.completedAt || order.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                    {order.review.review && (
                        <p className="text-sm text-slate-300 italic pl-2 border-l border-primary/20 bg-white/[0.01] py-1 rounded">
                            "{order.review.review}"
                        </p>
                    )}
                </div>
            )}

            {/* UX Fallback: If Completed but not yet reviewed, let them write a review */}
            {role === 'consumer' && isCompleted && !order.review && (
                <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">You haven't reviewed this service yet.</p>
                    <button
                        onClick={() => setShowRatingModal(true)}
                        className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold transition-colors"
                    >
                        Write Review
                    </button>
                </div>
            )}

            {/* Interactive Star Rating Modal */}
            <AnimatePresence>
                {showRatingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRatingModal(false)}
                            className="absolute inset-0 bg-brand-bg/85 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 15 }}
                            transition={TRANSITIONS.modal}
                            className="bg-brand-sidebar/95 border border-primary/30 rounded-2xl p-6 shadow-2xl w-full max-w-md relative z-10 overflow-hidden text-left"
                            style={{
                                background: 'linear-gradient(135deg, rgba(30,41,59,0.98) 0%, rgba(15,23,42,0.99) 100%)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.15)',
                                ...GPU_ACCELERATION
                            }}
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Rate your experience</h3>
                                    <p className="text-xs text-slate-400 font-medium">How was the service provided by {otherParty?.name}?</p>
                                </div>
                                <button
                                    onClick={() => setShowRatingModal(false)}
                                    className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {errorMsg && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-3.5 py-2 rounded-lg text-xs font-semibold mb-4 text-center">
                                    {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleReviewSubmit} className="space-y-5">
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                                            >
                                                <Star
                                                    className={`w-8 h-8 transition-colors duration-150 ${
                                                        star <= (hoveredStar || rating)
                                                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                                            : 'text-slate-600'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        {rating === 5 && 'Outstanding! 🌟'}
                                        {rating === 4 && 'Very Good! 👍'}
                                        {rating === 3 && 'Good / Average'}
                                        {rating === 2 && 'Below Average'}
                                        {rating === 1 && 'Poor / Dissatisfied'}
                                        {rating === 0 && 'Select a rating'}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optional Review & Feedback</label>
                                    <textarea
                                        rows={3}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Share details of your experience with this seller..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowRatingModal(false)}
                                        className="px-4 py-2 border border-white/10 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={rating === 0 || isSubmittingReview}
                                        className={`px-5 py-2 bg-gradient-to-r from-primary to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.35)] rounded-lg text-sm font-bold text-white transition-opacity cursor-pointer ${
                                            rating === 0 || isSubmittingReview ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                                        }`}
                                    >
                                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderCard;
