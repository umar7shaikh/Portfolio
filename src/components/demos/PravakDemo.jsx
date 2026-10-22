// Pravak AI product tour. Callers, numbers and the clinic are demo data.
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductTour from "../tour/ProductTour.jsx";
import { note, tap } from "../tour/beats.js";
import { Icon, Wave } from "./kit.jsx";
import { useCountUp } from "./useCountUp.js";

const theme = {
  "--bg": "#0b100e",
  "--surface": "#111815",
  "--surface2": "#18211d",
  "--line": "#1f2a25",
  "--text": "#e7efe9",
  "--muted": "#7f9187",
  "--accent": "#f5b544",
  "--accent-soft": "rgba(245, 181, 68, 0.13)",
  "--accent-ink": "#1a1204",
  "--side": "#080c0a",
  "--side-text": "#71837a",
  "--side-active": "rgba(245, 181, 68, 0.1)",
  "--ok": "#34d399",
  "--ok-soft": "rgba(52, 211, 153, 0.13)",
  "--warn": "#f5b544",
  "--warn-soft": "rgba(245, 181, 68, 0.13)",
};

const NAV = [
  ["live", "Live calls", "phone"],
  ["agents", "Agents", "spark"],
  ["cal", "Calendar", "calendar"],
  ["analytics", "Analytics", "chart"],
  ["numbers", "Numbers", "msg"],
];

function Shell({ active, title, sub, compact, children, right }) {
  if (compact) {
    return (
      <div className="ui is-compact">
        <div className="ui-compact-top" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="ui-logo">P</span><b>Pravak</b>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>{title}</span>
        </div>
        <div className="ui-body">{children}</div>
      </div>
    );
  }
  return (
    <div className="ui">
      <aside className="ui-side" style={{ borderRight: "1px solid var(--line)" }}>
        <div className="ui-brand"><span className="ui-logo">P</span>Pravak</div>
        <div className="ui-org"><div>BrightSmile Dental<small>Voice agent · Hindi + English</small></div></div>
        {NAV.map(([key, l, icon]) => (
          <div key={key} className={`ui-nav${key === active ? " is-active" : ""}`}><Icon name={icon} />{l}
            {key === "live" && <span className="ui-count" style={{ background: "var(--ok)", color: "#04120c" }}>1</span>}
          </div>
        ))}
      </aside>
      <main className="ui-main">
        <div className="ui-top" style={{ background: "var(--side)" }}>
          <div><h1>{title}</h1>{sub && <div className="ui-sub">{sub}</div>}</div>
          <span style={{ marginLeft: "auto" }}>{right}</span>
        </div>
        <div className="ui-body">{children}</div>
      </main>
    </div>
  );
}

const TRANSCRIPT = [
  ["agent", "Thanks for calling BrightSmile Dental, this is Pravak. How can I help?"],
  ["caller", "Hi, I'd like to book a teeth cleaning sometime this week."],
  ["agent", "Of course. I have Wednesday at 4:00 or 5:30 pm. Which works better?"],
  ["caller", "5:30 on Wednesday, please. It's Priya Nair."],
  ["agent", "Done, Priya: Wednesday at 5:30 pm. I've sent the confirmation by SMS."],
];

function Line({ who, text, i }) {
  const agent = who === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: i ? 0.05 : 0 }}
      style={{ alignSelf: agent ? "flex-start" : "flex-end", maxWidth: "82%", padding: "8px 12px", borderRadius: agent ? "12px 12px 12px 3px" : "12px 12px 3px 12px", background: agent ? "var(--surface2)" : "var(--accent-soft)", border: `1px solid ${agent ? "var(--line)" : "rgba(245,181,68,.25)"}`, fontSize: 12, lineHeight: 1.5 }}
    >
      <div style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: agent ? "var(--ok)" : "var(--accent)", marginBottom: 2, fontWeight: 700 }}>{agent ? "Pravak" : "Caller"}</div>
      {text}
    </motion.div>
  );
}

function Timer({ start = 0 }) {
  const [s, setS] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</span>;
}

/* ------------------------------------------------------------------ 1+2. Live call */

