// ERP Edge product tour. All names and figures are illustrative demo data.
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ProductTour from "../tour/ProductTour.jsx";
import { note, tap } from "../tour/beats.js";
import { Icon, Typewriter, Toast } from "./kit.jsx";
import { useCountUp } from "./useCountUp.js";

const theme = {
  "--bg": "#f3f4f7",
  "--surface": "#ffffff",
  "--surface2": "#eef0f4",
  "--line": "#e3e6ec",
  "--text": "#111827",
  "--muted": "#6b7280",
  "--accent": "#f59e0b",
  "--accent-soft": "rgba(245, 158, 11, 0.14)",
  "--accent-ink": "#1a1205",
  "--side": "#0d1526",
  "--side-text": "#8b95a8",
  "--side-active": "rgba(255, 255, 255, 0.07)",
};

const NAV = [
  ["dash", "Dashboard", "डैशबोर्ड", "grid"],
  ["orders", "Orders", "ऑर्डर", "box"],
  ["costing", "Costing", "लागत", "calc"],
  ["proc", "Procurement", "खरीद", "cart"],
  ["prod", "Production", "उत्पादन", "factory"],
  ["qc", "Quality", "गुणवत्ता", "shield"],
  ["dispatch", "Dispatch", "डिस्पैच", "truck"],
  ["ai", "Assistant", "सहायक", "spark"],
];

