// src/components/Work.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import medbotImg from "../assets/medbot.png";
import financeImg from "../assets/finance.png";
import franccoImg from "../assets/francco.png";
import cliImg from "../assets/cli.png";

const projectsData = [
  {
    id: 1,
    title: "MedBot",
    category: "AI / Healthcare",
    year: "2024",
    image: medbotImg,
    link: "https://github.com/yourusername/medbot",
  },
  {
    id: 2,
    title: "Financial Analyzer",
    category: "FinTech / Data",
    year: "2024",
    image: financeImg,
    link: "https://github.com/yourusername/financial-analyzer",
  },
  {
    id: 3,
    title: "Franz Co",
    category: "Web / Branding",
    year: "2023",
    image: franccoImg,
    link: "https://franzco.com",
  },
  {
    id: 4,
    title: "DevStack CLI",
    category: "Developer Tools",
    year: "2023",
    image: cliImg,
    link: "https://github.com/yourusername/devstack-cli",
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
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
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
            color: "#444",
            fontFamily: "'Inter', sans-serif",
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
            color: "#444",
            fontFamily: "'Inter', sans-serif",
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
          <div
            key={project.id}
            onClick={() => navigate(`/works?project=${project.id}`)}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              borderBottom: "1px solid #1a1a1a",
              padding: "0 64px",
              display: "grid",
              gridTemplateColumns: "60px 1fr auto",
              alignItems: "center",
              gap: "32px",
              cursor: "pointer",
              transition: "background 0.3s ease",
              background: hoveredId === project.id ? "#111" : "transparent",
              position: "relative",
              overflow: "hidden",
              minHeight: "100px",
            }}
            className="works-row"
          >
            {/* Index number */}
            <span
              style={{
                fontSize: "12px",
                color: hoveredId === project.id ? "#555" : "#2a2a2a",
                fontFamily: "monospace",
                transition: "color 0.3s",
                userSelect: "none",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Title + category */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "24px" }}>
              <motion.h3
                style={{
                  fontSize: "clamp(22px, 3vw, 42px)",
                  fontWeight: "600",
                  color: hoveredId === project.id ? "#f0f0f0" : "#2e2e2e",
                  letterSpacing: "-0.02em",
                  fontFamily: "'Inter', sans-serif",
                  transition: "color 0.3s ease",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {project.title}
              </motion.h3>
              <span
                style={{
                  fontSize: "12px",
                  color: "#333",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.05em",
                  opacity: hoveredId === project.id ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {project.category}
              </span>
            </div>

            {/* Year + arrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span
                style={{
                  fontSize: "12px",
                  color: "#333",
                  fontFamily: "monospace",
                }}
              >
                {project.year}
              </span>
              <motion.span
                style={{
                  fontSize: "18px",
                  color: "#444",
                  display: "inline-block",
                  opacity: hoveredId === project.id ? 1 : 0,
                  x: hoveredId === project.id ? 0 : -8,
                  transition: "all 0.3s ease",
                }}
              >
                ↗
              </motion.span>
            </div>

            {/* Hover image thumbnail — follows row, pinned to right */}
            <AnimatePresence>
              {hoveredId === project.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    right: "200px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "200px",
                    height: "130px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    pointerEvents: "none",
                    zIndex: 10,
                    border: "1px solid #222",
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(85%) brightness(0.7) contrast(1.1)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            fontSize: "12px",
            color: "#272727",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {projectsData.length} projects
        </span>
        <Link
          to="/works"
          style={{
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#555",
            fontFamily: "'Inter', sans-serif",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "color 0.2s",
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
    </section>
  );
};

export default Works;
