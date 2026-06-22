import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { motion } from 'framer-motion';

// Lazy load page routes to optimize bundle size and speed indexes
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

import DashboardLayout from "./layouts/DashboardLayout";

// Premium glassmorphic fallback component for suspense boundaries
function PageLoading() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(249,115,22,0.6)]"
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading NEXUNI…</p>
    </div>
  );
}

function ProtectedRoute() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function PublicRoute() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public-only Route (redirection if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Public / Landing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />

          {/* Protected Dashboard Layout Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}