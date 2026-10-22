// MedBot product tour. Patients and doctors are demo data; MedBot gives
// general health information, not a diagnosis, and the demo says so.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductTour from "../tour/ProductTour.jsx";
import { note, tap } from "../tour/beats.js";
import { Icon, Typewriter, Wave, Toast } from "./kit.jsx";

const theme = {
  "--bg": "#f4f7fb",
  "--surface": "#ffffff",
  "--surface2": "#eef3f9",
  "--line": "#e1e8f1",
  "--text": "#0f1e33",
  "--muted": "#5f7088",
  "--accent": "#2563eb",
  "--accent-soft": "rgba(37, 99, 235, 0.1)",
  "--accent-ink": "#ffffff",
  "--side": "#0c1a30",
  "--side-text": "#8796ad",
  "--side-active": "rgba(96, 165, 250, 0.14)",
};

const NAV = [
  ["chat", "AI Assistant", "spark"],
  ["appt", "Appointments", "calendar"],
  ["meds", "Medications", "file"],
  ["patients", "Patients", "users"],
];

function Shell({ active, title, sub, compact, role = "Patient", children }) {
  if (compact) {
    return (
      <div className="ui is-compact">
        <div className="ui-compact-top"><span className="ui-logo"><Icon name="heart" size={13} /></span><b>MedBot</b>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--side-text)" }}>{role}</span></div>
        <div className="ui-top"><div><h1 style={{ fontSize: 13 }}>{title}</h1>{sub && <div className="ui-sub">{sub}</div>}</div></div>
        <div className="ui-body">{children}</div>
      </div>
    );
  }
  return (
    <div className="ui">
      <aside className="ui-side">
        <div className="ui-brand"><span className="ui-logo"><Icon name="heart" size={13} /></span>MedBot</div>
        <div className="ui-org"><div>{role === "Patient" ? "Priya Nair" : "Dr. A. Kulkarni"}<small>{role}</small></div></div>
        {NAV.filter(([k]) => (role === "Patient" ? k !== "patients" : true)).map(([key, l, icon]) => (
          <div key={key} className={`ui-nav${key === active ? " is-active" : ""}`}><Icon name={icon} />{l}</div>
        ))}
        <div style={{ marginTop: "auto", padding: 10, fontSize: 10.5, lineHeight: 1.5, borderRadius: 8, background: "rgba(255,255,255,0.04)" }}>
          JWT sessions with role-based access for patients and clinicians.
        </div>
      </aside>
      <main className="ui-main">
        <div className="ui-top">
          <div><h1>{title}</h1>{sub && <div className="ui-sub">{sub}</div>}</div>
          <div className="ui-seg" style={{ marginLeft: "auto" }}>
            <button type="button" className="is-on">English</button>
            <button type="button">हिन्दी</button>
          </div>
        </div>
        <div className="ui-body">{children}</div>
      </main>
    </div>
  );
}

const QUESTION = "I've had a mild headache since this morning. What should I do?";
const ANSWER = "A mild headache that started today is most often linked to dehydration, screen strain, poor sleep or skipped meals.";

