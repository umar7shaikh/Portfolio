"use client";
import React from "react";
import { Sprite, useSprite } from "./Sprite";
import { Easing, clamp } from "./easing";
import { PravakApp, Waveform, T } from "./chrome";

interface Turn { t: number; dur: number; who: "ai" | "caller"; text: string; }

const TURNS: Turn[] = [
  { t: 1.0,  dur: 3.0, who: "ai",     text: "Thanks for calling BrightSmile Dental — this is Pravak. How can I help you today?" },
  { t: 4.6,  dur: 2.2, who: "caller", text: "Hi, I'd like to book a teeth cleaning sometime this week." },
  { t: 7.2,  dur: 3.0, who: "ai",     text: "Of course. I have Wednesday at 4 PM or Friday at 11 AM open — which works better?" },
  { t: 10.8, dur: 1.8, who: "caller", text: "Friday at 11 is perfect." },
  { t: 13.0, dur: 2.4, who: "ai",     text: "Great — can I get your name and a number to confirm?" },
  { t: 15.8, dur: 2.0, who: "caller", text: "Aarav Mehta, nine eight two double-zero, four one one two two." },
  { t: 18.2, dur: 3.2, who: "ai",     text: "All set, Aarav. You're booked for Friday 11 AM. I've sent a confirmation by SMS." },
  { t: 21.8, dur: 1.4, who: "caller", text: "Perfect, thank you!" },
  { t: 23.6, dur: 2.4, who: "ai",     text: "Happy to help. See you Friday — have a great day!" },
];

const CONNECT_AT = 0.6;
const CALL_END_AT = 26.5;

export function SceneCall({ start, end }: { start: number; end: number }) {
  return (
    <Sprite start={start} end={end}>
      <SceneCallInner />
    </Sprite>
  );
}

function SceneCallInner() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PravakApp activeNav="Live Calls" title="Live Calls" subtitle="PRAVAK · INBOUND">
        <CallWorkspace />
      </PravakApp>
    </div>
  );
}

