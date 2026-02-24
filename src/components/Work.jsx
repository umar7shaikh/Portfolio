// src/components/Work.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import medbot1 from "../assets/medbot1.png";
import medbotImg from "../assets/medbot.png";
import financeImg from "../assets/finance.png";
import franccoImg from "../assets/francco.png";
import cliImg from "../assets/cli.png";
import theLaddersImg from "../assets/screencapture-theladders-tech.png";

import reactIcon from "../assets/react-svgrepo-com.svg";
import nodejsIcon from "../assets/nodejs-svgrepo-com.svg";
import mongodbIcon from "../assets/mongodb-svgrepo-com.svg";
import nextjsIcon from "../assets/next-js-svgrepo-com.svg";
import postgresqlIcon from "../assets/postgresql-svgrepo-com.svg";

const projectsData = [
  {
    id: 3,
    title: "FRANZ CO.",
    category: "WEB / BRANDING",
    year: "2024",
    link: "/works?project=3",
  },
];


const Works = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setImgPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="works"
      style={{
        background: "transparent",
        paddingBottom: "120px",
      }}
    >
      {/* Top label bar */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "18px 64px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
        className="works-label-bar"
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8c8c8c",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Selected Work
        </span>
        <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
        <Link
          to="/works"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8c8c8c",
            fontFamily: "'JetBrains Mono', monospace",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          className="works-view-all-link"
        >
          View All →
        </Link>
      </div>

      {/* Project list */}
      <div
        style={{ position: "relative" }}
        onMouseMove={handleMouseMove}
      >
        {projectsData.map((project, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            key={project.id}
            onClick={() => navigate(`/works?project=${project.id}`)}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              borderBottom: "1px solid #fff",
              padding: "40px 64px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "padding 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              background: hoveredId === project.id ? "#fff" : "transparent",
              position: "relative",
              overflow: "hidden",
            }}
            className="works-row hover-target"
          >
            {/* Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "32px", zIndex: 2 }}>
              <span
                style={{
                  fontSize: "12px",
                  color: hoveredId === project.id ? "#000" : "#666",
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "color 0.4s",
                }}
              >
                [0{index + 1}]
              </span>
              <motion.h3
                style={{
                  fontSize: "clamp(48px, 6vw, 96px)",
                  fontWeight: "900",
                  color: hoveredId === project.id ? "#000" : "#fff",
                  letterSpacing: "-0.04em",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  textTransform: "uppercase",
                  lineHeight: 0.8,
                  margin: 0,
                  transform: hoveredId === project.id ? "translateX(24px)" : "translateX(0px)",
                }}
              >
                {project.title}
              </motion.h3>
            </div>

            {/* Category / Year */}
            <div style={{ display: "flex", gap: "64px", alignItems: "center", zIndex: 2 }}>
              <span
                style={{
                  fontSize: "12px",
                  color: hoveredId === project.id ? "#000" : "#fff",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  transition: "color 0.4s",
                }}
              >
                {project.category}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: hoveredId === project.id ? "#000" : "#fff",
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "color 0.4s",
                }}
              >
                {project.year}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          padding: "28px 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #111",
        }}
        className="works-bottom-bar"
      >
        <span
          style={{
            fontSize: "10px",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.2em",
          }}
        >
          [ {projectsData.length} PROTOCOLS_DEPLOYED ]
        </span>
        <Link
          to="/works"
          style={{
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "color 0.2s",
            border: "1px solid #fff",
            padding: "16px 32px",
          }}
          className="works-all-link"
        >
          View all works
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .works-label-bar {
            padding: 18px 24px !important;
          }
          .works-row {
            padding: 0 24px !important;
            grid-template-columns: 36px 1fr auto !important;
            gap: 16px !important;
          }
          .works-bottom-bar {
            padding: 24px 24px !important;
          }
        }
        .works-view-all-link:hover {
          color: #aaa !important;
        }
        .works-all-link:hover {
          color: #aaa !important;
        }
      `}</style>
    </section >
  );
};

export default Works;
