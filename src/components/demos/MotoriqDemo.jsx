// Motoriq product tour. Dealership, vehicles and figures are demo data.
import React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ProductTour from "../tour/ProductTour.jsx";
import { note, tap } from "../tour/beats.js";
import { Icon, Typewriter, Toast } from "./kit.jsx";
import { useCountUp } from "./useCountUp.js";

const theme = {
  "--bg": "#f6f7fb",
  "--surface": "#ffffff",
  "--surface2": "#f0f2f8",
  "--line": "#e6e8f0",
  "--text": "#0f172a",
  "--muted": "#64748b",
  "--accent": "#4f46e5",
  "--accent-soft": "rgba(79, 70, 229, 0.1)",
  "--accent-ink": "#ffffff",
  "--side": "#0f1222",
  "--side-text": "#8c93ad",
  "--side-active": "rgba(129, 140, 248, 0.14)",
};

const NAV = [
  ["dash", "Dashboard", "home"],
  ["inv", "Inventory", "car"],
  ["sales", "Sales", "wallet"],
  ["crm", "CRM", "users"],
  ["reports", "P&L", "chart"],
  ["staff", "Staff", "shield"],
];

function Shell({ active, title, sub, compact, children, action }) {
  const label = NAV.find((n) => n[0] === active)[1];
  if (compact) {
    return (
      <div className="ui is-compact">
        <div className="ui-compact-top">
          <span className="ui-logo">M</span>
          <b>MOTOR<span style={{ color: "#818cf8" }}>IQ</span></b>
          <span className="ui-muted" style={{ marginLeft: "auto", fontSize: 11, color: "#8c93ad" }}>{label}</span>
        </div>
        <div className="ui-top">
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 13 }}>{title}</h1>
            {sub && <div className="ui-sub">{sub}</div>}
          </div>
          <span style={{ marginLeft: "auto" }}>{action}</span>
        </div>
        <div className="ui-body">{children}</div>
      </div>
    );
  }
  return (
    <div className="ui">
      <aside className="ui-side">
        <div className="ui-brand"><span className="ui-logo">M</span>MOTOR<span style={{ color: "#818cf8", marginLeft: -8 }}>IQ</span></div>
        <div className="ui-org">
          <div>Apex Motors<small>Pune · Kothrud</small></div>
          <Icon name="chev" />
        </div>
        {NAV.map(([key, l, icon]) => (
          <div key={key} className={`ui-nav${key === active ? " is-active" : ""}`}><Icon name={icon} />{l}</div>
        ))}
        <div style={{ marginTop: "auto", padding: "10px", fontSize: 10.5, lineHeight: 1.5, borderRadius: 8, background: "rgba(255,255,255,0.04)" }}>
          <b style={{ color: "#fff", display: "block", fontSize: 11 }}>Tenant isolated</b>
          Apex Motors' data is never visible to any other dealership.
        </div>
      </aside>
      <main className="ui-main">
        <div className="ui-top">
          <div>
            <h1>{title}</h1>
            {sub && <div className="ui-sub">{sub}</div>}
          </div>
          <div className="ui-search"><Icon name="search" />Search vehicles, leads…</div>
          {action}
          <span className="ui-avatar">DA</span>
        </div>
        <div className="ui-body">{children}</div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ 1. Dashboard */

function Stat({ label, value, prefix = "", suffix = "", decimals = 0, delta, icon }) {
  const v = useCountUp(value, decimals);
  return (
    <div className="ui-card ui-row" style={{ gap: 12 }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0 }}><Icon name={icon} size={16} /></span>
      <div className="ui-kpi" style={{ minWidth: 0 }}>
        <small>{label}</small>
        <b style={{ fontSize: 18 }}>{prefix}{v}{suffix}</b>
        {delta && <i>{delta}</i>}
      </div>
    </div>
  );
}

const MONTHS = [42, 55, 48, 61, 58, 72, 69, 84];

