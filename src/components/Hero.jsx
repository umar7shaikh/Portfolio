import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

// Scramble text reveal
const ScrambleText = ({ text, delay = 0 }) => {
  const [display, setDisplay] = useState(() =>
    text.split("").map(() => "_").join("")
  );
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    let iteration = 0;
    let timeout;

    const start = () => {
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) return text[index];
              if (char === " ") return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        iteration += 1 / 3;
        if (iteration >= text.length) clearInterval(interval);
      }, 28);
    };

    timeout = setTimeout(start, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [text, delay]);

  return <>{display}</>;
};

const Hero = () => {
  const handleResumeDownload = () => {
    window.open("/resume-muhammed-umar.pdf", "_blank");
  };

  const handleViewProjects = () => {
    const el = document.getElementById("works");
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section
      id="home"
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Redundant topbar removed to allow global Navbar to shine */}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 64px",
          position: "relative",
        }}
        className="hero-main"
      >
        {/* Index label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#2a2a2a",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "36px",
          }}
        >
          Portfolio — 2025
        </motion.p>

        {/* Big name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          style={{
            fontSize: "clamp(42px, 11vw, 152px)",
            fontWeight: "700",
            color: "#f0f0f0",
            lineHeight: "0.92",
            letterSpacing: "-0.04em",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "48px",
          }}
        >
          <ScrambleText text="MUHAMMED" delay={400} />
          <br />
          <span style={{ color: "#2a2a2a" }}>
            <ScrambleText text="UMAR" delay={700} />
          </span>
        </motion.h1>

        {/* Descriptor row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "64px",
            marginBottom: "64px",
          }}
          className="hero-descriptor"
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "#555",
              fontFamily: "'Inter', sans-serif",
              maxWidth: "400px",
            }}
          >
            Building scalable React &amp; Node.js applications for
            AI-driven products — from healthcare to fintech — with
            pixel-perfect UIs and rock-solid APIs.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "48px" }}>
            {[
              { value: "2+", label: "Years Experience" },
              { value: "10+", label: "Projects Shipped" },
              { value: "3", label: "Internships" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#c0c0c0",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#333",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ display: "flex", gap: "16px", alignItems: "center" }}
        >
          {/* Primary — resume */}
          <MagneticButton>
            <div
              onClick={handleResumeDownload}
              style={{
                background: "#f0f0f0",
                color: "#0a0a0a",
                border: "none",
                padding: "16px 36px",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "background 0.2s, transform 0.2s",
              }}
              className="hero-btn-primary"
              role="button"
            >
              View Resume
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
              </svg>
            </div>
          </MagneticButton>

          {/* Secondary — projects */}
          <MagneticButton>
            <div
              onClick={handleViewProjects}
              style={{
                background: "transparent",
                color: "#555",
                border: "1px solid #222",
                padding: "15px 36px",
                fontSize: "12px",
                fontWeight: "500",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "border-color 0.2s, color 0.2s, transform 0.2s",
              }}
              className="hero-btn-secondary"
              role="button"
            >
              View Projects
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Bottom scroll bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 64px",
          borderTop: "1px solid #141414",
        }}
        className="hero-bottombar"
      >
        {/* Tech stack */}
        <div style={{ display: "flex", gap: "20px" }}>
          {["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: "11px",
                color: "#2e2e2e",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Scroll hint */}
        <button
          onClick={handleViewProjects}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: 0,
          }}
          className="hero-scroll-btn"
        >
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2e2e2e",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e2e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </button>
      </motion.div>

      {/* Interaction styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-main {
            padding: 0 24px !important;
          }
          .hero-bottombar {
            padding: 20px 24px !important;
            flex-direction: column;
            gap: 16px;
            align-items: flex-start !important;
          }
          .hero-descriptor {
            flex-direction: column !important;
            gap: 32px !important;
          }
        }
        .hero-btn-primary:hover {
          background: #ffffff !important;
          transform: translateY(-1px);
        }
        .hero-btn-secondary:hover {
          border-color: #444 !important;
          color: #aaa !important;
          transform: translateY(-1px);
        }
        .hero-scroll-btn:hover span,
        .hero-scroll-btn:hover svg {
          color: #666 !important;
          stroke: #666 !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;