"use client";
import React from "react";
import { useSprite } from "./Sprite";
import { Easing, clamp, interpolate } from "./easing";

// ── Forest Night theme (lifted from the real Pravak marketing site) ──────────
export const T = {
  paper: "#16201A",
  paperRaised: "#1E2B22",
  paperSunken: "#101814",
  ink: "#E9E2D0",
  inkSoft: "#C6BFAD",
  inkMuted: "#9AA593",
  inkFaint: "#6E776A",
  clay: "#D69A3C",
  clayDeep: "#E7B45F",
  clayTint: "#3A2E1A",
  leaf: "#9DB36F",
  line: "#2C3A30",
  lineStrong: "#3E5043",
  display: "'Fraunces', Georgia, 'Times New Roman', serif",
  sans: "Inter, system-ui, sans-serif",
};

// ── Brand mark ───────────────────────────────────────────────────────────────

export function PravakLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, background: T.clay, borderRadius: size * 0.3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <path d="M3 12h2.4l2-7 4 14 2.4-9 1.8 5H21" stroke={T.paper} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── App shell ────────────────────────────────────────────────────────────────

interface PravakAppProps {
  activeNav?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PravakApp({ activeNav = "Live Calls", title = "Live Calls", subtitle = "PRAVAK · WORKSPACE", children }: PravakAppProps) {
  const navItems = [
    { section: "OVERVIEW", items: [
      { name: "Dashboard", icon: "dashboard" },
      { name: "Live Calls", icon: "phone", live: true },
      { name: "Analytics", icon: "chart" },
    ]},
    { section: "BUILD", items: [
      { name: "Agents", icon: "bot" },
      { name: "Campaigns", icon: "mega" },
      { name: "Phone Numbers", icon: "hash" },
    ]},
    { section: "ACCOUNT", items: [
      { name: "Billing", icon: "card" },
    ]},
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: T.paper, fontFamily: T.sans, color: T.ink }}>
      {/* Sidebar */}
      <div style={{ width: 244, flexShrink: 0, background: T.paperSunken, borderRight: `1px solid ${T.line}`, display: "flex", flexDirection: "column", padding: "22px 0" }}>
        <div style={{ padding: "0 22px 22px", display: "flex", alignItems: "center", gap: 11 }}>
          <PravakLogo size={34} />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 600, color: T.ink, letterSpacing: "-0.02em" }}>Pravak</div>
            <div style={{ fontSize: 11, color: T.inkMuted }}>Voice agents platform</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", color: T.inkFaint, padding: "0 10px 8px" }}>
                {group.section}
              </div>
              {group.items.map((item: any) => {
                const active = item.name === activeNav;
                return (
                  <div key={item.name} style={{
                    position: "relative",
                    display: "flex", alignItems: "center", gap: 11,
                    padding: "9px 12px", borderRadius: 8, marginBottom: 2,
                    background: active ? T.clayTint : "transparent",
                    fontSize: 14, fontWeight: active ? 600 : 500,
                    color: active ? T.clayDeep : T.inkMuted,
                  }}>
                    {active && <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: T.clay }} />}
                    <NavIcon name={item.icon} color={active ? T.clay : T.inkFaint} />
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.live && <span style={{ width: 7, height: 7, borderRadius: 4, background: T.leaf }} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ padding: "12px", borderTop: `1px solid ${T.line}`, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: T.clayTint, border: `1px solid ${T.clay}33`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, color: T.clayDeep }}>U</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Umar</div>
              <div style={{ fontSize: 11, color: T.inkFaint }}>Workspace admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: 64, borderBottom: `1px solid ${T.line}`, background: T.paper, display: "flex", alignItems: "center", padding: "0 28px" }}>
          <div>
            <div style={{ fontFamily: T.display, fontSize: 19, fontWeight: 600, color: T.ink, letterSpacing: "-0.02em" }}>{title}</div>
            <div style={{ fontSize: 11, color: T.inkMuted, letterSpacing: "0.08em" }}>{subtitle}</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 13px", borderRadius: 999, background: T.clayTint, border: `1px solid ${T.leaf}33`, color: T.leaf, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: T.leaf }} /> Agent online
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: T.clay, display: "flex", alignItems: "center", justifyContent: "center", color: T.paper, fontSize: 13, fontWeight: 700 }}>U</div>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden", position: "relative", background: T.paper }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function NavIcon({ name, color }: { name: string; color: string }) {
  const ic: Record<string, React.ReactNode> = {
    dashboard: <path d="M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z" stroke={color} strokeWidth="1.5" />,
    phone: <path d="M5 3h3l1.5 4-2 1.5a10 10 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A14 14 0 013 5a2 2 0 012-2z" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    chart: <path d="M3 17V8M9 17V3M15 17v-7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />,
    bot: <><rect x="4" y="6" width="12" height="9" rx="2" stroke={color} strokeWidth="1.4" /><path d="M10 3v3M7 10h.01M13 10h.01" stroke={color} strokeWidth="1.6" strokeLinecap="round" /></>,
    mega: <path d="M4 9v3l9 4V5L4 9zM4 9H3v3h1M14 7a3 3 0 010 6" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    hash: <path d="M7 3L5 17M15 3l-2 14M3 7h14M3 13h14" stroke={color} strokeWidth="1.4" strokeLinecap="round" />,
    card: <><rect x="3" y="5" width="14" height="11" rx="2" stroke={color} strokeWidth="1.4" /><path d="M3 9h14" stroke={color} strokeWidth="1.4" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none">{ic[name]}</svg>;
}

