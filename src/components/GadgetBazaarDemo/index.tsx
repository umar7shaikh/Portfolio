"use client";
import React from "react";
import { Stage } from "./Stage";
import { SceneStore } from "./SceneStore";
import { SceneProduct } from "./SceneProduct";
import { SceneCheckout } from "./SceneCheckout";
import { SceneAdmin } from "./SceneAdmin";
import { SceneAnalytics } from "./SceneAnalytics";

const TIMINGS = {
  store:     [0, 16],
  product:   [16, 36],
  checkout:  [36, 56],
  admin:     [56, 73],
  analytics: [73, 90],
} as const;

export default function GadgetBazaarDemo() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: "1px solid #E2DAD0",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <Stage width={1920} height={1080} duration={90} speed={1.3} background="#EDE8DF" persistKey="gadgetbazaar-hero">
          <SceneStore     start={TIMINGS.store[0]}     end={TIMINGS.store[1]} />
          <SceneProduct   start={TIMINGS.product[0]}   end={TIMINGS.product[1]} />
          <SceneCheckout  start={TIMINGS.checkout[0]}  end={TIMINGS.checkout[1]} />
          <SceneAdmin     start={TIMINGS.admin[0]}     end={TIMINGS.admin[1]} />
          <SceneAnalytics start={TIMINGS.analytics[0]} end={TIMINGS.analytics[1]} />
        </Stage>
      </div>
    </div>
  );
}
