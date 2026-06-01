import React from "react";

// Motoriq's real interactive product demo, served as a self-contained bundle in
// /public/demos/motoriq (lifted from the motoriq.in marketing site). It's isolated
// in an iframe so its global CSS reset can't leak into the portfolio.
const MotoriqDemo = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: "1px solid #1f2937",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        background: "#0a0a0f",
      }}
    >
      <iframe
        src="/demos/motoriq/index.html"
        title="Motoriq — interactive product demo"
        loading="lazy"
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "16 / 10",
          border: "none",
          background: "transparent",
        }}
      />
    </div>
  );
};

export default MotoriqDemo;