function Chat({ has, compact }) {
  const listening = has("mic") && !has("heard");
  const heard = has("heard");
  const answered = has("answer");
  const speaking = has("speak");
  return (
    <Shell active="chat" title="AI Assistant" sub="General health information · not a diagnosis" compact={compact}>
      <div className="ui-card" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0, overflow: "hidden" }}>
        {!heard && (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <motion.button type="button" data-tour="mic"
              animate={listening ? { boxShadow: ["0 0 0 0 rgba(37,99,235,.45)", "0 0 0 18px rgba(37,99,235,0)"] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: 74, height: 74, borderRadius: "50%", border: "none", background: listening ? "var(--accent)" : "var(--accent-soft)", color: listening ? "#fff" : "var(--accent)", display: "grid", placeItems: "center", margin: "0 auto 14px", cursor: "pointer" }}>
              <Icon name="mic" size={28} />
            </motion.button>
            {listening ? (
              <>
                <div style={{ color: "var(--accent)", display: "flex", justifyContent: "center" }}><Wave bars={26} height={30} /></div>
                <div className="ui-muted" style={{ fontSize: 12, marginTop: 8 }}>Listening… (Whisper)</div>
              </>
            ) : (
              <>
                <b style={{ fontSize: 15 }}>Ask MedBot by voice</b>
                <div className="ui-muted" style={{ fontSize: 12, marginTop: 4 }}>Tap the mic and describe how you feel</div>
              </>
            )}
          </div>
        )}
        {heard && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ alignSelf: "flex-end", maxWidth: "78%", background: "var(--accent)", color: "#fff", padding: "9px 13px", borderRadius: "12px 12px 3px 12px", fontSize: 12.5 }}>
            <div className="ui-row" style={{ gap: 5, fontSize: 10, opacity: 0.75, marginBottom: 2 }}><Icon name="mic" size={10} />Transcribed</div>
            {QUESTION}
          </motion.div>
        )}
        {heard && !answered && (
          <div className="ui-row ui-muted" style={{ fontSize: 12, gap: 8 }}><span className="kit-spin" />Thinking…</div>
        )}
        {answered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: "92%", fontSize: 12.5, lineHeight: 1.6 }}>
            <Typewriter text={ANSWER} cps={80} />
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}
              style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", gap: 8, marginTop: 10 }}>
              <div style={{ padding: 10, borderRadius: 9, background: "var(--surface2)" }}>
                <b style={{ fontSize: 11.5 }}>Try now</b>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>Water, a short screen break, rest in a dim room, a light meal.</div>
              </div>
              <div style={{ padding: 10, borderRadius: 9, background: "rgba(220,38,38,.07)" }}>
                <b style={{ fontSize: 11.5, color: "var(--bad)" }}>See a doctor if</b>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>It's sudden and severe, with fever, stiff neck or vision changes.</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="ui-row" style={{ marginTop: 10, gap: 8 }}>
              <button type="button" className="ui-btn" data-tour="speak" style={{ color: "var(--accent)" }}>
                <Icon name="play" size={12} />{speaking ? "Playing" : "Listen"}
              </button>
              {speaking && <span style={{ color: "var(--accent)" }}><Wave bars={22} height={20} seed={2} /></span>}
              {speaking && <span className="ui-muted" style={{ fontSize: 11 }}>ElevenLabs voice</span>}
            </motion.div>
          </motion.div>
        )}
      </div>
    </Shell>
  );
}

const SLOTS = ["10:00", "11:30", "14:00", "16:30", "17:15", "18:00"];

function Appointments({ has, compact }) {
  const picked = has("slot");
  const booked = has("book");
  return (
    <Shell active="appt" title="Book a consultation" sub="General physician · in person or video" compact={compact}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0, flexDirection: compact ? "column" : "row" }}>
        <div className="ui-card" style={{ width: compact ? "auto" : 250, flexShrink: 0 }}>
          <div className="ui-row" style={{ gap: 10 }}>
            <span className="ui-avatar" style={{ width: 40, height: 40, fontSize: 13 }}>AK</span>
            <div><b style={{ fontSize: 13 }}>Dr. Anjali Kulkarni</b><div className="ui-muted" style={{ fontSize: 11.5 }}>MBBS, MD · 11 yrs</div></div>
          </div>
          <div style={{ marginTop: 12, padding: 10, borderRadius: 9, background: "var(--surface2)", fontSize: 11.5, lineHeight: 1.5 }}>
            <b>Shared with the doctor</b>
            <div className="ui-muted">Your AI chat summary: mild headache since morning, no red flags.</div>
          </div>
        </div>
        <div className="ui-card" style={{ flex: 1 }}>
          <div className="ui-card-h"><h3>Thursday, 24 Oct</h3><span>6 slots open</span></div>
          <div style={{ display: "grid", gridTemplateColumns: compact ? "repeat(3,1fr)" : "repeat(3, 1fr)", gap: 8 }}>
            {SLOTS.map((s) => {
              const on = picked && s === "17:15";
              return (
                <button key={s} type="button" data-tour={s === "17:15" ? "slot" : undefined} className="ui-btn"
                  style={{ height: 40, background: on ? "var(--accent)" : undefined, color: on ? "#fff" : undefined, borderColor: on ? "var(--accent)" : undefined }}>
                  {s}
                </button>
              );
            })}
          </div>
          <div className="ui-row" style={{ marginTop: 16 }}>
            {booked ? (
              <span className="ui-btn done" data-tour="book"><Icon name="check" size={13} />Booked · Thu 5:15 PM</span>
            ) : (
              <button type="button" className="ui-btn primary" data-tour="book" disabled={!picked}>Confirm booking</button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>{booked && <Toast>Appointment confirmed. Reminder set for Thursday.</Toast>}</AnimatePresence>
    </Shell>
  );
}

