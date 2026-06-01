"use client";
import React from "react";
import { Sprite, useSprite } from "./Sprite";
import { clamp } from "./easing";
import { AdminChrome, T, inr } from "./chrome";

const SHIP_AT = 4.0;

export function SceneAdmin({ start, end }: { start: number; end: number }) {
  return (
    <Sprite start={start} end={end}>
      <SceneAdminInner />
    </Sprite>
  );
}

function SceneAdminInner() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <AdminChrome activeNav="Orders" title="Orders">
        <AdminBody />
      </AdminChrome>
    </div>
  );
}

function AdminBody() {
  const { localTime } = useSprite();
  const statStagger = (i: number) => clamp((localTime - 0.3 - i * 0.12) / 0.5, 0, 1);
  const rowStagger = (i: number) => clamp((localTime - 1.0 - i * 0.2) / 0.5, 0, 1);
  const shipped = localTime >= SHIP_AT;
  const flash = shipped ? clamp(1 - (localTime - SHIP_AT) / 1.4, 0, 1) : 0;

  const stats = [
    { label: "Today's orders", value: "••", accent: false },
    { label: "Revenue today", value: "₹••••", accent: true },
    { label: "To pack", value: "••", accent: false },
    { label: "In transit", value: "••", accent: false },
  ];

  const orders = [
    { id: "GB-20418", who: "Aarav Mehta", items: "3 items", total: 2397, status: shipped ? "Shipped" : "Processing", live: true },
    { id: "GB-20417", who: "Priya N.", items: "1 item", total: 1799, status: "Paid" },
    { id: "GB-20416", who: "Rohit S.", items: "2 items", total: 1148, status: "Delivered" },
    { id: "GB-20415", who: "Meera K.", items: "1 item", total: 349, status: "Pending COD" },
    { id: "GB-20414", who: "Imran Q.", items: "4 items", total: 3946, status: "Shipped" },
  ];

  const statusColor: Record<string, string> = {
    Paid: "#2563EB", Processing: T.orange, Shipped: T.brown, Delivered: T.green, "Pending COD": T.inkMuted,
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", padding: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {stats.map((s, i) => {
          const op = statStagger(i);
          return (
            <div key={s.label} style={{ background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 12, padding: 16, opacity: op, transform: `translateY(${(1 - op) * 12}px)` }}>
              <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: s.accent ? T.brown : T.charcoal }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${T.beigeBorder}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.charcoal }}>Recent orders</div>
          <div style={{ fontSize: 12, color: T.inkMuted }}>Synced live · Supabase</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.4fr 1fr 1fr 1.2fr 1fr", padding: "11px 20px", background: T.beige, fontSize: 10.5, fontWeight: 700, color: T.inkMuted, letterSpacing: "0.07em" }}>
          <div>ORDER</div><div>CUSTOMER</div><div>ITEMS</div><div>TOTAL</div><div>STATUS</div><div style={{ textAlign: "right" }}>ACTION</div>
        </div>
        {orders.map((o, i) => {
          const op = rowStagger(i);
          const c = statusColor[o.status];
          return (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1.1fr 1.4fr 1fr 1fr 1.2fr 1fr", padding: "14px 20px", borderTop: `1px solid ${T.beige}`, alignItems: "center", fontSize: 13, opacity: op, transform: `translateX(${(1 - op) * 16}px)`, background: o.live && flash > 0 ? `rgba(139,111,71,${flash * 0.12})` : "transparent" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: T.inkSoft }}>{o.id}</div>
              <div style={{ fontWeight: 600, color: T.charcoal }}>{o.who}</div>
              <div style={{ color: T.inkMuted }}>{o.items}</div>
              <div style={{ fontWeight: 700, color: T.charcoal }}>{inr(o.total)}</div>
              <div>
                <span style={{ padding: "4px 10px", borderRadius: 999, background: `${c}1a`, color: c, fontSize: 11, fontWeight: 700, border: `1px solid ${c}33` }}>{o.status}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                {o.live && !shipped ? (
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", background: T.brown, padding: "5px 11px", borderRadius: 8 }}>Ship via Shiprocket</span>
                ) : o.live && shipped ? (
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: T.green }}>AWB created ✓</span>
                ) : (
                  <span style={{ fontSize: 12, color: T.brown, fontWeight: 600 }}>View →</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