function LiveCall({ has, compact, booking }) {
  const answered = booking || has("answer");
  const shown = booking ? 5 : [has("t1"), has("t2"), has("t3")].filter(Boolean).length + (answered ? 1 : 0);
  const lines = TRANSCRIPT.slice(0, booking ? (has("b2") ? 5 : has("b1") ? 4 : 3) : shown);
  const slots = booking && has("slots");
  const booked = booking && has("b2");
  return (
    <Shell active="live" title={answered ? "Live call" : "Incoming call"} sub="+91 98•••• 4417 · Pune" compact={compact}
      right={answered && <span className="ui-badge ok"><span className="kit-spin" style={{ width: 7, height: 7, borderWidth: 1.5 }} />Latency ~620 ms</span>}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0, flexDirection: compact ? "column" : "row" }}>
        <div className="ui-card" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
          {!answered ? (
            <div style={{ margin: "auto", textAlign: "center" }}>
              <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 14px", display: "grid", placeItems: "center", background: "var(--ok-soft)", color: "var(--ok)" }}>
                <Icon name="phone" size={26} />
              </motion.div>
              <b style={{ fontSize: 15 }}>+91 98•••• 4417</b>
              <div className="ui-muted" style={{ fontSize: 12, margin: "4px 0 14px" }}>New caller · Pune</div>
              <button type="button" className="ui-btn primary" data-tour="answer"><Icon name="spark" size={13} />Let Pravak answer</button>
            </div>
          ) : (
            <>
              <div className="ui-row" style={{ gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--line)", marginBottom: 10 }}>
                <span style={{ color: "var(--ok)" }}><Wave bars={compact ? 18 : 30} height={26} /></span>
                <span className="ui-muted" style={{ fontSize: 11.5, marginLeft: "auto" }}><Timer start={booking ? 34 : 0} /></span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden", justifyContent: "flex-end", flex: 1 }}>
                {lines.map(([w, t], i) => <Line key={i} who={w} text={t} i={i} />)}
              </div>
            </>
          )}
        </div>
        {!compact && (
          <div style={{ width: 230, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="ui-card">
              <div className="ui-card-h"><h3>Understanding</h3></div>
              {[
                ["Intent", answered && shown >= 2 ? "Book appointment" : "…"],
                ["Service", answered && shown >= 2 ? "Teeth cleaning" : "…"],
                ["Name", (booking && has("b1")) ? "Priya Nair" : "…"],
                ["Language", answered ? "English" : "…"],
              ].map(([k, v]) => (
                <div key={k} className="ui-row" style={{ justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
                  <span className="ui-muted">{k}</span><b style={{ color: v === "…" ? "var(--muted)" : "var(--text)" }}>{v}</b>
                </div>
              ))}
            </div>
            {booking && (
              <div className="ui-card">
                <div className="ui-card-h"><h3>Actions</h3></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {slots && <ActionRow icon="calendar" text="calendar.free_slots(Wed)" done />}
                  {has("b2") && <ActionRow icon="check" text="calendar.book(Wed 17:30)" done />}
                  {has("b2") && <ActionRow icon="msg" text="sms.send(confirmation)" done />}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <AnimatePresence>
        {booked && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", right: 18, bottom: 18, width: 240, padding: 12, borderRadius: 14, background: "#f5f7f6", color: "#0b100e", boxShadow: "0 16px 40px rgba(0,0,0,.4)", fontSize: 11.5, zIndex: 5 }}>
            <div className="ui-row" style={{ gap: 6, fontSize: 10, color: "#5b6b62", marginBottom: 4 }}><Icon name="msg" size={11} />SMS · BrightSmile</div>
            Hi Priya, your teeth cleaning is booked for Wed, 5:30 PM. Reply C to cancel.
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}

function ActionRow({ icon, text }) {
  return (
    <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="ui-row" style={{ gap: 7, fontSize: 11, fontFamily: "ui-monospace, monospace", padding: "5px 8px", borderRadius: 6, background: "var(--surface2)" }}>
      <span style={{ color: "var(--ok)" }}><Icon name={icon} size={12} /></span>{text}
    </motion.div>
  );
}

const Booking = (p) => <LiveCall {...p} booking />;

/* ------------------------------------------------------------------ 3. Handoff */

function Handoff({ has, compact }) {
  const transferred = has("transfer");
  return (
    <Shell active="live" title="Live call" sub="+91 99•••• 2208 · Mumbai" compact={compact}>
      <div className="ui-card" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
        <Line who="caller" text="My insurance claim from last month was rejected and I want to understand why." i={0} />
        <Line who="agent" text="I'm sorry about that, Mr. Rao. Claims need someone from our billing team. I'm connecting you now and passing on everything you've told me." i={1} />
        <div style={{ marginTop: "auto" }}>
          {!transferred ? (
            <button type="button" className="ui-btn primary" data-tour="transfer"><Icon name="users" size={13} />Hand off to billing</button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ui-card" style={{ background: "var(--surface2)" }}>
              <div className="ui-row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                <b style={{ fontSize: 12.5 }}>Handoff summary → Anita (Billing)</b>
                <span className="ui-badge ok">Connected</span>
              </div>
              {[["Caller", "Suresh Rao, existing patient"], ["Issue", "Insurance claim rejected (Sept visit)"], ["Mood", "Frustrated, calm"], ["Already tried", "Called insurer, told to contact clinic"]].map(([k, v]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", fontSize: 12, padding: "3px 0" }}>
                  <span className="ui-muted">{k}</span><span>{v}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ 4. Analytics */

const HOURS = [8, 14, 22, 31, 26, 19, 24, 33, 28, 17, 11, 6];

function Analytics({ compact }) {
  const calls = useCountUp(142);
  const booked = useCountUp(38);
  return (
    <Shell active="analytics" title="Today" sub="Every call answered, around the clock" compact={compact}>
      <div className="ui-kpis">
        <div className="ui-card ui-kpi"><small>Calls handled</small><b>{calls}</b></div>
        <div className="ui-card ui-kpi"><small>Answered</small><b>100%</b></div>
        {!compact && <div className="ui-card ui-kpi"><small>Appointments</small><b>{booked}</b></div>}
        {!compact && <div className="ui-card ui-kpi"><small>Handed to staff</small><b>9</b></div>}
      </div>
      <div className="ui-grid2" style={{ flex: 1 }}>
        <div className="ui-card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="ui-card-h"><h3>Calls by hour</h3><span>8 AM to 8 PM</span></div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, minHeight: 110 }}>
            {HOURS.map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(h / 33) * 100}%` }} transition={{ delay: i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ flex: 1, borderRadius: "5px 5px 2px 2px", background: h > 25 ? "var(--accent)" : "rgba(245,181,68,.3)" }} />
            ))}
          </div>
        </div>
        <div className="ui-card">
          <div className="ui-card-h"><h3>Recent</h3></div>
          {[["Priya N.", "Booked · Wed 5:30", "ok"], ["Suresh R.", "To billing", "warn"], ["Unknown", "Hours enquiry", ""], ["Kavya M.", "Rescheduled", "ok"]].map(([n, o, k]) => (
            <div key={n} className="ui-row" style={{ justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: 12 }}>
              <span>{n}</span><span className={`ui-badge ${k}`}>{o}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

const chapters = [
  {
    title: "Answers calls",
    caption: "Pravak picks up every call, in natural conversation.",
    Screen: LiveCall,
    tail: 1600,
    beats: [
      note("Pravak picks up every call, in natural conversation."),
      tap("answer", "Streaming speech-to-text, an LLM that knows the business, expressive TTS.", 1500),
      note("It understands the request as the caller speaks.", 1500, "t1"),
      note("It understands the request as the caller speaks.", 2200, "t2"),
      note("…and replies in under a second.", 2200, "t3"),
    ],
  },
  {
    title: "Takes action",
    caption: "It doesn't just talk: it checks the calendar and books.",
    Screen: Booking,
    tail: 3600,
    beats: [
      note("It doesn't just talk: it checks the calendar and books.", 0, "slots"),
      note("It doesn't just talk: it checks the calendar and books.", 2000, "b1"),
      note("Slot reserved, confirmation sent by SMS, all during the call.", 2000, "b2"),
    ],
  },
  {
    title: "Hands off",
    caption: "When a human is needed, it hands off cleanly.",
    Screen: Handoff,
    tail: 3600,
    beats: [
      note("When a human is needed, it hands off cleanly."),
      tap("transfer", "Staff get the full context, so the caller never repeats themselves.", 2200),
    ],
  },
  {
    title: "Analytics",
    caption: "Never a missed call: every outcome is logged and measured.",
    Screen: Analytics,
    tail: 4200,
    beats: [note("Never a missed call: every outcome is logged and measured.")],
  },
];

export default function PravakDemo() {
  return <ProductTour url="Pravak · agent console" badge="Demo data" theme={theme} chapters={chapters} />;
}
