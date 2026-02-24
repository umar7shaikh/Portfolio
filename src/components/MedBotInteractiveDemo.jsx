import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypewriterText = ({ text, startDelay = 0, onComplete }) => {
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
        }, 50); // Speed of typing
    };

    return <span>{displayText}</span>;
};

const MedBotInteractiveDemo = () => {
    const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' or 'chat'
    const [chatState, setChatState] = useState("initial"); // 'initial', 'typing', 'sent', 'replying', 'replied'

    // Animation sequence values
    const viewSwitchDelay = 2000; // Switch to chat after 2 seconds

    useEffect(() => {
        // Sequence logic
        const viewTimer = setTimeout(() => {
            setCurrentView("chat");
        }, viewSwitchDelay);

        const typeTimer = setTimeout(() => {
            setChatState("typing");
        }, viewSwitchDelay + 800); // Start typing slightly after view switch

        return () => {
            clearTimeout(viewTimer);
            clearTimeout(typeTimer);
        };
    }, []);

    const handleTypeComplete = () => {
        setTimeout(() => {
            setChatState("sent");
            setTimeout(() => {
                setChatState("replying");
                setTimeout(() => {
                    setChatState("replied");
                }, 1500); // How long MedBot "thinks"
            }, 500); // Time before showing typing indicator
        }, 800); // Pause after typing before sending
    };

    return (
        <div className="relative w-full aspect-video md:aspect-[16/10] lg:aspect-video bg-[#f8f9fa] rounded-lg overflow-hidden border border-[#1a1a1a] font-sans user-select-none shadow-xl">
            {/* Persistent Navbar */}
            <div className="absolute top-0 w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-lg tracking-tight">MedBot</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <span className={`${currentView === 'dashboard' ? 'text-gray-900' : 'text-gray-500'}`}>Dashboard</span>
                    <span className={`${currentView === 'chat' ? 'text-gray-900 border-b-2 border-blue-600 py-4' : 'text-gray-500'} relative`}>
                        AI Chat
                    </span>
                    <span className="text-gray-500">Appointments</span>
                    <span className="text-gray-500">Medications</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="hidden lg:block text-xs">
                            <div className="font-semibold text-gray-800">Test User2</div>
                            <div className="text-gray-500">Patient</div>
                        </div>
                    </div>
                    <button className="text-red-500 text-xs font-medium border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="absolute top-14 bottom-0 w-full overflow-hidden bg-[#f4f7f6]">
                <AnimatePresence mode="wait">
                    {currentView === "dashboard" && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-full p-4 sm:p-8 overflow-y-auto pb-20"
                        >
                            <h1 className="text-3xl text-gray-800 font-bold mb-2">Hi Test User2, take care of your health</h1>
                            <p className="text-gray-500 text-sm mb-8">View your upcoming appointments, medications and talk to MedBot.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8">
                                {/* Stats Cards */}
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Total appointments</div>
                                        <div className="text-2xl font-bold text-gray-800">2</div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-500 rounded-lg shrink-0">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Upcoming</div>
                                        <div className="text-2xl font-bold text-gray-800">0</div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                    <div className="p-3 bg-green-50 text-green-500 rounded-lg shrink-0">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">Active medications</div>
                                        <div className="text-2xl font-bold text-gray-800">1</div>
                                    </div>
                                </div>

                                {/* Call To Action */}
                                <div className="bg-blue-600 p-4 rounded-xl shadow-md text-white flex justify-between items-center cursor-pointer transform hover:scale-[1.02] transition-transform">
                                    <div>
                                        <div className="font-semibold mb-1">Talk to MedBot</div>
                                        <div className="text-blue-100 text-xs">Ask health questions anytime.</div>
                                    </div>
                                    <div className="w-10 h-10 border border-blue-400 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentView === "chat" && (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="h-full w-full flex bg-white"
                        >
                            {/* Sidebar */}
                            <div className="hidden md:flex w-64 border-r border-gray-200 h-full flex-col pt-4 bg-[#fbfcfc] shrink-0">
                                <div className="px-6 pb-2 text-xs font-semibold text-gray-800 uppercase tracking-wider">Conversations</div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="pt-2">
                                        {/* Mock Conversations */}
                                        {[
                                            { title: "I have a mild headache...", date: "2/12/2026, 1:30:58 PM", active: true },
                                            { title: "i have headache I haven't ate...", date: "1/28/2026, 4:44:07 PM" },
                                            { title: "I have high fever and sore throat", date: "12/2/2025, 1:08:38 AM" },
                                            { title: "mujhe sar dard hai", date: "12/1/2025, 12:27:07 AM" },
                                        ].map((conv, i) => (
                                            <div key={i} className={`px-6 py-4 cursor-pointer ${conv.active ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-gray-50'}`}>
                                                <div className={`text-sm font-medium truncate ${conv.active ? 'text-blue-700' : 'text-gray-800'}`}>{conv.title}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">{conv.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 flex flex-col h-full bg-white relative">
                                {/* Chat Header */}
                                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                                    <div>
                                        <h2 className="text-sm font-bold text-gray-800">MedBot assistant</h2>
                                        <p className="text-xs text-gray-400">General health information only. Not a diagnosis.</p>
                                    </div>
                                    <div className="px-3 border text-xs text-gray-500 rounded py-1 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        English
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 pb-8">

                                    {/* New Sent Message container */}
                                    <AnimatePresence>
                                        {(chatState === "sent" || chatState === "replying" || chatState === "replied") && (
                                            <motion.div
                                                key="user-msg"
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="bg-blue-600 text-white p-4 rounded-xl rounded-tr-none max-w-[80%] text-sm self-end shadow-md font-medium"
                                            >
                                                I have a mild headache, what should I do?
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Typing Indicator / Response */}
                                    <AnimatePresence>
                                        {chatState === "replying" && (
                                            <motion.div
                                                key="bot-typing"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                className="bg-gray-50 p-4 rounded-xl rounded-tl-none w-24 text-sm text-gray-700 border border-gray-100 self-start shadow-sm flex items-center justify-center gap-1.5"
                                            >
                                                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                <motion.span animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                            </motion.div>
                                        )}

                                        {chatState === "replied" && (
                                            <motion.div
                                                key="bot-reply"
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="bg-gray-50 p-4 rounded-xl rounded-tl-none w-[85%] text-sm text-gray-700 border border-gray-100 self-start shadow-sm leading-relaxed"
                                            >
                                                <p className="mb-2">For a mild headache, you can try the following:</p>
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Drink plenty of water to stay hydrated.</li>
                                                    <li>Rest in a quiet, dimly lit room.</li>
                                                    <li>Apply a cold or warm compress to your head or neck.</li>
                                                </ul>
                                                <p className="mt-2 text-xs text-gray-500">If symptoms persist, please consult a healthcare professional.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Input Area */}
                                <div className="border-t border-gray-100 py-4 px-6 flex items-center bg-white shrink-0 relative min-h-[80px]">
                                    <div className="flex-1 border text-sm border-gray-200 rounded-lg bg-[#fbfcfc] flex items-center min-h-[48px] py-2 px-4 relative overflow-hidden focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">

                                        {/* Media Icons */}
                                        <div className="flex gap-3 text-gray-400 mr-3 shrink-0">
                                            <svg className="w-5 h-5 hover:text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <svg className="w-5 h-5 hover:text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                        </div>

                                        <div className="text-gray-700 flex-1">
                                            {chatState === "initial" && <span className="text-gray-400 font-light">Type your health question...</span>}
                                            {chatState === "typing" && (
                                                <>
                                                    <TypewriterText
                                                        text="I have a mild headache, what should I do?"
                                                        onComplete={handleTypeComplete}
                                                    />
                                                    <motion.span
                                                        animate={{ opacity: [1, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                                        className="inline-block w-px h-4 bg-gray-500 ml-[1px] align-middle"
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {/* Send Button */}
                                        <button className={`ml-3 w-8 h-8 rounded shrink-0 flex items-center justify-center transition-colors ${chatState === "typing" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-400'}`}>
                                            <svg className="w-4 h-4 ml-[-2px] mt-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MedBotInteractiveDemo;
