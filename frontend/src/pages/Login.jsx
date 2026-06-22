import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Github,
    User,
    Briefcase
} from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);
    const navigate = useNavigate();

    // Data State Form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Reset error visual on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const url = isLoginView
                ? 'http://localhost:5000/api/auth/login'
                : 'http://localhost:5000/api/auth/register';

            // If logging in, we only send email and password. If registering, we send all data.
            const payload = isLoginView 
                ? { email: formData.email, password: formData.password }
                : formData;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Authentication Failed');
            }

            // Securely save the successful session payload
            localStorage.setItem('user', JSON.stringify(data));
            
            // Navigate cleanly to the dashboard upon success!
            navigate('/dashboard'); 

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 font-display">
            {/* Main Card Container */}
            <div className="w-full max-w-5xl h-[700px] flex rounded-xl overflow-hidden shadow-2xl border-2 border-primary/50">

                {/* Left Side (Branding & Image) */}
                <div className="w-1/2 bg-brand-sidebar p-12 flex flex-col items-center justify-center relative border-r border-dashed border-primary/20">
                    <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
                        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg border border-primary/20">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                alt="Students Collaborating"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-[32px] font-black text-white leading-tight">Connect to NEXUNI</h2>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
                            The ultimate platform for university collaboration and academic growth.
                        </p>
                    </div>
                </div>

                {/* Right Side (Form) */}
                <div className="w-1/2 bg-brand-card p-12 flex flex-col relative">

                    {/* Logo (Now part of normal flow to prevent overlapping) */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-wide">NEXUNI</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="max-w-sm w-full mx-auto space-y-7">
                            {/* Tabs */}
                            <div className="flex border-b border-primary/20">
                                <button 
                                    onClick={() => { setIsLoginView(true); setError(''); }}
                                    className={`flex-1 pb-3 font-bold text-sm transition-colors ${isLoginView ? 'border-b-2 border-primary text-primary' : 'text-slate-300 hover:text-white'}`}>
                                    Login
                                </button>
                                <button 
                                    onClick={() => { setIsLoginView(false); setError(''); }}
                                    className={`flex-1 pb-3 font-bold text-sm transition-colors ${!isLoginView ? 'border-b-2 border-primary text-primary' : 'text-slate-300 hover:text-white'}`}>
                                    Sign Up
                                </button>
                            </div>

                            {/* Error Message UI */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/40 text-red-100 px-4 py-2.5 rounded-md text-xs font-bold flex items-center justify-center">
                                    {error}
                                </div>
                            )}

                            {/* Form Fields */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLoginView && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-200">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required={!isLoginView}
                                                placeholder="John Doe"
                                                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-medium placeholder:text-slate-500 border border-primary/20"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-200">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="name@university.edu"
                                            className="w-full pl-10 pr-4 py-2.5 bg-brand-bg text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-medium placeholder:text-slate-500 border border-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-200">Password</label>
                                        {isLoginView && (
                                            <a href="#" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">Forgot password?</a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your password"
                                            className="w-full pl-10 pr-10 py-2.5 bg-brand-bg text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-medium placeholder:text-slate-500 border border-primary/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {isLoginView && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="keepLogged"
                                            className="w-3.5 h-3.5 rounded-sm border-primary/30 bg-transparent text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="keepLogged" className="text-xs font-medium text-slate-300 cursor-pointer">
                                            Keep me logged in
                                        </label>
                                    </div>
                                )}

                                {/* Sign In / Sign Up Button */}
                                <div className="mt-4 w-full">
                                    <PremiumButton
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                        variant="primary"
                                    >
                                        {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
                                    </PremiumButton>
                                </div>
                            </form>

                            {/* Footer Text */}
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                    {isLoginView ? 'By continuing, you agree to NEXUNI\'s ' : 'By creating an account, you agree to NEXUNI\'s '}
                                    <a href="#" className="text-slate-300 hover:text-white">Terms of Service</a><br />
                                    and <a href="#" className="text-slate-300 hover:text-white">Privacy Policy</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
