import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const handleResumeDownload = () => {
    window.open("/resume-muhammed-umar.pdf", "_blank");
  };

  const handleViewProjects = () => {
    const el = document.getElementById("works");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      style={{
        background: "#000000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Absolute brutalism: no orb, no fancy particles */}

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
            fontSize: "12px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: "16px",
          }}
        >
          SYS.V25 // PORTFOLIO
        </motion.p>

        {/* Big name */}
        <div style={{ position: "relative", width: "100vw", left: "50%", transform: "translateX(-50%)", overflow: "visible" }}>
          <motion.h1
            style={{
              x: y1,
              fontSize: "clamp(120px, 20vw, 400px)",
              fontWeight: "900",
              color: "#ffffff",
              lineHeight: "0.8",
              letterSpacing: "-0.06em",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            MUHAMMED UMAR
          </motion.h1>
          <motion.h1
            style={{
              x: y2,
              fontSize: "clamp(120px, 20vw, 400px)",
              fontWeight: "900",
              color: "transparent",
              WebkitTextStroke: "2px #333",
              lineHeight: "0.8",
              letterSpacing: "-0.06em",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            MUHAMMED UMAR
          </motion.h1>
        </div>

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
            marginTop: "64px",
          }}
          className="hero-descriptor"
        >
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 24px)",
              lineHeight: "1.2",
              color: "#fff",
              fontWeight: "600",
              fontFamily: "'Inter', sans-serif",
              maxWidth: "500px",
              textTransform: "uppercase",
            }}
          >
            Developing relentless logic loops and brutalist interfaces for the next generation of web-scale applications.
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
                    fontSize: "48px",
                    fontWeight: "900",
                    color: "#fff",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {stat.value}
                </p>
                <div style={{ width: "100%", height: "2px", background: "#fff", margin: "8px 0" }} />
                <p
                  style={{
                    fontSize: "10px",
                    color: "#fff",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    margin: 0,
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
          <MagneticButton
            onClick={handleResumeDownload}
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              padding: "20px 48px",
              fontSize: "14px",
              fontWeight: "900",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            className="hero-btn-primary hover-target"
          >
            [ EXECUTE RESUME ]
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v2h14v-2" />
            </svg>
          </MagneticButton>

          {/* Secondary — projects */}
          <MagneticButton
            onClick={handleViewProjects}
            style={{
              background: "transparent",
              color: "#fff",
              border: "2px solid #fff",
              padding: "18px 48px",
              fontSize: "14px",
              fontWeight: "900",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            className="hero-btn-secondary hover-target"
          >
            [ DECODE PROJECTS ]
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
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
          borderTop: "2px solid #fff",
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
                color: "#9ca3af",
                fontFamily: "'JetBrains Mono', monospace",
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
              color: "#9ca3af",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          background: #ccc !important;
        }
        .hero-btn-secondary:hover {
          background: #fff !important;
          color: #000 !important;
        }
        .hero-scroll-btn:hover span,
        .hero-scroll-btn:hover svg {
          color: #fff !important;
          stroke: #fff !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;