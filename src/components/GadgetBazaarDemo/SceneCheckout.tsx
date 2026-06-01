"use client";
import React from "react";
import { Sprite, useSprite } from "./Sprite";
import { clamp, Easing } from "./easing";
import { StoreChrome, Icon, T, inr } from "./chrome";
import { PRODUCTS } from "./data";

const ITEMS = [PRODUCTS[0], PRODUCTS[2], PRODUCTS[4]];
const PAY_AT = 4.5;
const PROCESS_AT = 5.6;
const DONE_AT = 8.0;

export function SceneCheckout({ start, end }: { start: number; end: number }) {
  return (
    <Sprite start={start} end={end}>
      <SceneCheckoutInner />
    </Sprite>
  );
}

function SceneCheckoutInner() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <StoreChrome cartCount={ITEMS.length} activeNav="Home">
        <CheckoutBody />
      </StoreChrome>
    </div>
  );
}

function CheckoutBody() {
  const { localTime } = useSprite();
  const subtotal = ITEMS.reduce((s, p) => s + p.price, 0);
  const shipping = subtotal >= 299 ? 0 : 49;
  const total = subtotal + shipping;

  const processing = localTime >= PROCESS_AT && localTime < DONE_AT;
  const done = localTime >= DONE_AT;
  const upiSelected = localTime >= 2.5;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", padding: 28, display: "flex", gap: 22 }}>
      {/* Order summary */}
      <div style={{ flex: 1.2, background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 16, padding: 22 }}>
        <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, marginBottom: 16, color: T.charcoal }}>Order summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ITEMS.map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ width: 52, height: 52, borderRadius: 11, background: p.tint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={p.icon} size={26} color={T.charcoal} sw={1.5} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.charcoal }}>{p.name}</div>
                <div style={{ fontSize: 12, color: T.inkMuted }}>Qty 1 · ships today</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.charcoal }}>{inr(p.price)}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px dashed ${T.beigeBorder}`, marginTop: 18, paddingTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
          <Row l="Subtotal" r={inr(subtotal)} />
          <Row l="Shipping" r={shipping === 0 ? "FREE" : inr(shipping)} green={shipping === 0} />
          <Row l="Coupon · FESTIVE" r="Applied ✓" green />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 18, fontWeight: 800, color: T.charcoal }}>
            <span>Total</span><span>{inr(total)}</span>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: T.beige, fontSize: 12.5, color: T.inkSoft, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="truck" size={16} color={T.brown} sw={1.6} /> Deliver to Mumbai 400001 · arrives in 3–4 days
        </div>
      </div>

      {/* Payment */}
      <div style={{ flex: 1, background: T.card, border: `1px solid ${T.beigeBorder}`, borderRadius: 16, padding: 22, position: "relative" }}>
        <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, marginBottom: 16, color: T.charcoal }}>Payment</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { id: "upi", label: "UPI · GPay / PhonePe", glyph: "case", sel: upiSelected },
            { id: "card", label: "Credit / Debit card", glyph: "card", sel: false },
            { id: "cod", label: "Cash on Delivery", glyph: "cash", sel: false },
          ].map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderRadius: 12, border: `1.5px solid ${m.sel ? T.brown : T.beigeBorder}`, background: m.sel ? T.brownTint : T.card }}>
              <Icon name={m.glyph} size={20} color={m.sel ? T.brown : T.inkMuted} sw={1.6} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.charcoal }}>{m.label}</span>
              <span style={{ width: 18, height: 18, borderRadius: 9, border: `2px solid ${m.sel ? T.brown : T.beigeBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {m.sel && <span style={{ width: 9, height: 9, borderRadius: 5, background: T.brown }} />}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, height: 52, borderRadius: 12, background: processing ? T.brownDeep : T.charcoal, color: T.beige, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 16, fontWeight: 700 }}>
          {processing ? (
            <>
              <span style={{ width: 17, height: 17, borderRadius: 9, border: "2px solid rgba(249,246,241,0.35)", borderTopColor: T.beige, display: "inline-block", animation: "gbspin 0.8s linear infinite" }} />
              Paying securely…
            </>
          ) : (
            <>Pay {inr(total)} →</>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: T.inkFaint, marginTop: 10 }}><Icon name="lock" size={12} color={T.inkFaint} sw={1.8} /> 256-bit secure · powered by Razorpay</div>

        {/* success overlay */}
        {done && <SuccessOverlay total={total} />}
      </div>

      <style>{`@keyframes gbspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Row({ l, r, green }: { l: string; r: string; green?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.inkSoft }}>
      <span>{l}</span><span style={{ color: green ? T.green : T.inkSoft, fontWeight: green ? 700 : 500 }}>{r}</span>
    </div>
  );
}

function SuccessOverlay({ total }: { total: number }) {
  const { localTime } = useSprite();
  const t = localTime - DONE_AT;
  const pop = Easing.easeOutBack(clamp(t / 0.5, 0, 1));
  const fade = clamp(t / 0.3, 0, 1);
  return (
    <div style={{ position: "absolute", inset: 0, background: T.card, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, opacity: fade }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: T.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop})`, marginBottom: 16 }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 800, color: T.charcoal, letterSpacing: "-0.02em" }}>Order placed!</div>
      <div style={{ fontSize: 13, color: T.inkMuted, marginTop: 6 }}>Order #GB-20418 · {inr(total)} paid via UPI</div>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 9, padding: "10px 16px", borderRadius: 999, background: T.beige, border: `1px solid ${T.beigeBorder}`, fontSize: 12.5, color: T.inkSoft }}>
        <Icon name="box" size={16} color={T.brown} sw={1.6} /> Shiprocket label created · tracking sent by SMS
      </div>
    </div>
  );
}
