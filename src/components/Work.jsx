// src/components/Work.jsx
// Selected work as an explorable 3D island: every project is a building.
// The scene itself is lazy loaded so three.js never blocks the first paint.
import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { projects } from "../data/projects.js";
import "./city/city.css";

const CityScene = lazy(() => import("./city/CityScene.jsx"));

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const useMedia = (q) => {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
};

function Loader({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="city-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <span>Building the island</span>
          <div className="city-loader-bar"><div /></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Panel({ project, index, onClose, onStep }) {
  const navigate = useNavigate();
  return (
    <motion.aside
      key={project.key}
      className="city-panel"
      style={{ "--accent": project.accent }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-live="polite"
    >
      <div className="city-panel-top">
        <span className="city-panel-idx">
          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <button type="button" className="city-icon-btn" onClick={onClose} aria-label="Back to the island">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <p className="city-panel-meta">{project.category} · {project.year}</p>
      <h3 className="city-panel-title">{project.title}</h3>
      <p className="city-panel-role"><span className="city-dot" />{project.role}</p>
      <p className="city-panel-summary">{project.summary}</p>

      <ul className="city-panel-list">
        {project.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>

      <div className="city-panel-stack">
        {project.stack.map((s) => <span key={s}>{s}</span>)}
      </div>

      <div className="city-panel-actions">
        <button type="button" className="city-btn-primary" onClick={() => navigate(`/works?project=${project.id}`)}>
          Case study &amp; demo
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
        {project.link && (
          <a className="city-btn-ghost" href={project.link} target="_blank" rel="noopener noreferrer">Live ↗</a>
        )}
      </div>

      <div className="city-panel-nav">
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous project">← Prev</button>
        <button type="button" onClick={() => onStep(1)} aria-label="Next project">Next →</button>
      </div>
    </motion.aside>
  );
}

function FallbackList() {
  const navigate = useNavigate();
  return (
    <div className="city-fallback">
      {projects.map((p, i) => (
        <button key={p.key} type="button" onClick={() => navigate(`/works?project=${p.id}`)}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          <strong>{p.title}</strong>
          <em>{p.category} · {p.year}</em>
        </button>
      ))}
    </div>
  );
}

const Works = () => {
  const stageRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl] = useState(hasWebGL);
  const [activeKey, setActiveKey] = useState(null);
  const [hoverKey, setHoverKey] = useState(null);
  const [ready, setReady] = useState(false);
  const touch = useMedia("(hover: none), (pointer: coarse)");
  const narrow = useMedia("(max-width: 820px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");

  // Mount the canvas shortly before the section scrolls in, and pause
  // rendering whenever it is off screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "800px 0px" });
    const seen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    near.observe(el);
    seen.observe(el);
    return () => { near.disconnect(); seen.disconnect(); };
  }, []);

  const select = useCallback((key) => setActiveKey(key), []);
  const hover = useCallback((key) => setHoverKey(key), []);

  const index = projects.findIndex((p) => p.key === activeKey);
  const step = useCallback((d) => {
    const i = Math.max(0, projects.findIndex((p) => p.key === activeKey));
    setActiveKey(projects[(i + d + projects.length) % projects.length].key);
  }, [activeKey]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveKey(null);
      if (!activeKey) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, activeKey, step]);

  // Let the custom cursor grow while a building is under the pointer.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cursor-hover", { detail: !!hoverKey }));
  }, [hoverKey]);

  const active = index >= 0 ? projects[index] : null;

  return (
    <section id="works" className="works-city">
      <div className="works-label-bar">
        <span className="works-label">Selected Work</span>
        <div className="works-label-line" />
        <Link to="/works" className="works-view-all-link">View all →</Link>
      </div>

      <div ref={stageRef} className={`city-stage${hoverKey ? " is-hovering" : ""}`}>
        {webgl ? (
          <>
            {mounted && (
              <Suspense fallback={null}>
                <CityScene
                  activeKey={activeKey}
                  hoverKey={hoverKey}
                  onHover={hover}
                  onSelect={select}
                  lowPower={touch || narrow}
                  reduced={reduced}
                  interactive={!touch}
                  visible={visible}
                  panelOpen={!!active}
                  onReady={() => setReady(true)}
                />
              </Suspense>
            )}
            <Loader active={!ready} />

            <AnimatePresence>
              {!active && (
                <motion.div
                  className="city-intro"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="city-intro-kicker">{String(projects.length).padStart(2, "0")} projects · one island</p>
                  <h2 className="city-intro-title">Every building<br />is something I shipped.</h2>
                  <p className="city-intro-hint">
                    {touch ? "Tap a building or a name below" : "Drag to orbit · click a building to step inside"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {active && (
                <Panel
                  key={active.key}
                  project={active}
                  index={index}
                  onClose={() => setActiveKey(null)}
                  onStep={step}
                />
              )}
            </AnimatePresence>

            <nav className="city-chips" aria-label="Projects">
              {projects.map((p, i) => (
                <button
                  key={p.key}
                  type="button"
                  className={activeKey === p.key ? "is-active" : ""}
                  style={{ "--accent": p.accent }}
                  onClick={() => setActiveKey(activeKey === p.key ? null : p.key)}
                  onMouseEnter={() => setHoverKey(p.key)}
                  onMouseLeave={() => setHoverKey(null)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {p.title}
                </button>
              ))}
            </nav>
          </>
        ) : (
          <FallbackList />
        )}
      </div>
    </section>
  );
};

export default Works;
