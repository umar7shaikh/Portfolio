// src/components/AboutMe.jsx
import React from "react";
import { motion } from "framer-motion";
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
      id="about"
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        padding: "0",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
          gap: "0",
        }}
        className="about-grid"
      >
        {/* ── LEFT: Text Content ── */}
        <div
          style={{
            padding: "80px 56px 80px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRight: "1px solid #1f1f1f",
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
            style={{ marginBottom: "52px" }}
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
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#444",
                marginBottom: "16px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Services
            </p>
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
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#444",
                marginBottom: "20px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Experience & Education
            </p>
            <div>
              {experience.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px 1fr",
                    gap: "16px",
                    padding: "20px 0",
                    borderTop: "1px solid #1a1a1a",
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

        {/* ── RIGHT: Image ── */}
        <div
          style={{ overflow: "hidden" }}
          className="about-right-outer"
        >
          <div
            style={{
              position: "sticky",
              top: "0",
              height: "100vh",
              overflow: "hidden",
            }}
            className="about-right"
          >
            {/* Subtle overlay gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, #0a0a0a 0%, transparent 12%, transparent 80%, #0a0a0a 100%)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
            {/* Left edge fade into border */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "60px",
                height: "100%",
                background: "linear-gradient(to right, #0a0a0a, transparent)",
                zIndex: 3,
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
                filter: "grayscale(100%) brightness(0.65) contrast(1.1)",
                display: "block",
              }}
            />
          </div>
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
          }
          .about-right {
            position: relative !important;
            height: 420px !important;
            top: auto !important;
          }
          .about-left {
            padding: 60px 28px !important;
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
