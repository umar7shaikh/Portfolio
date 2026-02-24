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
                    key="brutalist-preloader"
                    initial={{ opacity: 1 }}
                    exit={{ y: "-100vh" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[9999] flex flex-col justify-end p-8 bg-black text-white"
                >
                    <div className="flex justify-between items-end w-full overflow-hidden">
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                fontSize: "clamp(48px, 15vw, 200px)",
                                fontWeight: "900",
                                lineHeight: "0.8",
                                letterSpacing: "-0.05em",
                                fontFamily: "'Inter', sans-serif",
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            UMAR.
                        </motion.h1>

                        <div style={{
                            fontSize: "clamp(24px, 5vw, 64px)",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: "800",
                            lineHeight: "0.8",
                            letterSpacing: "-0.02em",
                        }}>
                            {(progress).toFixed(3)}%
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
