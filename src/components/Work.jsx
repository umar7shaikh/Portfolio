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
    id: 1,
    title: "MedBot",
    category: "AI / Healthcare",
    year: "2024",
    image: medbot1,
    techs: [reactIcon, nodejsIcon, mongodbIcon],
    link: "/works?project=1",
  },
  {
    id: 5,
    title: "TheLadders.tech",
    category: "Web / CMS",
    year: "2024",
    image: theLaddersImg,
    techs: [nextjsIcon, reactIcon, postgresqlIcon],
    link: "/works?project=5",
  },
  {
    id: 2,
    title: "Financial Analyzer",
    category: "FinTech / Data",
    year: "2024",
    image: financeImg,
    techs: [reactIcon],
    link: "/works?project=2",
  },
  {
    id: 4,
    title: "DevStack CLI",
    category: "Developer Tools",
    year: "2024",
    image: cliImg,
    techs: [nodejsIcon],
    link: "/works?project=4",
  },
  {
    id: 3,
    title: "Franz Co",
    category: "Web / Branding",
    year: "2024",
    image: franccoImg,
    techs: [reactIcon],
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
        background: "#ffffff",
        borderTop: "1px solid #eaeaea",
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
        <div style={{ flex: 1, height: "1px", background: "#eaeaea" }} />
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
              borderBottom: "1px solid #eaeaea",
              padding: "0 64px",
              display: "grid",
              gridTemplateColumns: "60px 1fr auto",
              alignItems: "center",
              gap: "32px",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              background: hoveredId === project.id ? "#0a0a0a" : "transparent",
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
                color: hoveredId === project.id ? "#666" : "#888",
                fontFamily: "monospace",
                transition: "color 0.4s",
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
                  color: hoveredId === project.id ? "#ffffff" : "#0a0a0a",
                  letterSpacing: "-0.02em",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  lineHeight: 1,
                  margin: 0,
                  transform: hoveredId === project.id ? "translateX(24px)" : "translateX(0px)",
                }}
              >
                {project.title}
              </motion.h3>
              <span
                style={{
                  fontSize: "12px",
                  color: hoveredId === project.id ? "#888" : "#888",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.05em",
                  opacity: hoveredId === project.id ? 1 : 0,
                  transition: "opacity 0.4s ease, color 0.4s ease",
                  transform: hoveredId === project.id ? "translateX(24px)" : "translateX(0px)",
                }}
              >
                {project.category}
              </span>
            </div>

            {/* Tech Icons + Year + arrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {project.techs && (
                <div style={{ display: "flex", gap: "12px", opacity: hoveredId === project.id ? 1 : 0.4, transition: "opacity 0.4s ease", marginRight: "12px" }}>
                  {project.techs.map((techImg, i) => (
                    <img key={i} src={techImg} alt="tech icon" style={{ width: "22px", height: "22px", objectFit: "contain", filter: hoveredId === project.id ? "brightness(0) invert(1) opacity(0.8)" : "brightness(0)", transition: "filter 0.4s ease" }} />
                  ))}
                </div>
              )}
              <span
                style={{
                  fontSize: "12px",
                  color: hoveredId === project.id ? "#888" : "#888",
                  fontFamily: "monospace",
                  transition: "color 0.4s",
                }}
              >
                {project.year}
              </span>
              <motion.span
                style={{
                  fontSize: "18px",
                  color: hoveredId === project.id ? "#ffffff" : "#444",
                  display: "inline-block",
                  opacity: hoveredId === project.id ? 1 : 0,
                  x: hoveredId === project.id ? 0 : -8,
                  transition: "all 0.4s ease",
                }}
              >
                ↗
              </motion.span>
            </div>
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
          borderTop: "1px solid #eaeaea",
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
          color: #111 !important;
        }
        .works-all-link:hover {
          color: #111 !important;
        }
      `}</style>
    </section >
  );
};

export default Works;
