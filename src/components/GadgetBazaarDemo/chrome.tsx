"use client";
import React from "react";
import { useSprite } from "./Sprite";
import { Easing, clamp, interpolate } from "./easing";

// ── Theme (lifted from the real GadgetBazaar store) ──────────────────────────
export const T = {
  beige: "#F9F6F1",
  beigeDark: "#EDE8DF",
  beigeBorder: "#E2DAD0",
  card: "#FFFFFF",
  brown: "#8B6F47",
  brownDeep: "#6F5836",
  brownTint: "#F1EBE1",
  charcoal: "#1C1917",
  inkSoft: "#57534E",
  inkMuted: "#78716C",
  inkFaint: "#A8A29E",
  red: "#EF4444",
  orange: "#F97316",
  green: "#16A34A",
  star: "#E6A817",
  sans: "'Geist', Inter, system-ui, sans-serif",
};

// Amounts are intentionally masked in the demo — no real figures shown.
export const inr = (_n: number) => "₹••••";

// ── Icon set (line icons; no emoji) ───────────────────────────────────────────
const FILL_ICONS: Record<string, React.ReactNode> = {
  charger: <path d="M13 2L5 13h5l-1 9 8-11h-5l1-9z" />,
  star: <path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17.9 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8L12 3z" />,
};
const STROKE_ICONS: Record<string, React.ReactNode> = {
  earbuds: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13.5" width="4.2" height="6.5" rx="2" /><rect x="17.3" y="13.5" width="4.2" height="6.5" rx="2" /></>,
  case: <><rect x="6" y="2.5" width="12" height="19" rx="2.6" /><path d="M10 18.5h4" /></>,
  powerbank: <><rect x="3" y="7" width="15" height="10" rx="2" /><path d="M21 10.5v3" /><path d="M9.5 9.5L8 12.2h2L8.6 15" /></>,
  screen: <><path d="M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6l7-3z" /><path d="M9 11.8l2.2 2.2L15 10" /></>,
  speaker: <><rect x="6" y="2.5" width="12" height="19" rx="2.6" /><circle cx="12" cy="15" r="3.4" /><circle cx="12" cy="6.5" r="1" /></>,
  watch: <><rect x="7.5" y="7.5" width="9" height="9" rx="2.4" /><path d="M9.8 7.5l.4-3.5h3.6l.4 3.5M9.8 16.5l.4 3.5h3.6l.4-3.5" /></>,
  gamepad: <><rect x="2.5" y="7.5" width="19" height="9" rx="4.5" /><path d="M7 11h3.5M8.75 9.25v3.5" /><circle cx="15.5" cy="11" r="0.6" fill="currentColor" /><circle cx="17.7" cy="13" r="0.6" fill="currentColor" /></>,
  truck: <><rect x="1.5" y="6" width="12" height="9" rx="1.2" /><path d="M13.5 9h3.6l3 3v3h-6.6z" /><circle cx="5.8" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></>,
  returns: <><path d="M4 10a8 8 0 1 1-1.2 4.2" /><path d="M3.5 4.5V10H9" /></>,
  lock: <><rect x="4.5" y="10" width="15" height="10.5" rx="2.2" /><path d="M8 10V7.2a4 4 0 0 1 8 0V10" /></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="2.2" /><path d="M2.5 9.5h19" /></>,
  cash: <><rect x="2.5" y="6.5" width="19" height="11" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" /></>,
  box: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4.2 7.7l7.8 4.4 7.8-4.4M12 12.1V21" /></>,
};

export function Icon({ name, size = 24, color = "currentColor", sw = 1.6 }: { name: string; size?: number; color?: string; sw?: number }) {
  if (FILL_ICONS[name]) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>{FILL_ICONS[name]}</svg>;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {STROKE_ICONS[name]}
    </svg>
  );
}

// ── Stars row ─────────────────────────────────────────────────────────────────
export function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} color={i < Math.round(rating) ? T.star : T.beigeBorder} />
      ))}
    </span>
  );
}