function CallWorkspace() {
  const { localTime } = useSprite();
  const t = localTime;
  const connected = t >= CONNECT_AT;
  const callLive = connected && t < CALL_END_AT;

  const elapsed = Math.max(0, t - CONNECT_AT);
  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(Math.floor(elapsed % 60)).padStart(2, "0")}`;

  const visible = TURNS.filter((tn) => t >= tn.t);
  const speaking = callLive ? (TURNS.find((tn) => t >= tn.t && t < tn.t + tn.dur)?.who ?? null) : null;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", padding: 24, gap: 20, background: T.paper }}>
      {/* Main call card */}
      <div style={{ flex: 1.6, display: "flex", flexDirection: "column", background: T.paperSunken, borderRadius: 16, overflow: "hidden", border: `1px solid ${T.line}` }}>
        {/* call header */}
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${T.line}` }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: T.clayTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 3h3l1.5 4-2 1.5a10 10 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A14 14 0 013 5a2 2 0 012-2z" stroke={T.clay} strokeWidth="1.6" fill="none" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: T.ink, fontSize: 18, fontWeight: 600 }}>Inbound · +91 ••••• •••••</div>
            <div style={{ color: T.inkMuted, fontSize: 13 }}>BrightSmile Dental · Mumbai line</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 14px", borderRadius: 999, background: T.clayTint, color: callLive ? T.leaf : T.inkMuted, fontSize: 13, fontWeight: 600, border: `1px solid ${callLive ? T.leaf : T.inkFaint}33` }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: callLive ? T.leaf : T.inkFaint }} />
            {connected ? (callLive ? `Live · ${mmss}` : `Ended · ${mmss}`) : "Ringing…"}
          </div>
        </div>

        {/* orb + waveform */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 30px", minHeight: 0 }}>
          <CallOrb speaking={speaking} connected={connected} />
          <div style={{ width: "100%", maxWidth: 560, marginTop: 18 }}>
            <Waveform active={!!speaking} color={speaking === "caller" ? T.leaf : T.clay} bars={48} maxHeight={92} />
          </div>
          <div style={{ marginTop: 10, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: T.inkFaint, height: 18 }}>
            {!connected ? "Connecting" : speaking === "ai" ? "Pravak speaking" : speaking === "caller" ? "Caller speaking" : callLive ? "Listening" : "Call summary"}
          </div>
        </div>

        {/* transcript */}
        <div style={{ height: "42%", borderTop: `1px solid ${T.line}`, padding: "16px 24px", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", gap: 12 }}>
          {visible.map((tn, i) => <TranscriptLine key={i} turn={tn} />)}
        </div>
      </div>

      {/* Intelligence side panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
        <SidePanelHeader />
        <IntentCard show={localTime >= 5.0} />
        <EntitiesCard />
        <SentimentCard show={localTime >= 8} />
        <ActionStrip show={localTime >= 19} />
      </div>
    </div>
  );
}

function CallOrb({ speaking, connected }: { speaking: "ai" | "caller" | null; connected: boolean }) {
  const { localTime } = useSprite();
  const pulse = speaking ? 1 + 0.06 * Math.sin(localTime * 10) : 1;
  const ringColor = speaking === "caller" ? T.leaf : T.clay;
  return (
    <div style={{ position: "relative", width: 132, height: 132, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {speaking && [0, 1].map((r) => {
        const p = ((localTime * 0.8 + r * 0.5) % 1);
        return <span key={r} style={{ position: "absolute", width: 90 + p * 70, height: 90 + p * 70, borderRadius: "50%", border: `2px solid ${ringColor}`, opacity: (1 - p) * 0.5 }} />;
      })}
      <div style={{ width: 92, height: 92, borderRadius: "50%", background: `linear-gradient(135deg, ${T.clayDeep}, ${T.clay})`, transform: `scale(${pulse})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${T.clay}66`, opacity: connected ? 1 : 0.6 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.paper} strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
        </svg>
      </div>
    </div>
  );
}

function TranscriptLine({ turn }: { turn: Turn }) {
  const { localTime } = useSprite();
  const age = localTime - turn.t;
  const enter = Easing.easeOutCubic(clamp(age / 0.35, 0, 1));
  const ai = turn.who === "ai";
  return (
    <div style={{ display: "flex", justifyContent: ai ? "flex-start" : "flex-end", opacity: enter, transform: `translateY(${(1 - enter) * 10}px)` }}>
      <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: 14, fontSize: 17, lineHeight: 1.4, color: T.ink, background: ai ? T.clayTint : T.paperRaised, border: `1px solid ${ai ? `${T.clay}44` : T.line}`, borderTopLeftRadius: ai ? 3 : 14, borderTopRightRadius: ai ? 14 : 3 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ai ? T.clayDeep : T.leaf, marginBottom: 4 }}>{ai ? "Pravak AI" : "Caller"}</div>
        {turn.text}
      </div>
    </div>
  );
}

function Card({ children, show = true }: { children: React.ReactNode; show?: boolean }) {
  return (
    <div style={{ background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 14, padding: 16, opacity: show ? 1 : 0.45, transition: "opacity 0.3s", flexShrink: 0 }}>
      {children}
    </div>
  );
}

function SidePanelHeader() {
  const { localTime } = useSprite();
  const nameShown = localTime >= 15.8;
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: nameShown ? T.clay : T.line, color: nameShown ? T.paper : T.inkMuted, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, transition: "background 0.4s" }}>
          {nameShown ? "AM" : "?"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{nameShown ? "Aarav Mehta" : "Identifying caller…"}</div>
          <div style={{ fontSize: 12, color: T.inkMuted }}>{nameShown ? "+91 ••••• ••••• · New patient" : "+91 ••••• •••••"}</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.clayDeep, padding: "4px 9px", borderRadius: 999, background: T.clayTint }}>LIVE</div>
      </div>
    </Card>
  );
}

function IntentCard({ show }: { show: boolean }) {
  return (
    <Card show={show}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: T.inkMuted, marginBottom: 8 }}>DETECTED INTENT</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: T.clayTint, color: T.clay, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 4h14v9H8l-4 3v-3H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Book appointment</div>
          <div style={{ fontSize: 12, color: T.inkMuted }}>Confidence 98%</div>
        </div>
        <span style={{ color: T.leaf, fontSize: 18 }}>✓</span>
      </div>
    </Card>
  );
}

function EntitiesCard() {
  const { localTime } = useSprite();
  const rows = [
    { label: "Service", value: "Teeth cleaning", at: 5.0, icon: "🦷" },
    { label: "Preferred time", value: "Friday · 11:00 AM", at: 11.2, icon: "🗓" },
    { label: "Name", value: "Aarav Mehta", at: 16.2, icon: "👤" },
    { label: "Phone", value: "+91 ••••• •••••", at: 16.6, icon: "📞" },
  ];
  return (
    <Card>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: T.inkMuted, marginBottom: 10 }}>EXTRACTED DETAILS</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {rows.map((r, i) => {
          const filled = localTime >= r.at;
          const op = clamp((localTime - r.at) / 0.4, 0, 1);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center", filter: filled ? "none" : "grayscale(1)", opacity: filled ? 1 : 0.4 }}>{r.icon}</span>
              <span style={{ fontSize: 13, color: T.inkMuted, width: 110 }}>{r.label}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: filled ? T.ink : T.inkFaint, opacity: filled ? op : 1 }}>
                {filled ? r.value : "— — —"}
              </span>
              {filled && <span style={{ color: T.leaf, fontSize: 13, opacity: op }}>✓</span>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function SentimentCard({ show }: { show: boolean }) {
  const { localTime } = useSprite();
  const score = clamp((localTime - 8) / 12, 0, 1) * 0.86 + 0.1;
  return (
    <Card show={show}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: T.inkMuted }}>CALLER SENTIMENT</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.leaf }}>Positive</div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: T.paperSunken, overflow: "hidden", border: `1px solid ${T.line}` }}>
        <div style={{ width: `${score * 100}%`, height: "100%", background: T.leaf, borderRadius: 4 }} />
      </div>
    </Card>
  );
}

function ActionStrip({ show }: { show: boolean }) {
  const { localTime } = useSprite();
  const actions = [
    { label: "Calendar slot held", at: 19.5 },
    { label: "SMS confirmation sent", at: 20.5 },
    { label: "Synced to CRM", at: 21.5 },
  ];
  return (
    <Card show={show}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: T.inkMuted, marginBottom: 10 }}>ACTIONS TAKEN</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {actions.map((a, i) => {
          const done = localTime >= a.at;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: done ? 1 : 0.4 }}>
              <span style={{ width: 20, height: 20, borderRadius: 10, background: done ? T.leaf : T.line, color: T.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{done ? "✓" : ""}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: done ? T.ink : T.inkFaint }}>{a.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
