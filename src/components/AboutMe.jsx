// src/components/AboutMe.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import umarImage from "../assets/umarportfolio.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 },
  }),
};

const AboutMe = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Giant background text parallax
  const xLeft = useTransform(scrollYProgress, [0, 1], [-300, 300]);
  const xRight = useTransform(scrollYProgress, [0, 1], [300, -300]);

  const services = [
    "Full-Stack Development",
    "React.js / Next.js",
    "Backend API Development",
    "Database Design",
    "Cloud Deployment",
    "AI / ML Integration",
    "Mobile App Design",
    "Website Design",
  ];

  const experience = [
    {
      year: "2024 – 2025",
      role: "Software Development Engineer Intern",
      company: "Rebert Technologies Pvt. Ltd.",
    },
    {
      year: "2023",
      role: "Frontend Developer Intern",
      company: "ITJOBXS",
    },
    {
      year: "2021 – 2025",
      role: "B.E. Computer Engineering",
      company: "Trinity College of Engineering",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="about"
      style={{
        background: "transparent",
        minHeight: "100vh",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── HALFTONE SVG FILTER DEFINITION ── */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="halftone">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          {/* Halftone pattern logic */}
          <feTile />
          <feTurbulence baseFrequency="0.65" type="fractalNoise" numOctaves="3" seed="1" />
          <feColorMatrix type="matrix" values="0 0 0 10 -5  0 0 0 10 -5  0 0 0 10 -5  0 0 1 0 0" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </svg>

      {/* ── BACKGROUND GHOST TEXT ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          width: "100%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          zIndex: 0,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        <motion.h3
          style={{
            fontSize: "25vw",
            fontWeight: "900",
            color: "rgba(255, 255, 255, 0.015)",
            textTransform: "uppercase",
            x: xLeft,
            marginBottom: "-5vw",
          }}
        >
          ENGINEER
        </motion.h3>
        <motion.h3
          style={{
            fontSize: "25vw",
            fontWeight: "900",
            color: "rgba(255, 255, 255, 0.015)",
            textTransform: "uppercase",
            x: xRight,
            textAlign: "right",
          }}
        >
          BUILDER
        </motion.h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          minHeight: "100vh",
          gap: "0",
          position: "relative",
          zIndex: 1,
        }}
        className="about-grid"
      >
        {/* ── LEFT: Brutalist Swiss Grid Content ── */}
        <div
          style={{
            padding: "120px 48px 120px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="about-left-brutalist"
        >
          {/* Top Block: Huge Type / Bio */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            style={{
              paddingBottom: "80px",
              borderBottom: "1px solid #fff",
            }}
          >
            <p style={{
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: "32px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              [ 01 ] SYSTEM ARCHITECT
            </p>
            <h2 style={{
              fontSize: "clamp(48px, 6vw, 84px)",
              fontWeight: "900",
              color: "#fff",
              lineHeight: "0.9",
              letterSpacing: "-0.04em",
              marginBottom: "48px",
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
            }}>
              ENGINEER BY
              <br />
              <span style={{ color: "transparent", WebkitTextStroke: "2px #fff" }}>TRAINING.</span>
              <br />
              BUILDER BY
              <br />
              <span style={{ color: "transparent", WebkitTextStroke: "2px #fff" }}>NATURE.</span>
            </h2>
            <p style={{
              fontSize: "clamp(16px, 1.5vw, 20px)",
              lineHeight: "1.6",
              color: "#fff",
              fontWeight: "500",
              fontFamily: "'Inter', sans-serif",
              maxWidth: "600px",
            }}>
              I specialize in extremely scalable, relentless logic loops and brutalist, high-performance web applications. My journey is rooted in solving impossible problems with lethal efficiency.
            </p>
          </motion.div>

          {/* Bottom Block: Services & Experience Grid */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              paddingTop: "80px",
            }}
            className="about-bottom-grid"
          >
            {/* Services */}
            <div>
              <p style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#fff",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: "32px",
              }}>
                // PROTOCOLS
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {services.map((service, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "13px",
                      color: "#fff",
                      borderBottom: "1px solid #333",
                      padding: "16px 0",
                      fontFamily: "'JetBrains Mono', monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                    className="hover-target"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience */}
            <div>
              <p style={{
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#fff",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: "32px",
              }}>
                // DEPLOYMENTS
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {experience.map((item, i) => (
                  <div key={i} style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #333"
                  }}>
                    <p style={{
                      fontSize: "14px",
                      color: "#fff",
                      fontWeight: "900",
                      fontFamily: "'Inter', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}>
                      {item.role}
                    </p>
                    <p style={{
                      fontSize: "11px",
                      color: "#aaa",
                      fontFamily: "'JetBrains Mono', monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>
                      {item.company} <br /><br /> <span style={{ color: "#fff" }}>[{item.year}]</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Museum Frame Portrait ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
          }}
          className="about-right-outer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "480px",
              aspectRatio: "4 / 5",
              background: "#000",
              padding: "20px",
              border: "2px solid #fff",
              boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                background: "#000",
              }}
            >
              {/* Halftone Grain Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  opacity: 0.15,
                  zIndex: 4,
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                }}
              />

              <img
                src={umarImage}
                alt="Muhammed Umar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 10%",
                  filter: "grayscale(100%) brightness(1.2) contrast(1.5)", // Extreme high contrast
                  display: "block",
                }}
              />

              {/* Subtle Dither Pattern Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle, #555 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                  opacity: 0.1,
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Editorial Metadata */}
            <div style={{ position: "absolute", bottom: -40, left: 0, display: "flex", gap: "24px" }}>
              <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "#fff", letterSpacing: "0.2em" }}>SYS.V25.CORE</span>
              <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "#fff", letterSpacing: "0.2em" }}>©2026 UMAR</span>
            </div>
          </motion.div>

          {/* Background Decorative Line */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              width: "40%",
              height: "1px",
              background: "#1a1a1a",
              zIndex: 1
            }}
          />
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .about-right-outer {
            order: -1;
            padding: 60px 24px !important;
            height: auto !important;
            min-height: 500px;
          }
          .about-right-outer > div {
             max-width: 100% !important;
          }
          .about-left {
            padding: 60px 24px !important;
          }
        }
          .about-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutMe;
