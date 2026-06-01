"use client";
import React from "react";
import { Sprite, useSprite } from "./Sprite";
import { clamp } from "./easing";
import { PravakApp, StatCard, T } from "./chrome";

const ALERT = "#C2603F";

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
      <PravakApp activeNav="Analytics" title="Analytics" subtitle="PRAVAK · LAST 30 DAYS">
        <AnalyticsBody />
      </PravakApp>
    </div>
  );
}

function AnalyticsBody() {
  const { localTime } = useSprite();
  const t1 = clamp(localTime / 1.5, 0, 1);
  const t2 = clamp((localTime - 0.2) / 1.5, 0, 1);
  const t3 = clamp((localTime - 0.4) / 1.5, 0, 1);
  const t4 = clamp((localTime - 0.6) / 1.5, 0, 1);
  const chartProg = clamp((localTime - 1.2) / 2.5, 0, 1);

  return (
    <div style={{ padding: 28, height: "100%", overflow: "hidden" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: T.ink }}>Call performance</div>
        <div style={{ fontSize: 12, color: T.inkMuted }}>How Pravak performed across every inbound and outbound call</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <StatCard label="Calls handled" value="••••" sub="every call answered" accent />
        <StatCard label="Answer rate" value={`${(100 * t2).toFixed(0)}%`} sub="vs missed before" />
        <StatCard label="Bookings made" value="••••" sub="of all calls" />
        <StatCard label="Avg handle time" value="•• s" sub="faster than a human" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: T.ink }}>Calls by hour — answered round the clock</div>
          <HourBars progress={chartProg} />
        </div>
        <div style={{ background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: T.ink }}>Call outcomes</div>
          <Outcomes progress={chartProg} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: T.paper, border: `1px solid ${T.lineStrong}`, borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: T.display, fontSize: 52, fontWeight: 600, color: T.leaf, lineHeight: 1 }}>0</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Missed calls</div>
            <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 2 }}>Every caller reached a live agent — even after hours and on holidays.</div>
          </div>
        </div>
        <div style={{ background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: T.display, fontSize: 52, fontWeight: 600, color: T.clay, lineHeight: 1 }}>{`${(96 * clamp((localTime - 1) / 2, 0, 1)).toFixed(0)}%`}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Caller satisfaction</div>
            <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 2 }}>Rated helpful by callers after the call — consistent, never tired.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HourBars({ progress }: { progress: number }) {
  const vals = [3, 2, 1, 1, 2, 4, 9, 16, 22, 26, 30, 28, 24, 27, 31, 29, 25, 21, 18, 14, 11, 8, 6, 4];
  const max = Math.max(...vals);
  return (
    <div style={{ height: 180 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 150 }}>
        {vals.map((v, i) => {
          const afterHours = i < 8 || i >= 20;
          return <div key={i} style={{ flex: 1, height: `${(v / max) * 100 * progress}%`, background: afterHours ? T.leaf : T.clay, borderRadius: "3px 3px 0 0", minHeight: 2 }} />;
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: T.inkFaint }}>
        <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: T.inkMuted }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: T.clay }} /> Business hours</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: T.leaf }} /> After hours</span>
      </div>
    </div>
  );
}

function Outcomes({ progress }: { progress: number }) {
  const data = [
    { l: "Booked", v: 0.32, n: "•••", c: T.leaf },
    { l: "Qualified lead", v: 0.27, n: "•••", c: T.clay },
    { l: "Answered / info", v: 0.29, n: "•••", c: T.clayDeep },
    { l: "Transferred", v: 0.08, n: "••", c: ALERT },
    { l: "Message taken", v: 0.04, n: "••", c: T.inkMuted },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: T.inkSoft, fontWeight: 600 }}>{d.l}</span>
            <span style={{ color: T.inkFaint }}>{d.n}</span>
          </div>
          <div style={{ height: 12, background: T.paperSunken, borderRadius: 6, overflow: "hidden", border: `1px solid ${T.line}` }}>
            <div style={{ width: `${(d.v * 100 * progress) / 0.32}%`, maxWidth: "100%", height: "100%", background: d.c, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
