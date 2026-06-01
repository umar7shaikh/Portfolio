"use client";
import React from "react";
import { Stage } from "./Stage";
import { SceneCall } from "./SceneCall";
import { SceneActions } from "./SceneActions";
import { SceneAnalytics } from "./SceneAnalytics";

const TIMINGS = {
  call:      [0, 33],
  actions:   [33, 55],
  analytics: [55, 75],
} as const;

export default function PravakDemo() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: "1px solid #2C3A30",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <Stage width={1920} height={1080} duration={75} speed={1.3} background="#16201A" persistKey="pravak-hero">
          <SceneCall      start={TIMINGS.call[0]}      end={TIMINGS.call[1]} />
          <SceneActions   start={TIMINGS.actions[0]}   end={TIMINGS.actions[1]} />
          <SceneAnalytics start={TIMINGS.analytics[0]} end={TIMINGS.analytics[1]} />
        </Stage>
      </div>
    </div>
  );
}