function Shell({ active, title, sub, compact, hindi = false, lang = true, children }) {
  const navTitle = NAV.find((n) => n[0] === active);
  const langSeg = lang && (
    <div className="ui-seg">
      <button type="button" data-tour="lang-en" className={!hindi ? "is-on" : ""}>EN</button>
      <button type="button" data-tour="lang-hi" className={hindi ? "is-on" : ""}>हिं</button>
      <button type="button">मरा</button>
    </div>
  );
  if (compact) {
    return (
      <div className="ui is-compact">
        <div className="ui-compact-top">
          <span className="ui-logo">E</span>
          <b>{hindi ? navTitle[2] : navTitle[1]}</b>
          <span style={{ marginLeft: "auto" }} />
          <Icon name="menu" />
        </div>
        <div className="ui-top">
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 13 }}>{title}</h1>
            {sub && <div className="ui-sub">{sub}</div>}
          </div>
          <span style={{ marginLeft: "auto" }}>{langSeg}</span>
        </div>
        <div className="ui-body">{children}</div>
      </div>
    );
  }
  return (
    <div className="ui">
      <aside className="ui-side">
        <div className="ui-brand"><span className="ui-logo">E</span>ERP Edge</div>
        <div className="ui-org">
          <div>Northwind Apparels<small>Unit 2 · Tiruppur</small></div>
          <Icon name="chev" />
        </div>
        {NAV.map(([key, en, hi, icon]) => (
          <div key={key} className={`ui-nav${key === active ? " is-active" : ""}`}>
            <Icon name={icon} />
            {hindi ? hi : en}
            {key === "ai" && <span className="ui-count">AI</span>}
          </div>
        ))}
      </aside>
      <main className="ui-main">
        <div className="ui-top">
          <div>
            <h1>{title}</h1>
            {sub && <div className="ui-sub">{sub}</div>}
          </div>
          <div className="ui-search"><Icon name="search" />Search orders, styles…</div>
          {langSeg}
          <span className="ui-avatar">RK</span>
        </div>
        <div className="ui-body">{children}</div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ 1. Dashboard */

const STAGES = [
  ["Sampling", "सैंपलिंग", 6],
  ["Costing", "लागत", 4],
  ["Procurement", "खरीद", 7],
  ["Production", "उत्पादन", 12],
  ["Quality", "गुणवत्ता", 5],
  ["Dispatch", "डिस्पैच", 4],
];

function Kpi({ label, value, suffix = "", decimals = 0, delta }) {
  const v = useCountUp(value, decimals);
  return (
    <div className="ui-card ui-kpi">
      <small>{label}</small>
      <b>{v}{suffix}</b>
      {delta && <i>{delta}</i>}
    </div>
  );
}

function Dashboard({ has, last, compact }) {
  const hindi = last("lang-hi", "lang-en") === "lang-hi";
  const riskOpen = has("risk");
  const t = (en, hi) => (hindi ? hi : en);
  return (
    <Shell active="dash" title={t("Good morning, Rakesh", "सुप्रभात, राकेश")} sub={t("Thursday · 38 open orders across 3 units", "गुरुवार · 3 यूनिट में 38 खुले ऑर्डर")} compact={compact} hindi={hindi}>
      <div className="ui-kpis">
        <Kpi label={t("Open orders", "खुले ऑर्डर")} value={38} delta="+4" />
        <Kpi label={t("On-time dispatch", "समय पर डिस्पैच")} value={96.4} decimals={1} suffix="%" />
        {!compact && <Kpi label={t("Pieces in line", "लाइन में पीस")} value={52400} />}
        {!compact && <Kpi label={t("QC first pass", "QC पहली बार पास")} value={98.1} decimals={1} suffix="%" />}
      </div>
      <div className="ui-grid2" style={{ flex: 1 }}>
        <div className="ui-card">
          <div className="ui-card-h"><h3>{t("Order pipeline", "ऑर्डर पाइपलाइन")}</h3><span>{t("by stage", "चरण अनुसार")}</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 11 }}>
            {STAGES.map(([en, hi, n], i) => (
              <div key={en} style={{ display: "grid", gridTemplateColumns: "92px 1fr 26px", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12 }}>{t(en, hi)}</span>
                <div className="ui-bar" style={{ height: 8 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(n / 12) * 100}%` }} transition={{ delay: 0.15 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
                </div>
                <b style={{ fontSize: 12, textAlign: "right" }}>{n}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="ui-card">
          <div className="ui-card-h"><h3>{t("Needs attention", "ध्यान दें")}</h3><span className="ui-badge warn">2</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              data-tour="risk"
              style={{ border: `1px solid ${riskOpen ? "var(--accent)" : "var(--line)"}`, borderRadius: 9, padding: 10, background: riskOpen ? "var(--accent-soft)" : "transparent", transition: "all .3s" }}
            >
              <div className="ui-row" style={{ justifyContent: "space-between" }}>
                <b style={{ fontSize: 12 }}>PO-7781 · Arden &amp; Co</b>
                <span className="ui-badge warn">{t("At risk", "जोखिम")}</span>
              </div>
              <div className="ui-muted" style={{ fontSize: 11, marginTop: 4 }}>{t("Sewing 62% · ships 28 Oct", "सिलाई 62% · 28 अक्टू. शिपमेंट")}</div>
              <AnimatePresence>
                {riskOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: 11.5, marginTop: 8, lineHeight: 1.5 }}>
                      {t("6 days left at the current rate leaves 1,900 pcs short. Adding one line on Floor 2 recovers the date.", "मौजूदा गति से 1,900 पीस कम रहेंगे। फ्लोर 2 पर एक लाइन जोड़ने से तारीख बचेगी।")}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ border: "1px solid var(--line)", borderRadius: 9, padding: 10 }}>
              <div className="ui-row" style={{ justifyContent: "space-between" }}>
                <b style={{ fontSize: 12 }}>PO-7802 · Halcyon Kids</b>
                <span className="ui-badge warn">{t("Trims late", "ट्रिम्स देर")}</span>
              </div>
              <div className="ui-muted" style={{ fontSize: 11, marginTop: 4 }}>{t("Zips due from Kiran Trims", "किरण ट्रिम्स से ज़िप बाकी")}</div>
            </div>
            {!riskOpen && (
              <div style={{ border: "1px solid var(--line)", borderRadius: 9, padding: 10 }}>
                <div className="ui-row" style={{ justifyContent: "space-between" }}>
                  <b style={{ fontSize: 12 }}>PO-7766 · Morrow Basics</b>
                  <span className="ui-badge ok">{t("On track", "समय पर")}</span>
                </div>
                <div className="ui-muted" style={{ fontSize: 11, marginTop: 4 }}>{t("Packing · ships 30 Oct", "पैकिंग · 30 अक्टू.")}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 2. Costing */

const COST_LINES = [
  ["Cotton jersey 180 GSM", "Shree Textiles", "₹218.00 / m", "1.42 m", 309.56],
  ["Rib 1x1", "Shree Textiles", "₹240.00 / m", "0.06 m", 14.4],
  ["Labels & trims", "Avon Labels", "₹9.80 / set", "1 set", 9.8],
  ["Sewing (CMT)", "In-house", "₹68.00 / pc", "1 pc", 68],
  ["Wash & finish", "Kiran Process", "₹18.00 / pc", "1 pc", 18],
  ["Packing", "PackRight", "₹6.20 / pc", "1 pc", 6.2],
];
const inr = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Masked() {
  return (
    <span className="ui-row" style={{ gap: 5, color: "var(--muted)" }}>
      <Icon name="lock" size={11} />
      <span style={{ display: "inline-block", width: 54, height: 8, borderRadius: 4, background: "var(--surface2)" }} />
    </span>
  );
}

function Costing({ has, last, compact }) {
  const buyer = last("view-buyer", "view-internal") === "view-buyer";
  const approved = has("approve");
  const base = COST_LINES.reduce((a, l) => a + l[4], 0);
  const over = base * 0.08;
  const margin = (base + over) * 0.18;
  const fob = base + over + margin;
  const queue = (
    <div className="ui-card" style={{ width: 210, flexShrink: 0, padding: 10 }}>
      <div className="ui-card-h" style={{ padding: "2px 4px" }}><h3>Costing requests</h3><span className="ui-badge accent">1 new</span></div>
      {[
        ["CR-118", "ST-2041 Crew tee", "Arden & Co", approved ? "Confirmed" : "Awaiting owner", true],
        ["CR-117", "ST-2050 Hoodie", "Halcyon Kids", "Confirmed", false],
        ["CR-116", "ST-1988 Polo", "Morrow Basics", "Confirmed", false],
        ["CR-115", "ST-1971 Joggers", "Arden & Co", "Sent to buyer", false],
      ].map(([id, style, buyerName, status, sel]) => (
        <div key={id} style={{ padding: "9px 8px", borderRadius: 8, background: sel ? "var(--accent-soft)" : "transparent", marginBottom: 2 }}>
          <div className="ui-row" style={{ justifyContent: "space-between" }}>
            <b style={{ fontSize: 11.5 }}>{style}</b>
          </div>
          <div className="ui-row" style={{ justifyContent: "space-between", marginTop: 4 }}>
            <span className="ui-muted" style={{ fontSize: 10.5 }}>{id} · {buyerName}</span>
          </div>
          <span className={`ui-badge ${status === "Awaiting owner" ? "warn" : "ok"}`} style={{ marginTop: 6 }}>{status}</span>
        </div>
      ))}
    </div>
  );
  return (
    <Shell active="costing" title="Costing" sub="ST-2041 · Crew neck tee · 18,000 pcs" compact={compact} lang={false}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        {!compact && queue}
        <div className="ui-card" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div className="ui-card-h">
            <div>
              <h3>{buyer ? "Buyer costing" : "Internal cost sheet"}</h3>
              <span>{buyer ? "What Arden & Co will see" : "Visible to costing and owner only"}</span>
            </div>
            <div className="ui-seg">
              <button type="button" data-tour="view-internal" className={!buyer ? "is-on" : ""}>Internal</button>
              <button type="button" data-tour="view-buyer" className={buyer ? "is-on" : ""}>Buyer view</button>
            </div>
          </div>
          <table className="ui-table">
            <thead>
              <tr><th>Item</th><th>Supplier</th>{!compact && <th>Rate</th>}{!compact && <th>Qty</th>}<th className="num">Per pc</th></tr>
            </thead>
            <tbody>
              {COST_LINES.map(([item, sup, rate, qty, amt]) => (
                <tr key={item}>
                  <td>{item}</td>
                  <td>{buyer ? <Masked /> : sup}</td>
                  {!compact && <td>{buyer ? <Masked /> : rate}</td>}
                  {!compact && <td className="ui-muted">{qty}</td>}
                  <td className="num">{inr(amt)}</td>
                </tr>
              ))}
              <tr><td className="ui-muted">Overheads 8%</td><td />{!compact && <td />}{!compact && <td />}<td className="num ui-muted">{inr(over)}</td></tr>
              {!buyer && <tr><td className="ui-muted">Margin 18%</td><td />{!compact && <td />}{!compact && <td />}<td className="num ui-muted">{inr(margin)}</td></tr>}
            </tbody>
          </table>
          <div className="ui-row" style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--line)", justifyContent: "space-between" }}>
            <div>
              <div className="ui-muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>FOB per piece</div>
              <div style={{ fontSize: 20, fontWeight: 750, letterSpacing: "-0.02em" }}>{inr(fob)} <span className="ui-muted" style={{ fontSize: 12, fontWeight: 500 }}>≈ ${(fob / 83.5).toFixed(2)}</span></div>
            </div>
            {approved ? (
              <span className="ui-btn done" data-tour="approve"><Icon name="check" size={13} />Confirmed by owner</span>
            ) : (
              <button type="button" className="ui-btn primary" data-tour="approve">Approve costing</button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>{approved && <Toast>Costing locked. Buyer copy is ready to send.</Toast>}</AnimatePresence>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 3. Procurement */

const LINES = [
  { id: "l1", style: "ST-2041", item: "Jersey 180 GSM", sup: "Shree Textiles", qty: "3,550 m" },
  { id: "l2", style: "ST-2041", item: "Main label", sup: "Avon Labels", qty: "5,000" },
  { id: "l3", style: "ST-2050", item: "Fleece 280 GSM", sup: "Shree Textiles", qty: "4,100 m" },
  { id: "l4", style: "ST-2063", item: "Buttons 18L", sup: "Kiran Trims", qty: "12,000" },
  { id: "l5", style: "ST-2041", item: "Rib 1x1", sup: "Shree Textiles", qty: "150 m" },
  { id: "l6", style: "ST-2050", item: "Main label", sup: "Avon Labels", qty: "4,000" },
  { id: "l7", style: "ST-2070", item: "Zip 5 inch", sup: "Kiran Trims", qty: "3,000" },
];
const SUPPLIERS = ["Shree Textiles", "Avon Labels", "Kiran Trims"];

function LineChip({ l, showSup }) {
  return (
    <motion.div
      layoutId={l.id}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--line)", fontSize: 11.5 }}
    >
      <span className="ui-badge" style={{ height: 18, fontSize: 10 }}>{l.style}</span>
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.item}</span>
      {showSup && <span className="ui-muted" style={{ fontSize: 11 }}>{l.sup}</span>}
      <b style={{ fontSize: 11.5 }}>{l.qty}</b>
    </motion.div>
  );
}

function Procurement({ has, compact }) {
  const grouped = has("consolidate");
  const sent = has("raise");
  return (
    <Shell active="proc" title="Procurement" sub="Buyer order PO-7781 · Arden & Co · 4 styles · 18,000 pcs" compact={compact} lang={false}>
      <LayoutGroup>
        {!grouped ? (
          <div className="ui-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div className="ui-card-h">
              <div><h3>Material requirements</h3><span>7 lines from 4 styles</span></div>
              <button type="button" className="ui-btn primary" data-tour="consolidate"><Icon name="merge" size={13} />Consolidate by supplier</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {LINES.map((l) => <LineChip key={l.id} l={l} showSup={!compact} />)}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minHeight: 0 }}>
            <div className="ui-row" style={{ justifyContent: "space-between" }}>
              <div><b>3 purchase orders</b> <span className="ui-muted" style={{ fontSize: 12 }}>· one per supplier, across every style</span></div>
              {sent ? (
                <span className="ui-btn done" data-tour="raise"><Icon name="check" size={13} />3 POs sent</span>
              ) : (
                <button type="button" className="ui-btn primary" data-tour="raise">Raise 3 POs</button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(3, 1fr)", gap: 10, flex: 1, minHeight: 0 }}>
              {SUPPLIERS.map((s, i) => {
                const ls = LINES.filter((l) => l.sup === s);
                return (
                  <motion.div key={s} className="ui-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 6, padding: compact ? 10 : 14 }}>
                    <div className="ui-card-h" style={{ marginBottom: 4 }}>
                      <div><h3>{s}</h3><span>PO-{9310 + i} · {ls.length} lines</span></div>
                      <span className={`ui-badge ${sent ? "ok" : ""}`}>{sent ? "Sent" : "Draft"}</span>
                    </div>
                    {ls.map((l) => <LineChip key={l.id} l={l} />)}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </LayoutGroup>
      <AnimatePresence>{sent && <Toast>Purchase orders emailed to 3 suppliers.</Toast>}</AnimatePresence>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 4. Quality */

const CHECKS = ["Fabric inward", "Cutting", "Inline stitching", "End of line", "Wash & finish", "Final audit"];

function Photo({ label, hue, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 8, overflow: "hidden", background: `linear-gradient(135deg, hsl(${hue} 30% 82%), hsl(${hue} 25% 64%))`, display: "grid", placeItems: "center" }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.3" strokeLinejoin="round"><path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z" /></svg>
          <span style={{ position: "absolute", left: 6, bottom: 6, fontSize: 10, color: "#fff", background: "rgba(0,0,0,.45)", padding: "2px 6px", borderRadius: 4 }}>{label}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Quality({ has, compact }) {
  const passed = has("pass");
  const done = passed ? 6 : 5;
  return (
    <Shell active="qc" title="Quality" sub="PO-7781 · Arden & Co · 18,000 pcs" compact={compact} lang={false}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0, flexDirection: compact ? "column" : "row" }}>
        <div className="ui-card" style={{ width: compact ? "auto" : 200, flexShrink: 0, padding: compact ? 10 : 14 }}>
          {!compact && <div className="ui-card-h"><h3>Checkpoints</h3><span>{done}/6</span></div>}
          <div style={{ display: "flex", flexDirection: compact ? "row" : "column", gap: compact ? 6 : 4, justifyContent: "space-between" }}>
            {CHECKS.map((c, i) => {
              const ok = i < done;
              const cur = i === done;
              return (
                <div key={c} className="ui-row" style={{ gap: 10, padding: compact ? 0 : "6px 4px" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, background: ok ? "var(--ok)" : cur ? "var(--accent)" : "var(--surface2)", color: ok || cur ? "#fff" : "var(--muted)", transition: "background .4s" }}>
                    {ok ? <Icon name="check" size={12} /> : i + 1}
                  </span>
                  {!compact && <span style={{ fontSize: 12, fontWeight: cur ? 650 : 500, color: ok || cur ? "var(--text)" : "var(--muted)" }}>{c}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div className="ui-card">
            <div className="ui-card-h">
              <div><h3>Final audit · AQL 2.5</h3><span>Inspector: S. Patil · Sample 315 pcs</span></div>
              {passed ? (
                <span className="ui-btn done" data-tour="pass"><Icon name="check" size={13} />Passed</span>
              ) : (
                <button type="button" className="ui-btn primary" data-tour="pass">Mark as passed</button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
              <Photo label="Front" hue={210} show />
              <Photo label="Measurements" hue={30} show={has("p2")} />
              <Photo label="Carton label" hue={150} show={has("p3")} />
            </div>
            {[["Measurements within tolerance", true], ["Shade matched to approved sample", true], ["Carton count 18,000 / 18,000", has("p3")]].map(([t, ok]) => (
              <div key={t} className="ui-row" style={{ fontSize: 12, padding: "4px 0", color: ok ? "var(--text)" : "var(--muted)" }}>
                <span style={{ color: ok ? "var(--ok)" : "var(--muted)" }}><Icon name={ok ? "check" : "dot"} size={13} /></span>{t}
              </div>
            ))}
          </div>
          <motion.div
            className="ui-card ui-row"
            animate={{ background: passed ? "rgba(22,163,74,0.08)" : "#ffffff", borderColor: passed ? "rgba(22,163,74,0.35)" : "#e3e6ec" }}
            style={{ gap: 12 }}
          >
            <span style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: passed ? "var(--ok)" : "var(--surface2)", color: passed ? "#fff" : "var(--muted)", transition: "all .4s" }}>
              <Icon name={passed ? "truck" : "lock"} size={17} />
            </span>
            <div style={{ minWidth: 0 }}>
              <b style={{ fontSize: 12.5 }}>{passed ? "Cleared for dispatch" : "Dispatch locked"}</b>
              <div className="ui-muted" style={{ fontSize: 11.5 }}>{passed ? "Truck MH-12 · loading slot Thu 10:00" : "The shipment cannot leave until the final audit passes"}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 5. Assistant */

const TOOLS = [
  ["orders.search", "ship_by ≤ 31 Oct · status open"],
  ["production.progress", "PO-7781, PO-7802"],
  ["procurement.pending", "trims · PO-7802"],
];

function ToolCall({ name, args, i }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setDone(true), 500 + i * 450);
    return () => clearTimeout(id);
  }, [i]);
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.25 }} className="ui-row" style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", padding: "5px 9px", borderRadius: 7, background: "var(--surface2)", width: "fit-content", maxWidth: "100%" }}>
      <span style={{ color: done ? "var(--ok)" : "var(--accent)", display: "grid" }}>{done ? <Icon name="check" size={12} /> : <span className="kit-spin" />}</span>
      <b>{name}</b><span className="ui-muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{args}</span>
    </motion.div>
  );
}

function Assistant({ has, compact }) {
  const asked = has("ask");
  const tools = has("tools");
  const answer = has("answer");
  const notified = has("notify");
  return (
    <Shell active="ai" title="Assistant" sub="Answers from live ERP data" compact={compact} lang={false}>
      <div className="ui-card" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0, overflow: "hidden" }}>
        {!asked && (
          <div style={{ margin: "auto", textAlign: "center", maxWidth: 420 }}>
            <span className="ui-logo" style={{ width: 40, height: 40, margin: "0 auto 12px", borderRadius: 12 }}><Icon name="spark" size={20} /></span>
            <b style={{ fontSize: 15 }}>Ask about orders, stock or production</b>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
              <button type="button" className="ui-btn" data-tour="ask" style={{ justifyContent: "flex-start", height: 36 }}>Which orders could miss their ship date this week?</button>
              <button type="button" className="ui-btn" style={{ justifyContent: "flex-start", height: 36 }}>Fabric stock for ST-2050</button>
              {!compact && <button type="button" className="ui-btn" style={{ justifyContent: "flex-start", height: 36 }}>Today's QC summary by line</button>}
            </div>
          </div>
        )}
        {asked && (
          <>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ alignSelf: "flex-end", background: "var(--side)", color: "#fff", padding: "9px 13px", borderRadius: "12px 12px 3px 12px", fontSize: 12.5, maxWidth: "80%" }}>
              Which orders could miss their ship date this week?
            </motion.div>
            {tools && (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {TOOLS.map(([n, a], i) => <ToolCall key={n} name={n} args={a} i={i} />)}
              </div>
            )}
            {answer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12.5, lineHeight: 1.55 }}>
                <Typewriter text="Two orders are at risk this week. Both are recoverable if we act today:" />
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {[
                    ["PO-7781", "Arden & Co", "Sewing at 62%, ships 28 Oct", "Add one line on Floor 2"],
                    ["PO-7802", "Halcyon Kids", "Zips not received from Kiran Trims", "Chase supplier, due 24 Oct"],
                  ].map(([po, b, why, fix]) => (
                    <div key={po} style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "150px 1fr 1fr", gap: compact ? 2 : 10, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 8, fontSize: 11.5 }}>
                      <b>{po} · {b}</b>
                      <span className="ui-muted">{why}</span>
                      <span style={{ color: "var(--warn)", fontWeight: 600 }}>{fix}</span>
                    </div>
                  ))}
                  <div className="ui-row" style={{ marginTop: 4 }}>
                    {notified ? (
                      <span className="ui-btn done" data-tour="notify"><Icon name="check" size={13} />Sent to 2 merchandisers</span>
                    ) : (
                      <button type="button" className="ui-btn primary" data-tour="notify">Notify merchandisers</button>
                    )}
                    <button type="button" className="ui-btn">Open both orders</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
        <div className="ui-row" style={{ marginTop: "auto", height: 38, padding: "0 12px", borderRadius: 10, border: "1px solid var(--line)", color: "var(--muted)", fontSize: 12, flexShrink: 0 }}>
          Ask anything… <span style={{ marginLeft: "auto" }}><Icon name="send" size={14} /></span>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ tour */

const chapters = [
  {
    title: "CEO view",
    caption: "One screen for the owner: every order, every stage, live.",
    Screen: Dashboard,
    tail: 2600,
    beats: [
      note("One screen for the owner: every order, every stage, live."),
      tap("lang-hi", "Hindi and Marathi are built in, so the floor team works in their own language.", 1800),
      note("Hindi and Marathi are built in, so the floor team works in their own language.", 2200),
      tap("lang-en", "Switch back any time; every label follows.", 900),
      tap("risk", "Orders drifting off schedule surface before they slip, with the fix.", 1300),
    ],
  },
  {
    title: "Costing",
    caption: "Costing is a controlled process: request, cost, owner confirms.",
    Screen: Costing,
    tail: 2800,
    beats: [
      note("Costing is a controlled process: request, cost, owner confirms."),
      tap("view-buyer", "The buyer-facing costing hides every supplier and rate automatically.", 2200),
      note("The buyer-facing costing hides every supplier and rate automatically.", 2200),
      tap("view-internal", "Internally, costing and the owner see the full sheet.", 900),
      tap("approve", "The owner confirms; the costing locks and the buyer copy is ready.", 1600),
    ],
  },
  {
    title: "Procurement",
    caption: "One buyer order, four styles, seven material lines.",
    Screen: Procurement,
    tail: 3000,
    beats: [
      note("One buyer order, four styles, seven material lines."),
      tap("consolidate", "One click groups every line by supplier: one PO per supplier, not one per style.", 2000),
      note("One click groups every line by supplier: one PO per supplier, not one per style.", 2200),
      tap("raise", "Three purchase orders go out instead of seven.", 1000),
    ],
  },
  {
    title: "Quality",
    caption: "Six QC checkpoints, each backed by photo evidence.",
    Screen: Quality,
    tail: 3200,
    beats: [
      note("Six QC checkpoints, each backed by photo evidence."),
      note("Six QC checkpoints, each backed by photo evidence.", 900, "p2"),
      note("Six QC checkpoints, each backed by photo evidence.", 800, "p3"),
      tap("pass", "The final audit controls whether a shipment is allowed to leave.", 1500),
    ],
  },
  {
    title: "AI assistant",
    caption: "An assistant that answers from live ERP data.",
    Screen: Assistant,
    tail: 3400,
    beats: [
      note("An assistant that answers from live ERP data."),
      tap("ask", "Ask in plain language.", 1600),
      note("It calls the ERP's own tools over MCP instead of guessing.", 700, "tools"),
      note("Then answers with the orders, the cause and the next step.", 2300, "answer"),
      tap("notify", "One click turns the answer into action.", 3200),
    ],
  },
];

export default function ErpEdgeDemo() {
  return <ProductTour url="ERP Edge · demo workspace" badge="Demo data" theme={theme} chapters={chapters} />;
}
