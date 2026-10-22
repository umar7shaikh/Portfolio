// Small shared pieces for the demo screens.
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PATHS = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  calc: "M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01",
  cart: "M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z",
  factory: "M3 21V10l6 4V10l6 4V6h6v15zM7 17h2M12 17h2M17 17h2",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  truck: "M2 6h12v10H2zM14 10h4l3 3v3h-7M6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  chev: "M8 10l4 4 4-4",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
  menu: "M4 7h16M4 12h16M4 17h16",
  lock: "M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 017 0v3",
  check: "M5 12.5l4.5 4.5L19 7.5",
  merge: "M6 4v4a4 4 0 004 4h4a4 4 0 014 4v4M18 4v4a4 4 0 01-4 4",
  dot: "M12 12.5a.5.5 0 100-1 .5.5 0 000 1z",
  send: "M4 12l16-8-6 16-3-6.5z",
  home: "M4 11l8-7 8 7v9h-5v-6H9v6H4z",
  car: "M5 16h14M3 13l2.5-5.5A2 2 0 017.3 6.3h9.4a2 2 0 011.8 1.2L21 13v4h-2v2h-3v-2H8v2H5v-2H3zM7 13h.01M17 13h.01",
  users: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21v-1a6 6 0 0112 0v1M16 3.5a4 4 0 010 7.5M22 21v-1a6 6 0 00-4-5.6",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z",
  mic: "M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  msg: "M4 5h16v11H8l-4 4z",
  heart: "M3 12h4l2-4 3 8 2-5 1.5 1H21",
  plus: "M12 5v14M5 12h14",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6",
  bell: "M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  wallet: "M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H3zM3 7V5h13M16 13h.01",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2",
  rotate: "M20 12a8 8 0 11-2.3-5.6M20 4v4h-4",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11zM12 12a2 2 0 100-4 2 2 0 000 4z",
  stetho: "M6 3v6a5 5 0 0010 0V3M11 14v2a5 5 0 0010 0v-2M21 12a2 2 0 100-4 2 2 0 000 4z",
  play: "M8 5l11 7-11 7z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  sparkSm: "M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5z",
};

export function Icon({ name, size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={PATHS[name] || PATHS.dot} />
    </svg>
  );
}

export function Typewriter({ text, cps = 55, onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setN((k) => {
        if (k >= text.length) {
          clearInterval(id);
          onDone?.();
          return k;
        }
        return k + 2;
      });
    }, 2000 / cps);
    return () => clearInterval(id);
  }, [text, cps]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="kit-caret" />}
    </span>
  );
}

export function Toast({ children }) {
  return (
    <motion.div
      className="ui-toast"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3 }}
    >
      <i><Icon name="check" size={11} /></i>
      {children}
    </motion.div>
  );
}

export function Wave({ bars = 28, active = true, color = "currentColor", height = 34, seed = 1 }) {
  return (
    <div className="kit-wave" style={{ height, color }}>
      {Array.from({ length: bars }, (_, i) => {
        const base = 0.25 + 0.75 * Math.abs(Math.sin((i + 1) * 1.7 * seed));
        return (
          <span
            key={i}
            style={{
              height: `${base * 100}%`,
              animationDelay: `${(i % 7) * 0.09}s`,
              animationPlayState: active ? "running" : "paused",
              opacity: active ? 1 : 0.35,
            }}
          />
        );
      })}
    </div>
  );
}
