// src/components/Hero.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

const SCRIPT_LINES = [
  { prompt: "muhammed@void", command: "git clone medbot && cd medbot" },
  { prompt: "muhammed@void", command: "pnpm dev --env=healthcare-ai" },
  { prompt: "muhammed@void", command: "pnpm dev --env=fintech-tools" },
  { prompt: "muhammed@void", command: "yarn dev --portfolio" },
];

const Hero = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [history, setHistory] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) return;

    const { command } = SCRIPT_LINES[lineIndex];
    setTyped("");

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(command.slice(0, i));

      if (i >= command.length) {
        clearInterval(interval);

        setTimeout(() => {
          setHistory((prev) => {
            const next = [...prev, SCRIPT_LINES[lineIndex]];
            return next.slice(-4);
          });

          if (lineIndex === SCRIPT_LINES.length - 1) {
            setIsDone(true);
          } else {
            setLineIndex((prev) => prev + 1);
          }
        }, 650);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [lineIndex, isDone]);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Tiny scroll parallax for glow (optional)
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const handleResumeDownload = () => {
    window.open("/resume-muhammed-umar.pdf", "_blank");
  };

  const handleViewProjects = () => {
    const el = document.getElementById("works");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center rounded-[0.9rem] border-4 border-white bg-black px-4 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* ANIMATED RADIAL GLOW */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ y: glowY }}
        animate={{ x: ["-15%", "15%", "-15%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.10),_transparent_60%)]" />
      </motion.div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20 flex max-w-4xl flex-col gap-8 md:flex-row md:items-center">
        {/* LEFT */}
        <div className="flex-1 space-y-4">
          <motion.p
            className="text-xl md:text-3xl uppercase tracking-[0.3em] text-white/85 font-bold drop-shadow-xl bg-gradient-to-r from-white/90 via-white to-white/90 bg-clip-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            full-stack engineer
          </motion.p>

          <motion.h1
            className="font-inter text-white"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Muhammed Umar
          </motion.h1>

          {/* CTAS */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <motion.button
              onClick={handleResumeDownload}
              className="rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm hover:border-white/40 hover:text-white transition-all duration-300 flex items-center gap-2 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View Resume</span>
              <svg
                className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10l-5.5 5.5m0 0L12 21l5.5-5.5m-5.5 5.5V3"
                />
              </svg>
            </motion.button>

            <motion.button
              onClick={handleViewProjects}
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:border-white/40 bg-transparent backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View Projects</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M13 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </motion.div>

          <motion.p
            className="max-w-md text-sm md:text-base text-white/80 font-medium tracking-wide drop-shadow-md"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            Building React/Node apps for AI‑driven products in healthcare,
            fintech, and real estate — with pixel‑perfect UIs and rock‑solid
            APIs.
          </motion.p>
        </div>

        {/* TERMINAL */}
        <motion.div
          className="relative z-30 mt-6 w-full max-w-md rounded-xl border border-white/10 bg-black/85 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-sm"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-[10px] text-white/40">terminal • portfolio</span>
          </div>

          <div className="space-y-1 px-5 py-3 font-mono text-xs md:text-sm text-emerald-300/90">
            <AnimatePresence initial={false}>
              {history.map((line, idx) => (
                <motion.div
                  key={`history-${line.command}-${idx}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="flex"
                >
                  <span className="mr-2 text-emerald-500">{line.prompt}&gt;</span>
                  <span>{line.command}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {!isDone && (
              <div className="flex">
                <span className="mr-2 text-emerald-500">
                  {SCRIPT_LINES[lineIndex].prompt}&gt;
                </span>
                <span>{typed}</span>
                <span className="ml-0.5 inline-block h-4 w-[1px] animate-pulse bg-emerald-300" />
              </div>
            )}
          </div>

          <div className="border-t border-white/5 px-4 py-2 text-[10px] text-white/40 flex justify-between">
            <span>~/projects/portfolio</span>
            <span>{isDone ? "ready when you are" : "typing…"}</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
