"use client";
import React from "react";
import { Sprite, LocalSprite, useSprite } from "./Sprite";
import { clamp } from "./easing";
import { PravakApp, T } from "./chrome";

const ALERT = "#C2603F";

export function SceneActions({ start, end }: { start: number; end: number }) {
  return (
    <Sprite start={start} end={end}>
      <SceneActionsInner />
    </Sprite>
  );
}

function SceneActionsInner() {
  const { duration } = useSprite();
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PravakApp activeNav="Campaigns" title="Bookings & Outcomes" subtitle="PRAVAK · OUTCOMES">
        <LocalSprite start={0} end={11}><CallsAndSchedule /></LocalSprite>
        <LocalSprite start={11} end={duration}><Capabilities /></LocalSprite>
      </PravakApp>
    </div>
  );
}

// ── Recent calls + today's schedule ───────────────────────────────────────────

function CallsAndSchedule() {
  const { localTime } = useSprite();
  const stagger = (i: number) => clamp((localTime - 0.4 - i * 0.45) / 0.5, 0, 1);

  const calls = [
    { who: "Aarav Mehta", num: "+91 ••••• •••••", outcome: "Booked", detail: "Cleaning · Fri 11:00 AM", color: T.leaf },
    { who: "Priya N.",    num: "+91 ••••• •••••", outcome: "Qualified", detail: "Implant consult · hot lead", color: T.clay },
    { who: "Unknown",     num: "+91 ••••• •••••", outcome: "Transferred", detail: "Billing query · to reception", color: ALERT },
    { who: "Rohit S.",    num: "+91 ••••• •••••", outcome: "Message", detail: "Asked Sunday hours · noted", color: T.inkMuted },
    { who: "Meera K.",    num: "+91 ••••• •••••", outcome: "Booked", detail: "Whitening · Wed 4:00 PM", color: T.leaf },
  ];

  const slots = [
    { time: "10:00", label: "Dr. Rao · Checkup", filled: false },
    { time: "11:00", label: "Aarav Mehta · Cleaning", filled: true, at: 1.0 },
    { time: "12:30", label: "—", filled: false },
    { time: "16:00", label: "Meera K. · Whitening", filled: true, at: 2.4 },
    { time: "17:30", label: "—", filled: false },
  ];

  return (
    <div style={{ padding: 28, height: "100%", display: "flex", gap: 18 }}>
      {/* recent AI calls */}
      <div style={{ flex: 1.3, background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Calls handled by Pravak</div>
          <div style={{ fontSize: 11, color: T.inkMuted }}>Today · live</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {calls.map((c, i) => {
            const op = stagger(i);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: `1px solid ${T.line}`, borderRadius: 10, background: T.paperSunken, opacity: op, transform: `translateX(${(1 - op) * 18}px)` }}>
                <div style={{ width: 38, height: 38, borderRadius: 19, background: T.clayTint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 3h3l1.5 4-2 1.5a10 10 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A14 14 0 013 5a2 2 0 012-2z" stroke={T.clay} strokeWidth="1.5" fill="none" /></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{c.who} <span style={{ color: T.inkFaint, fontWeight: 400, fontSize: 12 }}>· {c.num}</span></div>
                  <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>{c.detail}</div>
                </div>
                <span style={{ padding: "5px 11px", borderRadius: 999, background: `${c.color}22`, color: c.color, fontSize: 12, fontWeight: 700, border: `1px solid ${c.color}44` }}>{c.outcome}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* today's schedule */}
      <div style={{ flex: 1, background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: T.ink }}>Today's schedule</div>
        <div style={{ fontSize: 11, color: T.inkMuted, marginBottom: 14 }}>Auto-filled by Pravak</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {slots.map((s, i) => {
            const justBooked = s.filled && localTime >= (s.at || 0);
            const flash = justBooked ? clamp(1 - (localTime - (s.at || 0)) / 1.2, 0, 1) : 0;
            return (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: T.inkFaint, width: 46 }}>{s.time}</div>
                <div style={{ flex: 1, padding: "11px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: s.filled ? T.clayTint : T.paperSunken,
                  border: `1px solid ${s.filled ? `${T.clay}44` : T.line}`,
                  color: s.filled ? T.ink : T.inkFaint,
                  boxShadow: flash > 0 ? `0 0 ${flash * 16}px ${T.clay}66` : "none" }}>
                  {s.label}
                  {justBooked && <span style={{ float: "right", color: T.clayDeep, fontSize: 11 }}>● new</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Capabilities + integrations ───────────────────────────────────────────────

function Capabilities() {
  const { localTime } = useSprite();
  const stagger = (i: number) => clamp((localTime - 0.4 - i * 0.3) / 0.5, 0, 1);

  const caps = [
    { icon: "📅", title: "Books & reschedules", desc: "Checks live availability and confirms instantly." },
    { icon: "🎯", title: "Qualifies leads", desc: "Asks the right questions, scores intent, tags hot leads." },
    { icon: "💬", title: "Answers FAQs", desc: "Hours, pricing, directions — trained on your business." },
    { icon: "🔀", title: "Routes to a human", desc: "Warm-transfers edge cases with full context." },
    { icon: "📤", title: "Outbound campaigns", desc: "Bulk-dials follow-ups and confirms reminders." },
    { icon: "🌐", title: "11+ Indian languages", desc: "Hindi, English & code-switching, naturally." },
  ];

  const integrations = [
    { label: "Google Calendar", glyph: "📆" },
    { label: "WhatsApp", glyph: "🟢" },
    { label: "Plivo", glyph: "📡" },
    { label: "Razorpay", glyph: "💳" },
    { label: "HubSpot", glyph: "🧲" },
    { label: "Sheets", glyph: "📊" },
  ];

  return (
    <div style={{ padding: 28, height: "100%", overflow: "hidden" }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: T.ink, fontFamily: T.display, letterSpacing: "-0.02em" }}>What Pravak can do on a call</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 }}>
        {caps.map((c, i) => {
          const op = stagger(i);
          return (
            <div key={i} style={{ background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 12, padding: 16, opacity: op, transform: `translateY(${(1 - op) * 16}px) scale(${0.96 + 0.04 * op})` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.clayTint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12.5, color: T.inkMuted, lineHeight: 1.45 }}>{c.desc}</div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: T.inkMuted, marginBottom: 12 }}>CONNECTS WITH</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {integrations.map((it, i) => {
          const op = stagger(i + 6);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 16px", borderRadius: 999, background: T.paperRaised, border: `1px solid ${T.line}`, fontSize: 14, fontWeight: 600, color: T.ink, opacity: op, transform: `scale(${0.9 + 0.1 * op})` }}>
              <span style={{ fontSize: 16 }}>{it.glyph}</span>{it.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
