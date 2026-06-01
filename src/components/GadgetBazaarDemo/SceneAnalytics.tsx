"use client";
import React from "react";
import { Sprite, useSprite } from "./Sprite";
import { clamp } from "./easing";
import { AdminChrome, Icon, T, inr } from "./chrome";
import { PRODUCTS } from "./data";

export function SceneAnalytics({ start, end }: { start: number; end: number }) {
  return (
    <Sprite start={start} end={end}>
      <SceneAnalyticsInner />
    </Sprite>
  );
}

function SceneAnalyticsInner() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <AdminChrome activeNav="Dashboard" title="Dashboard">
        <AnalyticsBody />
      </AdminChrome>
    </div>
  );
}

function AnalyticsBody() {
  const { localTime } = useSprite();
  const t1 = clamp(localTime / 1.5, 0, 1);
  const t2 = clamp((localTime - 0.2) / 1.5, 0, 1);
  const t3 = clamp((localTime - 0.4) / 1.5, 0, 1);
  const t4 = clamp((localTime - 0.6) / 1.5, 0, 1);
  const chart = clamp((localTime - 1.2) / 2.5, 0, 1);

  const stats = [
    { label: "Revenue (30d)", value: "₹••••", sub: "▲ trending up", accent: true },
    { label: "Orders", value: "••••", sub: "▲ trending up" },
    { label: "Avg order value", value: "₹••••", sub: "▲ growing" },
    { label: "Conversion", value: "•.•%", sub: "▲ improving" },
  ];

  const weeks = [0.4, 0.5, 0.45, 0.6, 0.7, 0.65, 0.8, 0.78, 0.9, 0.85, 0.95, 1.0];
  const top = [
    { p: PRODUCTS[0], v: 1.0 },
    { p: PRODUCTS[2], v: 0.82 },
    { p: PRODUCTS[5], v: 0.64 },
    { p: PRODUCTS[3], v: 0.5 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", padding: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11.5, color: T.inkMuted, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: T.sans, fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", color: s.accent ? T.brown : T.charcoal, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.green, marginTop: 6, fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        <div style={{ background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.charcoal, marginBottom: 2 }}>Revenue — last 12 weeks</div>
          <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 16 }}>Steady week-on-week growth</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
            {weeks.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", height: `${v * 170 * chart}px`, background: i === weeks.length - 1 ? T.brown : `${T.brown}66`, borderRadius: "5px 5px 0 0", minHeight: 2 }} />
                <span style={{ fontSize: 9, color: T.inkFaint }}>W{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.charcoal, marginBottom: 16 }}>Best sellers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {top.map((row) => (
              <div key={row.p.name}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: row.p.tint, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={row.p.icon} size={16} color={T.charcoal} sw={1.6} /></div>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: T.charcoal, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{row.p.name}</span>
                </div>
                <div style={{ height: 8, background: T.beige, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${row.v * 100 * chart}%`, height: "100%", background: T.brown, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 14 }}>
        {[
          { l: "Free-ship orders", v: "••%" },
          { l: "Repeat buyers", v: "••%" },
          { l: "COD share", v: "••%" },
          { l: "Avg rating", v: "★★★★★" },
        ].map((m) => (
          <div key={m.l} style={{ flex: 1, background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, color: T.inkSoft }}>{m.l}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: T.charcoal }}>{m.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
