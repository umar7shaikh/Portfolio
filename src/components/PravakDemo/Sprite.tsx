"use client";
import React from "react";

export interface TimelineCtx {
  time: number;
  duration: number;
  playing: boolean;
  setTime: (t: number) => void;
  setPlaying: (p: boolean) => void;
}

export const TimelineContext = React.createContext<TimelineCtx>({
  time: 0, duration: 10, playing: false,
  setTime: () => {}, setPlaying: () => {},
});

export const useTimeline = () => React.useContext(TimelineContext);
export const useTime = () => useTimeline().time;

export interface SpriteCtx {
  localTime: number;
  progress: number;
  duration: number;
  visible: boolean;
}

export const SpriteContext = React.createContext<SpriteCtx>({
  localTime: 0, progress: 0, duration: 0, visible: false,
});

export const useSprite = () => React.useContext(SpriteContext);

interface SpriteProps {
  start?: number;
  end?: number;
  keepMounted?: boolean;
  children: React.ReactNode | ((ctx: SpriteCtx) => React.ReactNode);
}

export function Sprite({ start = 0, end = Infinity, keepMounted = false, children }: SpriteProps) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration)
    ? Math.max(0, Math.min(1, localTime / duration)) : 0;

  const value: SpriteCtx = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </SpriteContext.Provider>
  );
}

export function LocalSprite({ start = 0, end = Infinity, keepMounted = false, children }: SpriteProps) {
  const parent = React.useContext(SpriteContext);
  const visible = parent.localTime >= start && parent.localTime <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const lt = Math.max(0, parent.localTime - start);
  const progress = duration > 0 && isFinite(duration)
    ? Math.max(0, Math.min(1, lt / duration)) : 0;

  const value: SpriteCtx = { localTime: lt, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </SpriteContext.Provider>
  );
}
