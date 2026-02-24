import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypewriterText = ({ text, startDelay = 0, onComplete, speed = 40 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let timeoutId;
        let currentIndex = 0;

        const startTyping = () => {
            const typeNextChar = () => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.substring(0, currentIndex + 1));
                    currentIndex++;
                    timeoutId = setTimeout(typeNextChar, speed + (Math.random() * 20 - 10)); // Add slight randomness
                } else {
                    setIsComplete(true);
                    if (onComplete) onComplete();
                }
            };
            typeNextChar();
        };

        const initialDelay = setTimeout(startTyping, startDelay);

        return () => {
            clearTimeout(initialDelay);
            clearTimeout(timeoutId);
        };
    }, [text, startDelay, speed, onComplete]);

    return (
        <span>
            {displayedText}
            {!isComplete && <span className="inline-block w-2 bg-green-500 h-[1.1em] ml-1 align-middle animate-pulse"></span>}
        </span>
    );
};

const DevStackCLIDemo = () => {
    const [phase, setPhase] = useState(1); // 1: typing, 2: processing/installing, 3: success

    useEffect(() => {
        // Timing for phases based on realistic CLI expectations
        const timer1 = setTimeout(() => setPhase(2), 2500); // 2.5s for command typing
        const timer2 = setTimeout(() => setPhase(3), 5500); // 3s for scaffolding/installing
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    return (
        <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-video bg-zinc-950 rounded-xl overflow-hidden font-mono select-none shadow-2xl border border-zinc-800 min-h-[400px]">
            {/* Terminal Title Bar */}
            <div className="flex items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 text-center text-xs font-medium text-zinc-500 font-sans">
                    devstack — bash — 80x24
                </div>
            </div>

            {/* Terminal Content Area */}
            <div className="absolute top-12 bottom-0 w-full p-4 sm:p-6 overflow-y-auto no-scrollbar z-10 text-sm sm:text-base leading-relaxed text-zinc-300">

                {/* Phase 1 & Persistent Command Entry */}
                <div className="mb-2">
                    <span className="text-blue-400 font-bold">~/projects</span> <span className="text-zinc-500">$</span>{' '}
                    {phase === 1 ? (
                        <TypewriterText text="devstack create react-app my-new-app" startDelay={500} speed={40} />
                    ) : (
                        <span className="text-green-400">devstack create react-app my-new-app</span>
                    )}
                </div>

                {/* Phase 2: Processing and Logging */}
                <AnimatePresence>
                    {phase >= 2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col gap-1 mb-4"
                        >
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-cyan-400 font-semibold mb-2">
                                [DevStack] Scaffolding React App in ./my-new-app...
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex gap-2">
                                <span className="text-green-500">✔</span> Created package.json
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex gap-2">
                                <span className="text-green-500">✔</span> Configured Vite + Tailwind CSS
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="flex gap-2">
                                <span className="text-green-500">✔</span> Generated boilerplate files
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }} className="flex gap-2">
                                <span className="text-green-500">✔</span> Initialized git repository
                            </motion.div>

                            {phase === 2 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-yellow-400 mt-2 flex items-center gap-2">
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></span>
                                    Installing dependencies (npm install)...
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Phase 3: Success Output */}
                <AnimatePresence>
                    {phase === 3 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2"
                        >
                            <div className="flex gap-2 text-green-400 font-bold mb-4">
                                ✔ Success! Project created in 2.3s
                            </div>

                            <div className="text-zinc-400 mb-2">Inside that directory, you can run several commands:</div>

                            <div className="pl-4 mb-4 border-l-2 border-zinc-800 space-y-2">
                                <div className="text-cyan-300">npm run dev</div>
                                <div className="text-zinc-500 text-sm pl-4">Starts the development server.</div>
                                <div className="text-cyan-300">npm run build</div>
                                <div className="text-zinc-500 text-sm pl-4">Bundles the app into static files for production.</div>
                            </div>

                            <div className="text-zinc-400">To get started:</div>
                            <div className="pl-4 mt-1 text-zinc-300">
                                <div className="text-green-300">cd <span className="text-zinc-300">my-new-app</span></div>
                                <div className="text-green-300">npm run dev</div>
                            </div>

                            <div className="mt-6 flex items-center gap-2">
                                <span className="text-blue-400 font-bold">~/projects</span> <span className="text-zinc-500">$</span>
                                <span className="inline-block w-2 bg-zinc-500 h-[1.1em] animate-pulse"></span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DevStackCLIDemo;
