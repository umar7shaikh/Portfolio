import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypewriterText = ({ text, startDelay = 0, onComplete, speed = 40 }) => {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let timeout;
        if (startDelay) {
            timeout = setTimeout(() => {
                startTyping();
            }, startDelay);
        } else {
            startTyping();
        }

        return () => clearTimeout(timeout);
    }, [startDelay]);

    const startTyping = () => {
        let i = 0;
        const typingInterval = setInterval(() => {
            setDisplayText(text.substring(0, i + 1));
            i++;
            if (i === text.length) {
                clearInterval(typingInterval);
                if (onComplete) onComplete();
            }
        }, speed);
    };

    return <span>{displayText}</span>;
};

const FinancialAnalyzerDemo = () => {
    // Current phase: 1 (Dashboard), 2 (Scanning), 3 (Results)
    const [phase, setPhase] = useState(1);
    const [typewriterComplete, setTypewriterComplete] = useState(false);

    useEffect(() => {
        // Phase 1 -> Phase 2 (at 2s)
        const timer1 = setTimeout(() => {
            setPhase(2);
        }, 2500);

        // Phase 2 -> Phase 3 (at 4.5s)
        const timer2 = setTimeout(() => {
            setPhase(3);
        }, 5500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const handleTypeComplete = () => {
        setTypewriterComplete(true);
    };

    return (
        <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-video bg-[#0B0F19] rounded-xl overflow-hidden font-sans select-none shadow-2xl border border-blue-900/30 min-h-[400px]">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <div className="absolute top-0 w-full h-14 bg-[#111827]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span className="font-bold text-white tracking-wide">FinAnalyzer AI</span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <span className={`${phase === 1 ? 'text-blue-400 relative after:absolute after:bottom-[-16px] after:left-0 after:w-full after:h-[2px] after:bg-blue-400' : 'text-gray-400'}`}>Overview</span>
                    <span className={`${phase === 2 || phase === 3 ? 'text-purple-400 relative after:absolute after:bottom-[-16px] after:left-0 after:w-full after:h-[2px] after:bg-purple-400' : 'text-gray-400'} transition-colors duration-500`}>AI Analysis</span>
                    <span className="text-gray-400">Portfolios</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="absolute top-14 bottom-0 w-full p-4 sm:p-8 overflow-y-auto no-scrollbar z-10">
                <AnimatePresence mode="wait">
                    {/* Phase 1: Dashboard */}
                    {phase === 1 && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                            transition={{ duration: 0.4 }}
                            className="h-full flex flex-col"
                        >
                            <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">Market Overview</h1>
                            <p className="text-blue-200/60 text-sm mb-6 sm:mb-8">Real-time portfolio metrics and AI agent status.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                {/* Stat Card 1 */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-xl">
                                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Portfolio Health</div>
                                    <div className="text-2xl font-bold text-white mb-1">Excellent</div>
                                    <div className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                        +12.4% YTD
                                    </div>
                                </div>
                                {/* Stat Card 2 */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-xl">
                                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Active AI Agents</div>
                                    <div className="text-2xl font-bold text-white mb-1">4</div>
                                    <div className="text-blue-400 text-xs font-medium">Monitoring Markets</div>
                                </div>
                                {/* Stat Card 3 */}
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-xl">
                                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Processed Docs</div>
                                    <div className="text-2xl font-bold text-white mb-1">1,248</div>
                                    <div className="text-purple-400 text-xs font-medium">Last 30 days</div>
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex flex-col justify-end relative overflow-hidden min-h-[160px]">
                                <div className="absolute top-5 left-5 text-gray-400 text-sm font-medium">Performance Trend</div>
                                <div className="flex items-end justify-between h-32 w-full gap-2 opacity-80 pl-2">
                                    {[40, 55, 45, 60, 50, 70, 65, 80, 75, 95].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                            className="w-full bg-gradient-to-t from-blue-900/40 to-blue-500/80 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Phase 2: Scanning */}
                    {phase === 2 && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, filter: "blur(4px)" }}
                            transition={{ duration: 0.5 }}
                            className="h-full flex flex-col items-center justify-center"
                        >
                            <div className="relative w-48 h-64 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl flex flex-col items-center justify-center p-6 mb-8">
                                <svg className="w-16 h-16 text-blue-400/80 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="text-white font-medium text-sm text-center">Q4 Earnings Report.pdf</div>
                                <div className="text-gray-500 text-xs mt-1">12.4 MB</div>

                                {/* Deep Purple Scanning Line */}
                                <motion.div
                                    initial={{ top: "0%" }}
                                    animate={{ top: "100%" }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear", repeatType: "reverse" }}
                                    className="absolute left-0 w-full h-[3px] bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10"
                                />
                            </div>

                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="flex items-center gap-3 text-purple-300 font-medium tracking-wide"
                            >
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                CrewAI Multi-Agents analyzing market data...
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Phase 3: Results */}
                    {phase === 3 && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="h-full flex flex-col"
                        >
                            <div className="flex items-center gap-3 mb-4 sm:mb-8 border-b border-white/10 pb-4 sm:pb-6 shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Analysis Complete</h2>
                                    <p className="text-gray-400 text-sm">Q4 Earnings Report processed successfully.</p>
                                </div>
                            </div>

                            <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-8 relative flex flex-col min-h-0">
                                <div className="absolute top-4 right-4 text-[10px] sm:text-xs font-semibold px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 hidden sm:block">
                                    AI Insight
                                </div>
                                <h3 className="text-base sm:text-lg text-blue-300 font-medium mb-2 sm:mb-4 flex items-center gap-2 shrink-0">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Agent Recommendation
                                </h3>

                                <div className="flex-1 overflow-y-auto no-scrollbar text-gray-200 text-sm sm:text-base leading-relaxed font-mono bg-slate-900/50 p-4 sm:p-6 rounded-lg border border-slate-700/50 shadow-inner">
                                    <TypewriterText
                                        text="Analysis complete. Recommendation: STRONG BUY. Key Drivers: 25% YoY growth, expanded margins, and high EMEA market penetration."
                                        startDelay={500}
                                        speed={30}
                                        onComplete={handleTypeComplete}
                                    />
                                    {!typewriterComplete && (
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="inline-block w-2.5 h-5 bg-purple-400 ml-1 align-middle"
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FinancialAnalyzerDemo;
