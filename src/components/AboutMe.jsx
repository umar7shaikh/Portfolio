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
        background: "#0a0a0a",
        minHeight: "100vh",
        padding: "0",
        position: "relative",
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
        {/* ── LEFT: Text Content ── */}
        <div
          style={{
            padding: "120px 80px 120px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          className="about-left"
        >
          {/* Label */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "20px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            About
          </motion.p>

          {/* Main Heading */}
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            style={{
              fontSize: "clamp(36px, 4vw, 60px)",
              fontWeight: "700",
              color: "#f0f0f0",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              marginBottom: "32px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Engineer by training,
            <br />
            <span style={{ color: "#888" }}>builder by nature.</span>
          </motion.h2>

          {/* Bio */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            style={{ marginBottom: "52px", maxWidth: "540px" }}
          >
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.8",
                color: "#888",
                fontFamily: "'Inter', sans-serif",
                marginBottom: "16px",
              }}
            >
              My journey into development began with a fascination for how
              technology can solve real-world problems and transform user
              experiences. I specialize in building scalable web applications
              with clean, efficient code — from healthcare to finance.
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.8",
                color: "#888",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              When I'm not coding, you'll find me exploring new frameworks,
              contributing to open-source projects, or diving into AI and
              machine learning. Continuous learning is the key to growth.
            </p>
          </motion.div>

          {/* Services */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            style={{ marginBottom: "52px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#444",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Services
              </p>
              <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {services.map((service, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "13px",
                    color: "#aaa",
                    border: "1px solid #252525",
                    borderRadius: "100px",
                    padding: "6px 16px",
                    fontFamily: "'Inter', sans-serif",
                    background: "#111",
                    letterSpacing: "0.01em",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  className="about-pill"
                >
                  {service}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#444",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Experience & Education
              </p>
              <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
            </div>
            <div>
              {experience.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px 1fr",
                    gap: "16px",
                    padding: "20px 0",
                    borderTop: i === 0 ? "none" : "1px solid #1a1a1a",
                    alignItems: "start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#444",
                      fontFamily: "monospace",
                      paddingTop: "2px",
                    }}
                  >
                    {item.year}
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#d0d0d0",
                        fontWeight: "500",
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: "4px",
                      }}
                    >
                      {item.role}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {item.company}
                    </p>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #1a1a1a" }} />
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
              background: "#111",
              padding: "20px", // The Museum Frame "Matte"
              border: "1px solid #1a1a1a",
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
                background: "#050505",
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
                  filter: "grayscale(100%) brightness(0.65) contrast(1.2)", // Base high contrast
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
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#333", letterSpacing: "0.2em" }}>EDITION.04</span>
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#333", letterSpacing: "0.2em" }}>©2026 UMAR.CORP</span>
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
        .about-pill:hover {
          border-color: #444 !important;
          color: #e0e0e0 !important;
        }
      `}</style>
    </section>
  );
};

export default AboutMe;
