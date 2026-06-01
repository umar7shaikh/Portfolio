"use client";
import React from "react";
import { Sprite, useSprite } from "./Sprite";
import { clamp, Easing } from "./easing";
import { StoreChrome, ProductCard, Icon, T, inr } from "./chrome";
import { PRODUCTS, CATEGORIES } from "./data";

export function SceneStore({ start, end }: { start: number; end: number }) {
  return (
    <Sprite start={start} end={end}>
      <SceneStoreInner />
    </Sprite>
  );
}

function SceneStoreInner() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <StoreChrome cartCount={0} activeNav="Home">
        <StoreBody />
      </StoreChrome>
    </div>
  );
}

function StoreBody() {
  const { localTime } = useSprite();
  const heroOp = clamp(localTime / 0.6, 0, 1);
  const catStagger = (i: number) => clamp((localTime - 0.6 - i * 0.06) / 0.4, 0, 1);
  const cardStagger = (i: number) => clamp((localTime - 1.4 - i * 0.12) / 0.5, 0, 1);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", padding: 24 }}>
      {/* Hero banner */}
      <div style={{ height: 150, borderRadius: 16, background: `linear-gradient(110deg, ${T.charcoal}, #3a2f25)`, padding: "26px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: heroOp, transform: `translateY(${(1 - heroOp) * 12}px)`, overflow: "hidden", position: "relative" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: T.orange, marginBottom: 8 }}>FESTIVE SALE · LIVE NOW</div>
          <div style={{ fontFamily: T.sans, fontSize: 34, fontWeight: 800, color: T.beige, letterSpacing: "-0.02em", lineHeight: 1.05 }}>Up to <span style={{ color: "#E6A817" }}>60% off</span> accessories</div>
          <div style={{ fontSize: 14, color: "rgba(249,246,241,0.65)", marginTop: 6 }}>Free shipping · Cash on Delivery available</div>
        </div>
        <div style={{ display: "flex", gap: 18, opacity: 0.92 }}>
          {["earbuds", "charger", "powerbank"].map((n) => (
            <div key={n} style={{ width: 64, height: 64, borderRadius: 14, background: "rgba(249,246,241,0.08)", border: "1px solid rgba(249,246,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={n} size={32} color="#E6A817" sw={1.5} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 240, top: 70, width: 26, height: 26, borderRadius: 8, background: T.orange, transform: "rotate(12deg)", opacity: 0.25 }} />
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        {CATEGORIES.map((c, i) => {
          const op = catStagger(i);
          return (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 999, background: T.card, border: `1px solid ${T.beigeBorder}`, fontSize: 13, fontWeight: 600, color: T.charcoal, opacity: op, transform: `scale(${0.9 + 0.1 * op})` }}>
              <Icon name={c.icon} size={16} color={T.brown} sw={1.6} />{c.label}
            </div>
          );
        })}
      </div>

      {/* Top picks grid */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 22, marginBottom: 14 }}>
        <div style={{ fontFamily: T.sans, fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: T.charcoal }}>Top picks for you</div>
        <div style={{ fontSize: 13, color: T.brown, fontWeight: 600 }}>View all →</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {PRODUCTS.slice(0, 4).map((p, i) => {
          const op = cardStagger(i);
          return (
            <div key={p.name} style={{ opacity: op, transform: `translateY(${(1 - op) * 22}px)` }}>
              <ProductCard p={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
