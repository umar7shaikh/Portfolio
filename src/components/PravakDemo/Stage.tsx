"use client";
import React from "react";
import { TimelineContext } from "./Sprite";
import { clamp } from "./easing";

interface StageProps {
  width?: number;
  height?: number;
  duration?: number;
  background?: string;
  loop?: boolean;
  autoplay?: boolean;
  persistKey?: string;
  speed?: number;
  children: React.ReactNode;
}

export function Stage({
  width = 1920,
  height = 1080,
  duration = 102,
  background = "#f8fafc",
  loop = true,
  autoplay = true,
  persistKey = "motoriq-demo",
  speed = 1.3,
  children,
}: StageProps) {
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ":t") || "0");
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [vizScale, setVizScale] = React.useState(1);

  const stageRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    try { localStorage.setItem(persistKey + ":t", String(time)); } catch {}
  }, [time, persistKey]);

  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const s = Math.min(el.clientWidth / width, el.clientHeight / height);
      setVizScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [width, height]);

  React.useEffect(() => {
    if (!playing) { lastTsRef.current = null; return; }
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt * speed;
        if (next >= duration) {
          if (loop) next = next % duration;
          else { next = duration; setPlaying(false); }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop, speed]);

  // Global keyboard controls (Space / arrows) intentionally omitted in the
  // portfolio embed so the demo never hijacks page scrolling.

  const ctxValue = React.useMemo(
    () => ({ time, duration, playing, setTime, setPlaying }),
    [time, duration, playing],
  );

  return (
    <div ref={stageRef} style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center",
      background: "#101814", fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{
        flex: 1, width: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", minHeight: 0,
      }}>
        <div style={{
          width, height, background,
          position: "relative",
          transform: `scale(${vizScale})`,
          transformOrigin: "center",
          flexShrink: 0,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}>
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>

    </div>
  );
}

