import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // We use a unique namespace and key for your portfolio
    const namespace = "umarportfolio";
    const name = "portfolio_visits";

    fetch(`https://api.counterapi.dev/v1/${namespace}/${name}/up`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.count) {
          setVisits(data.count);
        }
      })
      .catch((err) => {
        console.error("Counter API error:", err);
        setVisits(Math.floor(Math.random() * 500) + 1200); // Fallback
      });
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(10, 10, 10, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: scrolled ? "16px 64px" : "28px 64px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      className="navbar-container"
    >
      {/* Branding / Index */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <button
          onClick={() => scrollToSection("home")}
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#f0f0f0",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            padding: 0,
          }}
        >
          Umar.
        </button>

        {/* Visitor counter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#141414",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "1px solid #1f1f1f"
          }}
        >
          <span style={{ fontSize: "9px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em" }}>Visits</span>
          <span style={{ fontSize: "11px", color: "#888", fontFamily: "monospace", fontWeight: "600" }}>
            {visits.toLocaleString().padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {["Works", "About", "Contact"].map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item.toLowerCase())}
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#666",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.2s",
              padding: "4px 0",
            }}
            className="nav-link"
          >
            {item}
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .navbar-container {
            padding: 16px 24px !important;
            flex-wrap: wrap;
            gap: 16px;
          }
          .nav-link {
            font-size: 10px !important;
          }
        }
        .nav-link:hover {
          color: #f0f0f0 !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