const PATIENTS = [
  ["Priya Nair", "Mild headache since morning", "Low", "ok"],
  ["Rohan Mehta", "Chest tightness on exertion", "Urgent", "bad"],
  ["Fatima S.", "Follow-up: BP medication", "Routine", ""],
  ["Karan J.", "Persistent cough, 2 weeks", "Medium", "warn"],
];

function Clinician({ has, compact }) {
  const open = has("patient");
  return (
    <Shell active="patients" role="Clinician" title="Today's patients" sub="Triage from AI conversations" compact={compact}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0, flexDirection: compact ? "column" : "row" }}>
        <div className="ui-card" style={{ flex: 1, minWidth: 0 }}>
          <table className="ui-table">
            <thead><tr><th>Patient</th>{!compact && <th>Reason</th>}<th>Triage</th></tr></thead>
            <tbody>
              {PATIENTS.map(([n, r, t, k]) => (
                <tr key={n} data-tour={n === "Rohan Mehta" ? "patient" : undefined} style={{ background: open && n === "Rohan Mehta" ? "var(--accent-soft)" : undefined }}>
                  <td><b>{n}</b></td>{!compact && <td className="ui-muted">{r}</td>}<td><span className={`ui-badge ${k}`}>{t}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="ui-card" style={{ width: compact ? "auto" : 280, flexShrink: 0, fontSize: 12 }}>
              <div className="ui-card-h"><h3>Rohan Mehta, 52</h3><span className="ui-badge bad">Urgent</span></div>
              <div className="ui-muted" style={{ fontSize: 11, marginBottom: 6 }}>AI conversation summary</div>
              <div style={{ lineHeight: 1.6 }}>Chest tightness when climbing stairs for 3 days. MedBot advised in-person care today and flagged for review.</div>
              <div className="ui-row" style={{ gap: 8, marginTop: 12 }}>
                <button type="button" className="ui-btn primary">Call patient</button>
                <button type="button" className="ui-btn">Full chat</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  );
}

const chapters = [
  {
    title: "Ask by voice",
    caption: "Patients ask in their own words, by voice.",
    Screen: Chat,
    tail: 2600,
    beats: [
      note("Patients ask in their own words, by voice."),
      tap("mic", "Whisper turns speech into text in real time.", 1500),
      note("Whisper turns speech into text in real time.", 2600, "heard"),
      note("Llama 4 Maverick answers in plain language, with clear red flags.", 1300, "answer"),
      tap("speak", "ElevenLabs reads the answer back in a natural voice.", 3200),
    ],
  },
  {
    title: "Book a doctor",
    caption: "From answer to appointment in two taps.",
    Screen: Appointments,
    tail: 3000,
    beats: [
      note("From answer to appointment in two taps."),
      tap("slot", "The AI chat summary travels with the booking.", 1800),
      tap("book", "Confirmed, with a reminder set.", 1200),
    ],
  },
  {
    title: "Clinician view",
    caption: "Clinicians see patients triaged from their AI conversations.",
    Screen: Clinician,
    tail: 3600,
    beats: [
      note("Clinicians see patients triaged from their AI conversations."),
      tap("patient", "Urgent cases rise to the top with the context already written up.", 2000),
    ],
  },
];

export default function MedBotDemo() {
  return <ProductTour url="ai-medbot.vercel.app" badge="Demo data" theme={theme} chapters={chapters} />;
}
