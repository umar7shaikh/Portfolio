import React from "react";

// Lightweight phone frame for the mobile demo variants.
export default function Phone({ bg = "#000", ink = "#fff", children }) {
  return (
    <div style={{ maxWidth: 320, width: "100%", margin: "0 auto" }}>
      <div style={{ borderRadius: 44, background: "#0b0b0d", padding: 9, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "relative", borderRadius: 36, overflow: "hidden", background: bg, aspectRatio: "9 / 19", display: "flex", flexDirection: "column" }}>
          {/* notch */}
          <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: 92, height: 20, background: "#0b0b0d", borderRadius: 12, zIndex: 30 }} />
          {/* status bar */}
          <div style={{ height: 34, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", color: ink, fontSize: 11, fontWeight: 600, fontFamily: "Inter, system-ui, sans-serif", paddingTop: 4 }}>
            <span>9:41</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, opacity: 0.85 }}>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none"><rect x="0" y="6" width="3" height="5" rx="1" fill={ink} /><rect x="4.5" y="4" width="3" height="7" rx="1" fill={ink} /><rect x="9" y="2" width="3" height="9" rx="1" fill={ink} /><rect x="13.5" y="0" width="2.5" height="11" rx="1" fill={ink} opacity="0.4" /></svg>
              <svg width="20" height="11" viewBox="0 0 24 12" fill="none"><rect x="1" y="1" width="19" height="10" rx="2.5" stroke={ink} strokeOpacity="0.5" /><rect x="2.5" y="2.5" width="13" height="7" rx="1" fill={ink} /><rect x="21" y="4" width="2" height="4" rx="1" fill={ink} opacity="0.6" /></svg>
            </span>
          </div>
          <div style={{ flex: 1, minHeight: 0, position: "relative", display: "flex", flexDirection: "column" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
