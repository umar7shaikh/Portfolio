"use client";
import React from "react";
import { Sprite, useSprite } from "./Sprite";
import { clamp, Easing, interpolate } from "./easing";
import { StoreChrome, Icon, Stars, T, inr } from "./chrome";
import { PRODUCTS } from "./data";

const ADD_AT = 4.2;

export function SceneProduct({ start, end }: { start: number; end: number }) {
  return (
    <Sprite start={start} end={end}>
      <SceneProductInner />
    </Sprite>
  );
}

function SceneProductInner() {
  const { localTime } = useSprite();
  const added = localTime >= ADD_AT;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <StoreChrome cartCount={added ? 1 : 0} activeNav="Earbuds">
        <ProductBody />
      </StoreChrome>
    </div>
  );
}

function ProductBody() {
  const { localTime } = useSprite();
  const p = PRODUCTS[0];
  const added = localTime >= ADD_AT;
  const discount = Math.round((1 - p.price / p.mrp) * 100);

  // cursor glides toward the CTA then taps
  const cx = interpolate([2.2, 3.9], [560, 858], Easing.easeInOutCubic)(localTime);
  const cy = interpolate([2.2, 3.9], [520, 372], Easing.easeInOutCubic)(localTime);
  const cursorOp = clamp((localTime - 2.0) / 0.3, 0, 1) * (localTime > 6 ? clamp((7 - localTime) / 0.6, 0, 1) : 1);
  const ripple = clamp((localTime - ADD_AT) / 0.6, 0, 1);

  const toastOp = localTime >= ADD_AT && localTime < ADD_AT + 2.4 ? 1 : 0;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", padding: 28 }}>
      {/* breadcrumb */}
      <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 16 }}>Home · Earbuds · <span style={{ color: T.charcoal }}>{p.name}</span></div>

      <div style={{ display: "flex", gap: 28 }}>
        {/* gallery */}
        <div style={{ width: 420, flexShrink: 0 }}>
          <div style={{ aspectRatio: "1 / 1", borderRadius: 18, background: p.tint, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.beigeBorder}` }}>
            <Icon name={p.icon} size={150} color={T.charcoal} sw={1.2} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {[p.icon, "box", "speaker", "charger"].map((e, i) => (
              <div key={i} style={{ width: 68, height: 68, borderRadius: 12, background: i === 0 ? T.card : T.beige, border: `1.5px solid ${i === 0 ? T.brown : T.beigeBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={e} size={28} color={i === 0 ? T.charcoal : T.inkMuted} sw={1.5} />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: T.brown, background: T.brownTint, padding: "3px 9px", borderRadius: 999, marginBottom: 10 }}><Icon name="star" size={11} color={T.brown} /> Bestseller</div>
          <div style={{ fontFamily: T.sans, fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", color: T.charcoal, lineHeight: 1.15 }}>{p.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Stars rating={p.rating || 4.7} size={15} />
            <span style={{ fontSize: 13, color: T.inkMuted }}>Top rated · lots of reviews</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 18 }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: T.charcoal, letterSpacing: "-0.02em" }}>{inr(p.price)}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.green }}>Sale price</span>
          </div>
          <div style={{ fontSize: 12, color: T.green, marginTop: 6 }}>● In stock · ships today</div>

          {/* color */}
          <div style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: T.inkSoft, marginBottom: 8 }}>Colour</div>
          <div style={{ display: "flex", gap: 10 }}>
            {["#1C1917", "#8B6F47", "#E2DAD0"].map((c, i) => (
              <div key={i} style={{ width: 30, height: 30, borderRadius: 999, background: c, border: `2px solid ${i === 0 ? T.brown : T.beigeBorder}`, boxShadow: i === 0 ? `0 0 0 2px ${T.card}` : "none" }} />
            ))}
          </div>

          {/* CTA row */}
          <div style={{ display: "flex", gap: 12, marginTop: 24, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, height: 52, borderRadius: 12, background: added ? T.green : T.charcoal, color: T.beige, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontSize: 16, fontWeight: 700, transition: "background 0.3s", overflow: "hidden" }}>
              {ripple > 0 && ripple < 1 && (
                <span style={{ position: "absolute", width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.4)", transform: `scale(${ripple * 6})`, opacity: 1 - ripple }} />
              )}
              {added ? "✓ Added to cart" : "Add to Cart"}
            </div>
            <div style={{ width: 52, height: 52, borderRadius: 12, border: `1.5px solid ${T.beigeBorder}`, background: T.card, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0112 7a3.5 3.5 0 017 3.5C19 15.5 12 20 12 20z" stroke={T.inkMuted} strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </div>
          </div>

          {/* trust row */}
          <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
            {[{ n: "truck", t: "Free shipping" }, { n: "returns", t: "7-day returns" }, { n: "lock", t: "Secure payment" }].map((x) => (
              <div key={x.t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: T.inkSoft }}><Icon name={x.n} size={16} color={T.brown} sw={1.6} />{x.t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* frequently bought together */}
      <div style={{ marginTop: 22, padding: 18, borderRadius: 14, background: T.card, border: `1px solid ${T.beigeBorder}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.charcoal, marginBottom: 12 }}>Frequently bought together</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {[PRODUCTS[0], PRODUCTS[2], PRODUCTS[4]].map((fb, i) => (
            <React.Fragment key={fb.name}>
              {i > 0 && <span style={{ fontSize: 20, color: T.inkFaint }}>+</span>}
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 10, background: T.beige, border: `1px solid ${T.beigeBorder}` }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: fb.tint, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={fb.icon} size={18} color={T.charcoal} sw={1.6} /></div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.charcoal, maxWidth: 120, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{fb.name}</div>
                  <div style={{ fontSize: 12, color: T.inkMuted }}>{inr(fb.price)}</div>
                </div>
              </div>
            </React.Fragment>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: T.inkMuted }}>Bundle price</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.charcoal }}>{inr(PRODUCTS[0].price + PRODUCTS[2].price + PRODUCTS[4].price)}</div>
          </div>
        </div>
      </div>

      {/* add-to-cart toast */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: `translateX(-50%) translateY(${toastOp ? 0 : 16}px)`, opacity: toastOp, background: T.charcoal, color: T.beige, fontSize: 13, padding: "11px 18px", borderRadius: 999, boxShadow: "0 12px 30px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 9, transition: "opacity 0.3s, transform 0.3s" }}>
        <span style={{ color: "#9DD89E" }}>✓</span> Added “{p.name}” to cart
      </div>

      {/* simulated cursor */}
      <div style={{ position: "absolute", left: cx, top: cy, opacity: cursorOp, pointerEvents: "none", zIndex: 30 }}>
        {ripple > 0 && ripple < 1 && (
          <span style={{ position: "absolute", left: -6, top: -6, width: 34, height: 34, borderRadius: 999, border: `2px solid ${T.charcoal}`, transform: `scale(${0.4 + ripple * 1.4})`, opacity: 1 - ripple }} />
        )}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 3l15 8-6 1.5L11 19 5 3z" fill={T.charcoal} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}
