import React from 'react';

export default function RecentMessages() {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-wide">Recent Messages</h2>
                <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">View inbox</a>
            </div>
            <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=transparent" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-slate-900 font-bold text-xs">Sarah Jenkins</h4>
                            <p className="text-slate-500 text-[10px] font-medium truncate max-w-[200px]">I've uploaded the latest revisions for the landing page...</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] font-medium text-slate-400">14:20</span>
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=David&backgroundColor=transparent" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-slate-900 font-bold text-xs">David Miller (Seller)</h4>
                            <p className="text-slate-400 text-[10px] font-medium truncate max-w-[200px]">Is the monitor stand still available for pickup today?</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] font-medium text-slate-400">Yesterday</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