// ── Caption (kicker + headline) over the scene ────────────────────────────────
export function Caption({ kicker, title, subtitle }: { kicker: string; title: React.ReactNode; subtitle?: string }) {
  const { localTime, duration } = useSprite();
  const op = interpolate([0, 0.5, duration - 0.4, duration], [0, 1, 1, 0])(localTime);
  const ty = interpolate([0, 0.5], [12, 0], Easing.easeOutCubic)(localTime);
  return (
    <div style={{ position: "absolute", left: 64, top: 72, zIndex: 10, opacity: op, transform: `translateY(${ty}px)`, width: 540, pointerEvents: "none" }}>
      <div style={{
        display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
        textTransform: "uppercase", color: T.brown,
        background: T.brownTint, padding: "5px 12px", borderRadius: 999,
        marginBottom: 16, border: `1px solid ${T.beigeBorder}`,
      }}>{kicker}</div>
      <div style={{ fontFamily: T.sans, fontSize: 56, fontWeight: 700, color: T.charcoal, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 19, color: T.inkSoft, marginTop: 14, lineHeight: 1.5, maxWidth: 480 }}>{subtitle}</div>
      )}
    </div>
  );
}

// ── Storefront browser chrome ─────────────────────────────────────────────────
export function StoreChrome({ cartCount = 0, activeNav = "Home", children }: { cartCount?: number; activeNav?: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: T.beige, fontFamily: T.sans, color: T.charcoal }}>
      {/* browser bar */}
      <div style={{ height: 40, background: T.beigeDark, borderBottom: `1px solid ${T.beigeBorder}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 7 }}>
          <span style={{ width: 11, height: 11, borderRadius: 6, background: "#E0A8A0" }} />
          <span style={{ width: 11, height: 11, borderRadius: 6, background: "#E6CB94" }} />
          <span style={{ width: 11, height: 11, borderRadius: 6, background: "#A9C39A" }} />
        </div>
        <div style={{ flex: 1, maxWidth: 420, margin: "0 auto", height: 24, borderRadius: 999, background: T.card, border: `1px solid ${T.beigeBorder}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12, color: T.inkMuted }}>
          <Icon name="lock" size={11} color={T.inkMuted} sw={1.8} />
          gadgetbazaar.in
        </div>
      </div>

      {/* marquee */}
      <div style={{ height: 30, background: T.charcoal, color: T.beige, display: "flex", alignItems: "center", overflow: "hidden", flexShrink: 0, fontSize: 12 }}>
        <div style={{ display: "flex", gap: 14, paddingLeft: 24, whiteSpace: "nowrap", opacity: 0.9, alignItems: "center" }}>
          {["Free shipping on every order", "UPI · Cards · Cash on Delivery", "Rated excellent by happy buyers", "Hundreds of products in stock", "Fast delivery across India"].map((m, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ opacity: 0.4 }}>•</span>}
              <span>{m}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* store header */}
      <div style={{ height: 60, background: T.card, borderBottom: `1px solid ${T.beigeBorder}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 28, flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>
          Gadget<span style={{ color: T.orange }}>Bazaar</span>
        </div>
        <div style={{ display: "flex", gap: 22, fontSize: 14, fontWeight: 500 }}>
          {["Home", "Earbuds", "Covers", "Chargers", "Deals"].map((n) => (
            <span key={n} style={{ color: n === activeNav ? T.charcoal : T.inkMuted, borderBottom: n === activeNav ? `2px solid ${T.orange}` : "2px solid transparent", paddingBottom: 4 }}>{n}</span>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 240, height: 38, borderRadius: 999, background: T.beige, border: `1px solid ${T.beigeBorder}`, display: "flex", alignItems: "center", gap: 9, padding: "0 14px", fontSize: 13, color: T.inkFaint }}>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke={T.inkFaint} strokeWidth="1.6" /><path d="M14 14l4 4" stroke={T.inkFaint} strokeWidth="1.6" strokeLinecap="round" /></svg>
          Search earbuds, covers…
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0112 7a3.5 3.5 0 017 3.5C19 15.5 12 20 12 20z" stroke={T.inkMuted} strokeWidth="1.6" strokeLinejoin="round" /></svg>
        <div style={{ position: "relative" }}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l1.5 12h11l1.5-8H6" stroke={T.charcoal} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /><circle cx="9" cy="20" r="1.4" fill={T.charcoal} /><circle cx="17" cy="20" r="1.4" fill={T.charcoal} /></svg>
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: -6, right: -7, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 9, background: T.orange, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
          )}
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
}

// ── Admin panel chrome ────────────────────────────────────────────────────────
export function AdminChrome({ activeNav = "Dashboard", title = "Dashboard", children }: { activeNav?: string; title?: string; children: React.ReactNode }) {
  const nav = [
    { name: "Dashboard", icon: "grid" },
    { name: "Products", icon: "boxN" },
    { name: "Orders", icon: "bag" },
    { name: "Blog", icon: "doc" },
    { name: "Settings", icon: "cog" },
  ];
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: T.beige, fontFamily: T.sans, color: T.charcoal }}>
      <div style={{ width: 220, flexShrink: 0, background: T.charcoal, color: T.beige, display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 20px 20px", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
          Gadget<span style={{ color: T.orange }}>Bazaar</span>
          <div style={{ fontSize: 10, fontWeight: 500, color: "rgba(249,246,241,0.4)", letterSpacing: "0.12em", marginTop: 2 }}>ADMIN</div>
        </div>
        <div style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 3 }}>
          {nav.map((n) => {
            const active = n.name === activeNav;
            return (
              <div key={n.name} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 8, background: active ? "rgba(249,246,241,0.1)" : "transparent", color: active ? T.beige : "rgba(249,246,241,0.6)", fontSize: 14, fontWeight: active ? 600 : 500 }}>
                <AdminIcon name={n.icon} color={active ? T.orange : "rgba(249,246,241,0.5)"} />
                {n.name}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 20px 0", borderTop: "1px solid rgba(249,246,241,0.1)", fontSize: 12, color: "rgba(249,246,241,0.5)" }}>Razorpay · Shiprocket</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: 60, borderBottom: `1px solid ${T.beigeBorder}`, background: T.card, display: "flex", alignItems: "center", padding: "0 28px" }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>{title}</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 13px", borderRadius: 999, background: T.brownTint, color: T.brown, fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: T.green }} /> Store live
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden", position: "relative", background: T.beige }}>{children}</div>
      </div>
    </div>
  );
}

function AdminIcon({ name, color }: { name: string; color: string }) {
  const ic: Record<string, React.ReactNode> = {
    grid: <path d="M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z" stroke={color} strokeWidth="1.5" />,
    boxN: <path d="M10 2l7 4v8l-7 4-7-4V6l7-4zM3 6l7 4 7-4M10 10v8" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    bag: <path d="M5 6h10l1 11H4L5 6zM7 6V5a3 3 0 016 0v1" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    doc: <path d="M5 2h7l4 4v12H5zM12 2v4h4" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    cog: <><circle cx="10" cy="10" r="3" stroke={color} strokeWidth="1.4" /><path d="M10 1v3M10 16v3M1 10h3M16 10h3M4 4l2 2M14 14l2 2M16 4l-2 2M6 14l-2 2" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none">{ic[name]}</svg>;
}

// ── Product card ──────────────────────────────────────────────────────────────
export interface Product { name: string; price: number; mrp: number; icon: string; tint: string; badge?: string; rating?: number; }

export function ProductCard({ p, highlight = false }: { p: Product; highlight?: boolean }) {
  const discount = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  return (
    <div style={{ background: T.card, borderRadius: 16, border: `1px solid ${highlight ? T.brown : T.beigeBorder}`, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: highlight ? `0 12px 30px ${T.brown}22` : "0 1px 2px rgba(0,0,0,0.03)" }}>
      <div style={{ position: "relative", aspectRatio: "4 / 3", background: p.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={p.icon} size={56} color={T.charcoal} sw={1.4} />
        {discount > 0 && (
          <span style={{ position: "absolute", top: 10, left: 10, background: T.red, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999 }}>SALE</span>
        )}
        {p.badge && (
          <span style={{ position: "absolute", top: 10, right: 10, background: p.badge === "SALE" ? T.orange : T.brown, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999 }}>{p.badge === "TOP" ? "TOP" : p.badge}</span>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.charcoal, lineHeight: 1.3, height: 36, overflow: "hidden" }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "6px 0" }}>
          <Stars rating={p.rating || 4.6} size={11} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.charcoal }}>{inr(p.price)}</span>
        </div>
        <div style={{ marginTop: 10, height: 34, borderRadius: 9, background: T.charcoal, color: T.beige, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12.5, fontWeight: 600 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l1.5 12h11l1.5-8H6" stroke={T.beige} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" /></svg>
          Add to Cart
        </div>
      </div>
    </div>
  );
}
