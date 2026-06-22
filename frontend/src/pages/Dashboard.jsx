import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import MyFreelanceService from './MyFreelanceService';
import Services from './Services';
import MarketplaceView from '../components/dashboard/MarketplaceView';
import { TRANSITIONS, GPU_ACCELERATION } from '../utils/animationSystem';

const TABS = [
    { id: 'freelance' },
    { id: 'take' },
    { id: 'marketplace' },
];

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'freelance';
    const tabOrder = TABS.map(t => t.id);

    // Track tab direction for sliding animations
    const lastTabRef = useRef(activeTab);
    const prevTab = lastTabRef.current;
    
    // Update tab memory on render
    if (lastTabRef.current !== activeTab) {
        lastTabRef.current = activeTab;
    }

    const direction = prevTab 
        ? (tabOrder.indexOf(activeTab) > tabOrder.indexOf(prevTab) ? 1 : -1) 
        : 1;

    return (
        <div className="flex-1 flex flex-col relative overflow-hidden bg-brand-bg">
            {/* Scrollable Content Area */}
            <div id="dashboard-scroll-container" className="flex-1 overflow-y-auto pt-6">
                <div className="px-8 pb-12 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait" custom={direction}>
                        {activeTab === 'freelance' && (
                            <motion.div
                                key="freelance"
                                custom={direction}
                                initial={{ opacity: 0, x: direction * 24, filter: 'blur(3px)' }}
                                animate={{ opacity: 1, x: 0,              filter: 'blur(0px)' }}
                                exit={{   opacity: 0, x: direction * -24, filter: 'blur(3px)' }}
                                transition={TRANSITIONS.page}
                                style={GPU_ACCELERATION}
                            >
                                <MyFreelanceService />
                            </motion.div>
                        )}
                        {activeTab === 'take' && (
                            <motion.div
                                key="take"
                                custom={direction}
                                initial={{ opacity: 0, x: direction * 24, filter: 'blur(3px)' }}
                                animate={{ opacity: 1, x: 0,              filter: 'blur(0px)' }}
                                exit={{   opacity: 0, x: direction * -24, filter: 'blur(3px)' }}
                                transition={TRANSITIONS.page}
                                style={GPU_ACCELERATION}
                            >
                                <Services />
                            </motion.div>
                        )}
                        {activeTab === 'marketplace' && (
                            <motion.div
                                key="marketplace"
                                custom={direction}
                                initial={{ opacity: 0, x: direction * 24, filter: 'blur(3px)' }}
                                animate={{ opacity: 1, x: 0,              filter: 'blur(0px)' }}
                                exit={{   opacity: 0, x: direction * -24, filter: 'blur(3px)' }}
                                transition={TRANSITIONS.page}
                                style={GPU_ACCELERATION}
                            >
                                <MarketplaceView />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