// ── Caption (kicker + headline), top-left over the scene ──────────────────────

interface CaptionProps {
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
}

export function Caption({ kicker, title, subtitle }: CaptionProps) {
  const { localTime, duration } = useSprite();
  const op = interpolate([0, 0.5, duration - 0.4, duration], [0, 1, 1, 0])(localTime);
  const ty = interpolate([0, 0.5], [12, 0], Easing.easeOutCubic)(localTime);
  return (
    <div style={{ position: "absolute", left: 64, top: 72, zIndex: 10, opacity: op, transform: `translateY(${ty}px)`, width: 560, pointerEvents: "none" }}>
      <div style={{
        display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
        textTransform: "uppercase", color: T.clayDeep,
        background: T.clayTint, padding: "5px 12px", borderRadius: 999,
        marginBottom: 16, border: `1px solid ${T.clay}33`,
      }}>{kicker}</div>
      <div style={{ fontFamily: T.display, fontSize: 56, fontWeight: 600, color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 19, color: T.inkSoft, marginTop: 14, lineHeight: 1.5, maxWidth: 500 }}>{subtitle}</div>
      )}
    </div>
  );
}

// ── Animated voice waveform ────────────────────────────────────────────────────

export function Waveform({ active, color, bars = 40, maxHeight = 120 }: { active: boolean; color: string; bars?: number; maxHeight?: number }) {
  const { localTime } = useSprite();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: maxHeight }}>
      {Array.from({ length: bars }).map((_, i) => {
        const env = 0.4 + 0.6 * Math.abs(Math.sin((i / bars) * Math.PI));
        const wave = (Math.sin(localTime * 9 + i * 0.5) + Math.sin(localTime * 5.3 + i * 0.85)) / 2;
        const h = active ? Math.max(6, ((wave + 1) / 2) * env * maxHeight) : 5;
        return <span key={i} style={{ width: 4, height: h, borderRadius: 4, background: color, opacity: active ? 0.45 + 0.55 * env : 0.22, transition: active ? "none" : "height 0.3s ease" }} />;
      })}
    </div>
  );
}

// ── Generic stat card ─────────────────────────────────────────────────────────

export function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div style={{ background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 11, color: T.inkMuted, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: T.display, fontSize: 28, fontWeight: 600, color: accent ? T.clay : T.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: T.inkFaint, marginTop: 6 }}>{sub}</div>
    </div>
  );
}
