import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Phone from "./Phone";

const T = { beige: "#F9F6F1", card: "#FFFFFF", border: "#E2DAD0", brown: "#8B6F47", orange: "#F97316", charcoal: "#1C1917", muted: "#78716C", faint: "#A8A29E", green: "#16A34A" };
const inr = () => "₹••••"; // amounts masked in the demo

const PRODUCTS = [
  { name: "Boult Z40 Earbuds", price: 1299, mrp: 2999, icon: "earbuds", tint: "#ECE6F2" },
  { name: "iPhone 15 Case", price: 349, mrp: 799, icon: "case", tint: "#E6EEF2" },
  { name: "65W GaN Charger", price: 899, mrp: 1799, icon: "charger", tint: "#F2EEDF" },
  { name: "10000mAh Power Bank", price: 1149, mrp: 1999, icon: "powerbank", tint: "#E6F0E8" },
];

function Ic({ name, size = 34, color = T.charcoal }) {
  const stroke = { earbuds: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13.5" width="4.2" height="6.5" rx="2" /><rect x="17.3" y="13.5" width="4.2" height="6.5" rx="2" /></>, case: <><rect x="6" y="2.5" width="12" height="19" rx="2.6" /><path d="M10 18.5h4" /></>, powerbank: <><rect x="3" y="7" width="15" height="10" rx="2" /><path d="M21 10.5v3" /><path d="M9.5 9.5L8 12.2h2L8.6 15" /></> }[name];
  if (name === "charger") return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M13 2L5 13h5l-1 9 8-11h-5l1-9z" /></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{stroke}</svg>;
}

const SEQ = [
  ["add1", 1600], ["add2", 1700], ["done", 1900], ["reset", 2600],
];

export default function GadgetBazaarMobile() {
  const [phase, setPhase] = useState("browse");
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState(null);
  const [hot, setHot] = useState(null);

  useEffect(() => {
    let i = 0, timer;
    const run = () => {
      const [next, delay] = SEQ[i];
      timer = setTimeout(() => {
        if (next === "add1") { setCart(1); setHot(0); flash(PRODUCTS[0].name); }
        else if (next === "add2") { setCart(2); setHot(3); flash(PRODUCTS[3].name); }
        else if (next === "done") { setPhase("done"); setHot(null); }
        else if (next === "reset") { setPhase("browse"); setCart(0); }
        i = (i + 1) % SEQ.length;
        run();
      }, delay);
    };
    run();
    return () => clearTimeout(timer);
  }, []);

  const flash = (n) => { setToast(n); setTimeout(() => setToast(null), 1300); };
  const total = (cart >= 1 ? PRODUCTS[0].price : 0) + (cart >= 2 ? PRODUCTS[3].price : 0);

  return (
    <Phone bg={T.beige} ink={T.charcoal}>
      {/* header */}
      <div style={{ height: 48, background: T.card, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0, fontFamily: "'Geist', Inter, sans-serif" }}>
        <div style={{ flex: 1, fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: T.charcoal }}>Gadget<span style={{ color: T.orange }}>Bazaar</span></div>
        <div style={{ position: "relative" }}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l1.5 12h11l1.5-8H6" stroke={T.charcoal} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /><circle cx="9" cy="20" r="1.3" fill={T.charcoal} /><circle cx="17" cy="20" r="1.3" fill={T.charcoal} /></svg>
          <AnimatePresence>
            {cart > 0 && (
              <motion.span key={cart} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: -6, right: -7, minWidth: 16, height: 16, borderRadius: 8, background: T.orange, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cart}</motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* marquee */}
      <div style={{ height: 24, background: T.charcoal, color: T.beige, display: "flex", alignItems: "center", paddingLeft: 14, fontSize: 10, flexShrink: 0, opacity: 0.92 }}>Free shipping on every order · UPI · COD</div>

      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: 14, fontFamily: "'Geist', Inter, sans-serif" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.charcoal, marginBottom: 10 }}>Top picks for you</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PRODUCTS.map((p, idx) => {
            const isHot = hot === idx;
            const discount = Math.round((1 - p.price / p.mrp) * 100);
            return (
              <div key={p.name} style={{ background: T.card, borderRadius: 13, border: `1px solid ${isHot ? T.brown : T.border}`, overflow: "hidden", boxShadow: isHot ? `0 10px 22px ${T.brown}22` : "none" }}>
                <div style={{ position: "relative", aspectRatio: "1 / 1", background: p.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ic name={p.icon} size={36} />
                  <span style={{ position: "absolute", top: 7, left: 7, background: "#EF4444", color: "#fff", fontSize: 8.5, fontWeight: 700, padding: "2px 6px", borderRadius: 999 }}>SALE</span>
                  <AnimatePresence>
                    {isHot && <motion.span initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.7 }} style={{ position: "absolute", bottom: 8, left: "50%", marginLeft: -14, width: 28, height: 28, borderRadius: 999, background: T.brown, pointerEvents: "none" }} />}
                  </AnimatePresence>
                </div>
                <div style={{ padding: "8px 9px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.charcoal, lineHeight: 1.25, height: 28, overflow: "hidden" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.charcoal }}>{inr(p.price)}</span>
                  </div>
                  <div style={{ marginTop: 7, height: 26, borderRadius: 7, background: isHot ? T.brown : T.charcoal, color: T.beige, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 600 }}>
                    {isHot ? "Added ✓" : "Add to Cart"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", background: T.charcoal, color: T.beige, fontSize: 11, padding: "8px 14px", borderRadius: 999, display: "flex", alignItems: "center", gap: 7, zIndex: 20, boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }}>
            <span style={{ color: "#9DD89E" }}>✓</span> Added to cart
          </motion.div>
        )}
      </AnimatePresence>

      {/* order placed overlay */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, background: "rgba(249,246,241,0.96)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, zIndex: 25, fontFamily: "'Geist', Inter, sans-serif" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}
              style={{ width: 58, height: 58, borderRadius: 29, background: T.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </motion.div>
            <div style={{ fontSize: 19, fontWeight: 800, color: T.charcoal, letterSpacing: "-0.02em" }}>Order placed!</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 5 }}>{inr(total)} paid via UPI</div>
            <div style={{ fontSize: 11, color: T.faint, marginTop: 8, padding: "6px 12px", borderRadius: 999, background: T.card, border: `1px solid ${T.border}` }}>Shipping with Shiprocket · 3–4 days</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Phone>
  );
}
