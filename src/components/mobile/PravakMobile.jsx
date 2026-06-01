import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Phone from "./Phone";

const T = { paper: "#16201A", raised: "#1E2B22", ink: "#E9E2D0", soft: "#C6BFAD", muted: "#9AA593", clay: "#D69A3C", clayTint: "#3A2E1A", leaf: "#9DB36F", line: "#2C3A30" };

const LINES = [
  { who: "ai", t: "Thanks for calling BrightSmile — this is Pravak. How can I help?" },
  { who: "caller", t: "I'd like to book a teeth cleaning this week." },
  { who: "ai", t: "Friday at 11 AM works — you're booked. I've texted a confirmation." },
];

function Wave({ active, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 34 }}>
      {Array.from({ length: 26 }).map((_, i) => {
        const env = 0.4 + 0.6 * Math.abs(Math.sin((i / 26) * Math.PI));
        return (
          <motion.span key={i} style={{ width: 3, borderRadius: 3, background: color }}
            animate={active ? { height: [5, 6 + env * 26, 5] } : { height: 4 }}
            transition={active ? { duration: 0.5 + env * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 } : { duration: 0.3 }} />
        );
      })}
    </div>
  );
}

export default function PravakMobile() {
  const [step, setStep] = useState(-1); // -1 ringing, 0..2 lines, 3 booked
  const scrollRef = useRef(null);

  useEffect(() => {
    let timer;
    if (step === -1) timer = setTimeout(() => setStep(0), 1400);
    else if (step < LINES.length) timer = setTimeout(() => setStep((s) => s + 1), 2600);
    else timer = setTimeout(() => setStep(-1), 3800);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [step]);

  const ringing = step === -1;
  const booked = step >= LINES.length;
  const speaking = !ringing && !booked ? LINES[step].who : null;
  const visible = LINES.slice(0, Math.max(0, booked ? LINES.length : step + 1));

  return (
    <Phone bg={T.paper} ink={T.ink}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 16px", borderBottom: `1px solid ${T.line}` }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: T.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 12h2.4l2-7 4 14 2.4-9 1.8 5H21" stroke={T.paper} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ flex: 1, fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 600, color: T.ink }}>Pravak</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.leaf, fontWeight: 600 }}>
          <motion.span style={{ width: 6, height: 6, borderRadius: 3, background: T.leaf }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          {ringing ? "Ringing" : booked ? "Wrapped" : "Live"}
        </div>
      </div>

      {/* call panel */}
      <div style={{ padding: "16px 16px 10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: T.muted }}>Inbound · BrightSmile Dental</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginTop: 2 }}>+91 ••••• •••••</div>

        <div style={{ position: "relative", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
          {speaking && [0, 1].map((r) => (
            <motion.span key={r} style={{ position: "absolute", borderRadius: "50%", border: `2px solid ${speaking === "caller" ? T.leaf : T.clay}` }}
              initial={{ width: 56, height: 56, opacity: 0.5 }} animate={{ width: 96, height: 96, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, delay: r * 0.8, ease: "easeOut" }} />
          ))}
          <motion.div style={{ width: 60, height: 60, borderRadius: 30, background: `linear-gradient(135deg, ${T.clay}, #B5793A)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${T.clay}55` }}
            animate={{ scale: speaking ? [1, 1.06, 1] : 1 }} transition={{ duration: 1, repeat: speaking ? Infinity : 0 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={T.paper} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" /></svg>
          </motion.div>
        </div>
        <div style={{ width: "100%", marginTop: 12 }}><Wave active={!!speaking} color={speaking === "caller" ? T.leaf : T.clay} /></div>
        <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: T.muted, marginTop: 6, height: 14 }}>
          {ringing ? "Connecting" : speaking === "ai" ? "Pravak speaking" : speaking === "caller" ? "Caller speaking" : "Call summary"}
        </div>
      </div>

      {/* transcript */}
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: "4px 14px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
        {visible.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ alignSelf: l.who === "ai" ? "flex-start" : "flex-end", maxWidth: "85%", padding: "9px 12px", borderRadius: 13, fontSize: 12.5, lineHeight: 1.35, color: T.ink, background: l.who === "ai" ? T.clayTint : T.raised, border: `1px solid ${l.who === "ai" ? T.clay + "44" : T.line}`, borderTopLeftRadius: l.who === "ai" ? 3 : 13, borderTopRightRadius: l.who === "ai" ? 13 : 3 }}>
            {l.t}
          </motion.div>
        ))}
        <AnimatePresence>
          {booked && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ margin: "6px auto 0", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 999, background: "rgba(157,179,111,0.12)", border: `1px solid ${T.leaf}44`, color: T.leaf, fontSize: 12, fontWeight: 600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.leaf} strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Booked · Fri 11:00 AM
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Phone>
  );
}
