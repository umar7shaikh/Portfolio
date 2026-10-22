// Guided, clickable product tours used by every project demo.
//
// A tour is a list of chapters. Each chapter has a Screen component and a list
// of beats; the tour advances one beat at a time on a timer. A beat can point
// the guide cursor at any element inside the screen tagged with
// data-tour="<target>" and "click" it. Visitors can click the same controls
// themselves: screens call act(target), which jumps to the matching beat and
// pauses autoplay for a few seconds so the visitor stays in control.
//
// Beats come in pairs for interactions: { target } moves the cursor onto the
// control, then { target, click: true } presses it. Screens apply a click's
// effect once `beat` reaches that click beat.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./tour.css";

const DESIGN = { wide: { w: 920, h: 580 }, compact: { w: 400, h: 600 } };
const HOLD_MS = 7000;

function useWidth(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    setW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function Cursor({ pos, clickKey }) {
  return (
    <motion.div
      className="pt-cursor"
      initial={false}
      animate={{ x: pos.x, y: pos.y, opacity: pos.show ? 1 : 0 }}
      transition={{ x: { type: "spring", stiffness: 90, damping: 18 }, y: { type: "spring", stiffness: 90, damping: 18 }, opacity: { duration: 0.3 } }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M4 2.5l15 9.2-6.6 1.5 3.7 7.1-2.7 1.4-3.7-7.1L4.8 19z" fill="#fff" stroke="#0b0d12" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      {clickKey > 0 && <span key={clickKey} className="pt-cursor-ripple" />}
    </motion.div>
  );
}

export default function ProductTour({ url, chapters, theme, badge }) {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const width = useWidth(wrapRef);
  const compact = width > 0 && width < 640;
  const design = compact ? DESIGN.compact : DESIGN.wide;
  const scale = width ? width / design.w : 1;

  const [chapter, setChapter] = useState(0);
  const [beat, setBeat] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holdUntil, setHoldUntil] = useState(0);
  const [visible, setVisible] = useState(false);
  const [cursor, setCursor] = useState({ x: design.w * 0.7, y: design.h * 0.8, show: false });
  const [clickKey, setClickKey] = useState(0);

  const ch = chapters[chapter];
  const beats = useMemo(() => ch.beats.flat(), [ch]);
  const current = beats[beat] || {};

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const holding = holdUntil > 0;
  useEffect(() => {
    if (!holding) return;
    const id = setTimeout(() => setHoldUntil(0), Math.max(0, holdUntil - Date.now()));
    return () => clearTimeout(id);
  }, [holding, holdUntil]);

  const goChapter = useCallback((i, byUser) => {
    setChapter(i);
    setBeat(0);
    if (byUser) setHoldUntil(Date.now() + HOLD_MS);
  }, []);

  // Autoplay
  const running = visible && !paused && !holding;
  const next = beats[beat + 1];
  const delay = next ? next.at : ch.tail ?? 3200;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      if (next) setBeat((b) => b + 1);
      else goChapter((chapter + 1) % chapters.length, false);
    }, delay);
    return () => clearTimeout(id);
  }, [running, beat, chapter, delay, next, chapters.length, goChapter]);

  // Screens call act(target) when the visitor clicks a tour control.
  const act = useCallback((target) => {
    const i = beats.findIndex((b, k) => k > beat && b.target === target && b.click);
    if (i >= 0) setBeat(i);
    setHoldUntil(Date.now() + HOLD_MS);
  }, [beats, beat]);

  // Move the guide cursor onto the beat's target element.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!current.target) {
      setCursor((c) => ({ ...c, show: false }));
      return;
    }
    // The target may still be animating in after a chapter change, so retry.
    let tries = 0;
    let id;
    const place = () => {
      const el = stage.querySelector(`[data-tour="${current.target}"]`);
      if (!el) {
        if (tries++ < 6) id = setTimeout(place, 150);
        else setCursor((c) => ({ ...c, show: false }));
        return;
      }
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setCursor({
        x: (r.left - s.left + r.width * 0.5) / scale - 4,
        y: (r.top - s.top + r.height * 0.55) / scale - 3,
        show: true,
      });
    };
    id = setTimeout(place, 16);
    return () => clearTimeout(id);
  }, [current.target, chapter, beat, scale, compact]);

  // Click ripple shortly after the cursor arrives. The beat's effect is already
  // rendered by the screen; the ripple just sells the interaction.
  useEffect(() => {
    if (!current.click) return;
    const id = setTimeout(() => setClickKey((k) => k + 1), 80);
    return () => clearTimeout(id);
  }, [current.click, beat, chapter]);

  const Screen = ch.Screen;
  // has(x): x was clicked (or a beat with id x reached) at or before this beat.
  const reached = beats.slice(0, beat + 1);
  const has = (x) => reached.some((b) => b.id === x || (b.click && b.target === x));
  // last(a, b, ...): whichever of these was clicked most recently.
  const last = (...xs) => {
    for (let i = reached.length - 1; i >= 0; i--) {
      const b = reached[i];
      if (b.click && xs.includes(b.target)) return b.target;
    }
    return null;
  };
  const caption = current.say || ch.caption;
  const progressFrom = beat / beats.length;
  const progressTo = (beat + 1) / beats.length;

  return (
    <div className="pt" style={theme} ref={wrapRef}>
      <div className="pt-window">
        <div className="pt-chrome">
          <span className="pt-dots"><i /><i /><i /></span>
          <span className="pt-url">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
            {url}
          </span>
          {badge && <span className="pt-badge">{badge}</span>}
        </div>
        <div
          className="pt-viewport"
          style={{ height: width ? design.h * scale : undefined, aspectRatio: width ? undefined : `${design.w} / ${design.h}` }}
          onPointerEnter={(e) => e.pointerType === "mouse" && setCursor((c) => ({ ...c, show: false }))}
        >
          <div
            ref={stageRef}
            className="pt-stage"
            style={{ width: design.w, height: design.h, transform: `scale(${scale})` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${chapter}-${compact}`}
                className="pt-screen"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <Screen beat={beat} act={act} has={has} last={last} compact={compact} />
              </motion.div>
            </AnimatePresence>
            <Cursor pos={cursor} clickKey={clickKey} />
          </div>
        </div>
      </div>

      <div className="pt-controls">
        <div className="pt-chapters" role="tablist">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              type="button"
              role="tab"
              aria-selected={i === chapter}
              className={i === chapter ? "is-active" : ""}
              onClick={() => goChapter(i, true)}
            >
              <span className="pt-chapter-label">
                <em>{String(i + 1).padStart(2, "0")}</em>
                {c.title}
              </span>
              <span className="pt-chapter-track">
                {i < chapter && <span className="pt-chapter-fill" style={{ width: "100%" }} />}
                {i === chapter && (
                  <motion.span
                    key={`${beat}-${running}`}
                    className="pt-chapter-fill"
                    initial={{ width: `${progressFrom * 100}%` }}
                    animate={{ width: `${(running ? progressTo : progressFrom) * 100}%` }}
                    transition={{ duration: running ? delay / 1000 : 0.2, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="pt-play"
          onClick={() => { setPaused((p) => !p); setHoldUntil(0); }}
          aria-label={paused ? "Play tour" : "Pause tour"}
        >
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={caption}
          className="pt-caption"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="pt-caption-dot" />
          {caption}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
