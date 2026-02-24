import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = ({ onLoadingComplete }) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate asset loading progression
        const duration = 2000; // Minimum 2s splash screen
        const intervalTime = 50;
        const steps = duration / intervalTime;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const rawProgress = (currentStep / steps) * 100;
            // Add slight ease-out math for a more natural feel
            const easedProgress = rawProgress + (100 - rawProgress) * 0.05;

            setProgress(Math.min(100, easedProgress));

            if (currentStep >= steps) {
                clearInterval(interval);
                setTimeout(() => {
                    setLoading(false);
                    setTimeout(() => {
                        if (onLoadingComplete) onLoadingComplete();
                    }, 800); // Wait for exit animation
                }, 300); // Brief pause at 100%
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="global-preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: "-10vh" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
                >
                    <div className="flex flex-col items-center">
                        {/* Logo Sequence */}
                        <div className="overflow-hidden mb-8">
                            <motion.h1
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-4xl md:text-6xl font-black tracking-tighter text-white font-inter"
                            >
                                UMAR.
                            </motion.h1>
                        </div>

                        {/* Loading Bar Container */}
                        <div className="w-48 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-white rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </div>

                        {/* Percentage Text */}
                        <div className="mt-4 overflow-hidden h-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-[#666] text-xs font-mono tracking-widest"
                            >
                                LOADING {Math.round(progress)}%
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
