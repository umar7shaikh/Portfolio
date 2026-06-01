import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Phone from "./Phone";

const A = "#4f46e5"; // indigo accent
const MASK = "₹••••"; // amounts intentionally masked in the demo

export default function MotoriqMobile() {
  const [cycle, setCycle] = useState(0);
  const [sold, setSold] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), 6800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setSold(false);
    const t1 = setTimeout(() => setSold(true), 3000);
    return () => clearTimeout(t1);
  }, [cycle]);

  return (
    <Phone bg="#f8fafc" ink="#0f172a">
      {/* header */}
      <div style={{ height: 50, background: "#fff", borderBottom: "1px solid #eef2f6", display: "flex", alignItems: "center", padding: "0 16px", gap: 10, flexShrink: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: A, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 56 56" fill="none"><path d="M12 40V18l16 12 16-12v22" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ flex: 1, fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em", color: "#0f172a", fontFamily: "Inter, sans-serif" }}>MOTOR<span style={{ color: A }}>IQ</span></div>
        <div style={{ position: "relative" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 1.5a4 4 0 00-4 4v3l-1.5 2.5h11L12 8.5v-3a4 4 0 00-4-4z" stroke="#64748b" strokeWidth="1.6" /></svg>
          <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: 4, background: "#ef4444", border: "1.5px solid #fff" }} />
        </div>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: A, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>U</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: 14, fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Hi, Umar</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>Here's your dealership today.</div>

        {/* stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: 14, padding: 13 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em" }}>TOTAL REVENUE</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginTop: 4 }}>{MASK}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: 14, padding: 13, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em" }}>NET PROFIT</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.03em", marginTop: 4 }}>{MASK}</div>
            <AnimatePresence>
              {sold && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: "absolute", top: 11, right: 11, fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "2px 6px", borderRadius: 999 }}>+ profit</motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* section label */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Inventory</span>
          <span style={{ fontSize: 11, color: A, fontWeight: 600 }}>View all</span>
        </div>

        {/* vehicle card */}
        <div style={{ background: "#fff", border: "1px solid #eef2f6", borderRadius: 14, padding: 11, display: "flex", gap: 11, alignItems: "center" }}>
          <div style={{ width: 58, height: 48, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="34" height="20" viewBox="0 0 48 28" fill="none"><path d="M3 20l3-9 5-6h18l7 6 9 3v6H3v-0z" fill="#fff" stroke={A} strokeWidth="1.6" strokeLinejoin="round" /><circle cx="14" cy="22" r="3.5" fill="#0f172a" /><circle cx="36" cy="22" r="3.5" fill="#0f172a" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>Hyundai Creta 2021</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>MH14 CD 5678</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginTop: 3 }}>{MASK}</div>
          </div>
          <span style={{ alignSelf: "flex-start", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: sold ? "#dcfce7" : "#eef2ff", color: sold ? "#15803d" : A }}>
            {sold ? "SOLD" : "AVAILABLE"}
          </span>
        </div>

        {/* GST note */}
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748b", background: "#fff", border: "1px solid #eef2f6", borderRadius: 12, padding: "10px 12px" }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, background: "#eef2ff", color: A, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11 }}>%</span>
          GST margin-scheme invoice ready
        </div>
      </div>

      {/* sold toast */}
      <AnimatePresence>
        {sold && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            style={{ position: "absolute", bottom: 16, left: 14, right: 14, background: "#0f172a", color: "#fff", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 14px 30px rgba(15,23,42,0.3)", zIndex: 20 }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </span>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Creta sold · {MASK}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Phone>
  );
}
