import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

const SCRIPT_LINES = [
  { prompt: "muhammed@void", command: "git clone medbot && cd medbot" },
  { prompt: "muhammed@void", command: "pnpm dev --env=healthcare-ai" },
  { prompt: "muhammed@void", command: "pnpm dev --env=fintech-tools" },
  { prompt: "muhammed@void", command: "yarn dev --portfolio" },
];

// Scramble text effect
const ScrambleText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(true);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

// Floating particles
const Particles = () => {
  const symbols = ["{ }", "< />", "[ ]", "=>", "fn", "&&", "||"];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/5 font-mono text-sm"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {symbols[Math.floor(Math.random() * symbols.length)]}
        </motion.div>
      ))}
    </div>
  );
};

// Animated grid background (no dots)
const GridBackground = ({ mouseX, mouseY }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mouse-glow">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.circle
          cx={mouseX}
          cy={mouseY}
          r="150"
          fill="url(#mouse-glow)"
          style={{ pointerEvents: "none" }}
        />
      </svg>
    </div>
  );
};

// Magnetic button component with enhanced effects
const MagneticButton = ({ children, onClick, variant = "primary" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = "rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 flex items-center gap-2.5 group relative overflow-hidden";
  const variantClasses = variant === "primary"
    ? "border-2 border-white/30 bg-white text-black hover:bg-white/95 backdrop-blur-sm hover:border-white shadow-lg hover:shadow-white/20"
    : "border-2 border-white/20 text-white hover:text-white hover:border-white/60 bg-white/5 hover:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-white/10";

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${variantClasses}`}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
      {variant === "secondary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </motion.button>
  );
};

const Hero = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [history, setHistory] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Terminal typing effect
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

  const terminalRef = useRef(null);

  // 3D tilt effect for terminal
  const [terminalRotate, setTerminalRotate] = useState({ x: 0, y: 0 });
  
  const handleTerminalMouseMove = (e) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = (e.clientX - rect.left - rect.width / 2) / 20;
    setTerminalRotate({ x, y });
  };

  const handleTerminalMouseLeave = () => {
    setTerminalRotate({ x: 0, y: 0 });
  };

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
      className="relative flex min-h-screen items-center justify-center rounded-[0.9rem] border-4 border-white bg-black px-4 overflow-hidden"
    >
      {/* Grid Background */}
      <GridBackground mouseX={mousePosition.x} mouseY={mousePosition.y} />
      
      {/* Particles */}
      <Particles />

      {/* Animated Radial Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        animate={{ x: ["-15%", "15%", "-15%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.10),_transparent_60%)]" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center w-full">
        {/* Left Side */}
        <div className="flex-1 space-y-6">
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-300">
              Available for Projects
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-xs text-white/60">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl uppercase tracking-[0.3em] text-white/85 font-bold"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            full-stack engineer
          </motion.p>

          <motion.h1
            className="font-inter text-white"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ScrambleText text="Muhammed Umar" />
          </motion.h1>

          <motion.p
            className="max-w-lg text-base md:text-lg text-white/80 font-medium tracking-wide leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Building{" "}
            <span className="text-white font-semibold">React/Node</span> apps
            for AI‑driven products in{" "}
            <span className="text-emerald-400">healthcare</span>,{" "}
            <span className="text-blue-400">fintech</span>, and{" "}
            <span className="text-purple-400">real estate</span> — with
            pixel‑perfect UIs and rock‑solid APIs.
          </motion.p>

          {/* Tech Stack Pills */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"].map((tech, i) => (
              <motion.span
                key={tech}
                className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/70 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-3 pt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <MagneticButton onClick={handleResumeDownload} variant="primary">
              View Resume
              <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </MagneticButton>

            <MagneticButton onClick={handleViewProjects} variant="secondary">
              View Projects
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Terminal */}
        <motion.div
          ref={terminalRef}
          className="relative z-30 w-full max-w-md"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          onMouseMove={handleTerminalMouseMove}
          onMouseLeave={handleTerminalMouseLeave}
          style={{
            transformStyle: "preserve-3d",
            transform: `perspective(1000px) rotateX(${terminalRotate.x}deg) rotateY(${terminalRotate.y}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <motion.div
            className="rounded-xl border border-white/10 bg-black/90 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-hidden"
            whileHover={{ boxShadow: "0 0 80px rgba(16, 185, 129, 0.15)" }}
          >
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 bg-white/5">
              <div className="flex items-center gap-2">
                <motion.span 
                  className="h-3 w-3 rounded-full bg-red-500/80"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.span 
                  className="h-3 w-3 rounded-full bg-yellow-400/80"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.span 
                  className="h-3 w-3 rounded-full bg-emerald-400/80"
                  whileHover={{ scale: 1.2 }}
                />
              </div>
              <span className="text-xs text-white/40 font-mono">terminal • portfolio</span>
            </div>

            <div className="space-y-1 px-5 py-4 font-mono text-xs md:text-sm text-emerald-300/90 min-h-[180px]">
              <AnimatePresence initial={false}>
                {history.map((line, idx) => (
                  <motion.div
                    key={`history-${line.command}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    <span className="mr-2 text-emerald-500 font-bold">{line.prompt}&gt;</span>
                    <span className="text-white/90">{line.command}</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!isDone && (
                <motion.div 
                  className="flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="mr-2 text-emerald-500 font-bold">
                    {SCRIPT_LINES[lineIndex].prompt}&gt;
                  </span>
                  <span className="text-white/90">{typed}</span>
                  <motion.span
                    className="ml-0.5 inline-block h-4 w-[2px] bg-emerald-400"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </div>

            <div className="border-t border-white/5 px-4 py-2 text-xs text-white/40 flex justify-between bg-white/5 font-mono">
              <span>~/projects/portfolio</span>
              <motion.span
                animate={{ opacity: isDone ? 1 : [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: isDone ? 0 : Infinity }}
              >
                {isDone ? "✓ ready" : "typing..."}
              </motion.span>
            </div>
          </motion.div>

          {/* Terminal glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 blur-3xl -z-10 opacity-50" />
        </motion.div>
      </div>

      {/* Epic Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="relative flex flex-col items-center gap-3 cursor-pointer group"
          onClick={handleViewProjects}
          whileHover={{ scale: 1.1 }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute w-20 h-20 rounded-full border-2 border-white/20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute w-20 h-20 rounded-full border-2 border-white/20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.4,
            }}
          />

          {/* Center circle with icon */}
          <motion.div
            className="relative w-16 h-16 rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:border-white/60 group-hover:bg-white/10 transition-all"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Rotating gradient background */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.3), transparent)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Arrow icon */}
            <motion.svg
              className="w-6 h-6 text-white/70 group-hover:text-white relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                y: [0, 4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-400/0 group-hover:bg-emerald-400/20 blur-xl transition-all"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* Text */}
          <motion.span
            className="text-xs font-medium tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors absolute -bottom-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            EXPLORE
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;