import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-brand-bg text-slate-100 font-display">
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <Outlet />
            </main>
        </div>
    );
}