function Dashboard({ compact }) {
  return (
    <Shell active="dash" title="Good afternoon, Dealer Admin" sub="Here's your dealership today" compact={compact}
      action={<button type="button" className="ui-btn primary" data-tour="add"><Icon name="plus" size={13} />{compact ? "Add" : "Add vehicle"}</button>}>
      <div className="ui-kpis">
        <Stat label="Revenue (Oct)" value={1.14} decimals={2} prefix="₹" suffix=" Cr" delta="↑ 14%" icon="wallet" />
        <Stat label="In stock" value={47} icon="car" />
        {!compact && <Stat label="Open leads" value={128} icon="users" />}
        {!compact && <Stat label="Net profit" value={24.5} decimals={1} prefix="₹" suffix=" L" delta="↑ 22%" icon="chart" />}
      </div>
      <div className="ui-grid2" style={{ flex: 1 }}>
        <div className="ui-card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="ui-card-h"><h3>Vehicles sold</h3><span>last 8 months</span></div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10, minHeight: 120 }}>
            {MONTHS.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <motion.div initial={{ height: 0 }} animate={{ height: `${m}%` }} transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: "100%", borderRadius: "6px 6px 2px 2px", background: i === MONTHS.length - 1 ? "var(--accent)" : "rgba(79,70,229,0.22)" }} />
                <span className="ui-muted" style={{ fontSize: 10 }}>{["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ui-card">
          <div className="ui-card-h"><h3>Today</h3><span>3 updates</span></div>
          {[
            ["Test drive booked", "Creta SX(O) · Rahul S.", "calendar"],
            ["Sold", "Baleno Alpha 2021 · ₹6.85 L", "wallet"],
            ["Service due", "City VX 2019 · 3 days", "clock"],
          ].map(([a, b, ic]) => (
            <div key={a} className="ui-row" style={{ padding: "8px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
              <span style={{ color: "var(--accent)" }}><Icon name={ic} /></span>
              <div style={{ minWidth: 0 }}><b style={{ fontSize: 12 }}>{a}</b><div className="ui-muted" style={{ fontSize: 11 }}>{b}</div></div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 2. Add vehicle */

const LISTING = "2022 Hyundai Creta SX(O), single owner, 28,400 km on the clock. Panoramic sunroof, ventilated seats and BOSE audio. Full service history at Hyundai, never in an accident. Ready for transfer with all RTO papers.";

function AddVehicle({ has, compact }) {
  const writing = has("ai");
  const published = has("publish");
  const fields = [["Make", "Hyundai"], ["Model", "Creta SX(O)"], ["Year", "2022"], ["KMs", "28,400"], ["Fuel", "Petrol"], ["Owner", "1st"]];
  return (
    <Shell active="inv" title="Add vehicle" sub="Inventory · Apex Motors" compact={compact}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0, flexDirection: compact ? "column" : "row" }}>
        <div className="ui-card" style={{ width: compact ? "auto" : 280, flexShrink: 0 }}>
          <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: 9, background: "linear-gradient(160deg,#e9ecf7,#cfd5ea)", display: "grid", placeItems: "center", overflow: "hidden", marginBottom: 10 }}>
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ color: "#4f46e5" }}>
              <svg width="130" height="56" viewBox="0 0 130 56" fill="none"><path d="M10 40h110M14 38l8-14c2-3 5-5 9-5h56c4 0 7 2 10 5l12 14v8h-8M14 38v8h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><circle cx="34" cy="44" r="8" fill="#fff" stroke="currentColor" strokeWidth="3" /><circle cx="98" cy="44" r="8" fill="#fff" stroke="currentColor" strokeWidth="3" /><path d="M40 21l-6 11h26V21zM66 21v11h30l-8-11z" fill="rgba(79,70,229,.15)" /></svg>
            </motion.div>
            <span className="ui-badge accent" style={{ position: "absolute", left: 8, top: 8 }}><Icon name="rotate" size={11} />360° view</span>
          </div>
          {!compact && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {[0, 1, 2, 3].map((i) => <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: `linear-gradient(135deg, hsl(${230 + i * 8} 30% 88%), hsl(${230 + i * 8} 25% 76%))` }} />)}
            </div>
          )}
        </div>
        <div className="ui-card" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr 1fr" : "repeat(3, 1fr)", gap: 8 }}>
            {fields.slice(0, compact ? 4 : 6).map(([k, v]) => (
              <div key={k} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "6px 9px" }}>
                <div className="ui-muted" style={{ fontSize: 10 }}>{k}</div>
                <b style={{ fontSize: 12 }}>{v}</b>
              </div>
            ))}
          </div>
          <div className="ui-row" style={{ justifyContent: "space-between", margin: "12px 0 6px" }}>
            <b style={{ fontSize: 12 }}>Listing description</b>
            {!writing && <button type="button" className="ui-btn" data-tour="ai" style={{ color: "var(--accent)" }}><Icon name="spark" size={13} />Write with AI</button>}
            {writing && <span className="ui-badge accent"><Icon name="spark" size={11} />AI draft</span>}
          </div>
          <div style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 9, padding: 10, fontSize: 12, lineHeight: 1.6, color: writing ? "var(--text)" : "var(--muted)", minHeight: 70, overflow: "hidden" }}>
            {writing ? <Typewriter text={LISTING} cps={90} /> : "Describe the vehicle, or let AI write it from the details…"}
          </div>
          <div className="ui-row" style={{ marginTop: 10, justifyContent: "space-between" }}>
            <b style={{ fontSize: 16 }}>₹14,25,000</b>
            {published ? (
              <span className="ui-btn done" data-tour="publish"><Icon name="check" size={13} />Listed</span>
            ) : (
              <button type="button" className="ui-btn primary" data-tour="publish">Publish listing</button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {published && (
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="ui-card ui-row" style={{ position: "absolute", right: 18, bottom: 18, gap: 12, boxShadow: "0 16px 40px rgba(15,23,42,.18)", zIndex: 5 }}>
            <div style={{ width: 54, height: 54, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2, padding: 4, background: "#fff", border: "1px solid var(--line)", borderRadius: 6 }}>
              {Array.from({ length: 25 }, (_, i) => <span key={i} style={{ background: [0, 1, 2, 4, 5, 7, 9, 10, 14, 15, 17, 19, 20, 22, 23, 24, 12].includes(i) ? "#0f172a" : "transparent", borderRadius: 1 }} />)}
            </div>
            <div><b style={{ fontSize: 12 }}>QR vehicle profile ready</b><div className="ui-muted" style={{ fontSize: 11 }}>Stick it on the windscreen; buyers scan for details.</div></div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 3. Sale + invoice */

const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function Sale({ has, compact }) {
  const invoiced = has("invoice");
  const sale = 1425000;
  const purchase = 1260000;
  const margin = sale - purchase;
  const taxable = margin / 1.18;
  const gst = margin - taxable;
  return (
    <Shell active="sales" title="New sale" sub="Creta SX(O) 2022 · MH-12 TK 4417" compact={compact}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0, flexDirection: compact ? "column" : "row" }}>
        <div className="ui-card" style={{ flex: 1 }}>
          <div className="ui-card-h"><h3>GST Margin Scheme</h3><span className="ui-badge accent">Rule 32(5)</span></div>
          {[["Sale price", sale], ["Purchase price", purchase], ["Margin", margin, true], ["Taxable value", taxable], ["GST @ 18% on margin", gst, true]].map(([k, v, strong]) => (
            <div key={k} className="ui-row" style={{ justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>
              <span className={strong ? "" : "ui-muted"}>{k}</span>
              <b style={{ fontWeight: strong ? 700 : 500 }}>{inr(v)}</b>
            </div>
          ))}
          <div className="ui-muted" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>Tax is charged only on the dealer's margin, not on the full price, computed automatically on every sale.</div>
          <div className="ui-row" style={{ marginTop: 12 }}>
            {invoiced ? (
              <span className="ui-btn done" data-tour="invoice"><Icon name="check" size={13} />Invoice generated</span>
            ) : (
              <button type="button" className="ui-btn primary" data-tour="invoice"><Icon name="file" size={13} />Generate invoice</button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {invoiced && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ui-card" style={{ width: compact ? "auto" : 300, flexShrink: 0, fontSize: 11.5 }}>
              <div className="ui-row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <b style={{ fontSize: 13 }}>Tax invoice</b><span className="ui-muted">INV-2025-0419</span>
              </div>
              <div className="ui-muted" style={{ lineHeight: 1.6, marginBottom: 8 }}>Apex Motors · GSTIN 27AAB…1Z5<br />Buyer: Rahul Sharma, Pune</div>
              <div className="ui-row" style={{ justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--line)" }}><span>Margin scheme supply</span><b>{inr(sale)}</b></div>
              <div className="ui-row" style={{ justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--line)" }}><span>GST (on margin)</span><b>{inr(gst)}</b></div>
              <div style={{ marginTop: 10, fontWeight: 650, fontSize: 11 }}>RTO transfer pack</div>
              {["Form 29 · Notice of transfer", "Form 30 · Transfer of ownership", "Delivery note"].map((d, i) => (
                <motion.div key={d} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.2 }} className="ui-row" style={{ padding: "4px 0", gap: 6 }}>
                  <span style={{ color: "var(--ok)" }}><Icon name="check" size={12} /></span>{d}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 4. CRM */

const COLS = ["New", "Test drive", "Negotiation", "Won"];
const LEADS = [
  { id: "a", name: "Rahul S.", car: "Creta SX(O)", col: 2 },
  { id: "b", name: "Meera K.", car: "Baleno Alpha", col: 0 },
  { id: "c", name: "Arjun P.", car: "City VX", col: 1 },
  { id: "d", name: "Sana Q.", car: "Nexon XZ+", col: 0 },
  { id: "e", name: "Vikram D.", car: "XUV700 AX7", col: 3 },
];

function Crm({ has, compact }) {
  const won = has("won");
  const leads = LEADS.map((l) => (l.id === "a" && won ? { ...l, col: 3 } : l));
  const cols = compact ? [1, 2, 3] : [0, 1, 2, 3];
  return (
    <Shell active="crm" title="Leads" sub="128 open · 18 this week" compact={compact}>
      <LayoutGroup>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)`, gap: 10, flex: 1, minHeight: 0 }}>
          {cols.map((ci) => (
            <div key={ci} style={{ background: "var(--surface2)", borderRadius: 10, padding: 8, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <div className="ui-row" style={{ justifyContent: "space-between", padding: "2px 4px 4px" }}>
                <b style={{ fontSize: 11.5 }}>{COLS[ci]}</b>
                <span className="ui-muted" style={{ fontSize: 11 }}>{leads.filter((l) => l.col === ci).length}</span>
              </div>
              {leads.filter((l) => l.col === ci).map((l) => (
                <motion.div layoutId={l.id} key={l.id} transition={{ type: "spring", stiffness: 160, damping: 22 }}
                  className="ui-card" data-tour={l.id === "a" ? "lead" : undefined}
                  style={{ padding: 9, borderColor: l.id === "a" && won ? "var(--ok)" : undefined }}>
                  <b style={{ fontSize: 12 }}>{l.name}</b>
                  <div className="ui-muted" style={{ fontSize: 11 }}>{l.car}</div>
                  {l.id === "a" && !won && <button type="button" className="ui-btn" data-tour="won" style={{ height: 26, marginTop: 6, fontSize: 11 }}>Mark as won</button>}
                  {l.id === "a" && won && <span className="ui-badge ok" style={{ marginTop: 6 }}>Sold · ₹14.25 L</span>}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence>{won && <Toast>Sale recorded. Inventory and P&amp;L updated.</Toast>}</AnimatePresence>
    </Shell>
  );
}

const chapters = [
  {
    title: "Dashboard",
    caption: "A dealership's whole day on one screen: stock, sales, leads and profit.",
    Screen: Dashboard,
    tail: 1200,
    beats: [
      note("A dealership's whole day on one screen: stock, sales, leads and profit."),
      { at: 2600, target: "add", say: "Every dealership is a fully isolated tenant with its own roles." },
    ],
  },
  {
    title: "Add vehicle",
    caption: "Adding a car takes a minute: details, 360° photos, done.",
    Screen: AddVehicle,
    tail: 3200,
    beats: [
      note("Adding a car takes a minute: details, 360° photos, done."),
      tap("ai", "AI writes the listing from the vehicle's details.", 1800),
      tap("publish", "Publishing creates a QR vehicle profile buyers can scan on the lot.", 4200),
    ],
  },
  {
    title: "GST invoice",
    caption: "Used-car sales follow the GST Margin Scheme, worked out automatically.",
    Screen: Sale,
    tail: 3400,
    beats: [
      note("Used-car sales follow the GST Margin Scheme, worked out automatically."),
      tap("invoice", "One click: a compliant invoice plus the RTO transfer paperwork.", 2600),
    ],
  },
  {
    title: "CRM",
    caption: "Every lead from first enquiry to delivery.",
    Screen: Crm,
    tail: 3000,
    beats: [
      note("Every lead from first enquiry to delivery."),
      tap("won", "Closing a deal updates inventory and P&L in the same moment.", 2200),
    ],
  },
];

export default function MotoriqDemo() {
  return <ProductTour url="motoriq.in" badge="Demo data" theme={theme} chapters={chapters} />;
}
