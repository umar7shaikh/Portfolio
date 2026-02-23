// src/components/ContactMe.jsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
  }),
};

const Contacts = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (res) => {
          console.log("SUCCESS", res.status, res.text);
          setStatus("Message sent successfully.");
          setSending(false);
          formRef.current.reset();
        },
        (err) => {
          console.error("EMAILJS ERROR", err);
          setStatus("Something went wrong. Please try again.");
          setSending(false);
        }
      );
  };

  return (
    <section
      id="contact"
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
      }}
    >
      {/* Top editorial label */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "18px 64px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
        className="contact-label-bar"
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#444",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Contact
        </span>
        <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "88vh",
        }}
        className="contact-grid"
      >
        {/* ── LEFT: Heading + Info ── */}
        <div
          style={{
            padding: "72px 64px",
            borderRight: "1px solid #1a1a1a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="contact-left"
        >
          <div>
            {/* Big heading */}
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              style={{
                fontSize: "clamp(40px, 5vw, 76px)",
                fontWeight: "700",
                color: "#f0f0f0",
                lineHeight: "1.05",
                letterSpacing: "-0.03em",
                fontFamily: "'Inter', sans-serif",
                marginBottom: "64px",
              }}
            >
              Let's work<br />
              <span style={{ color: "#444" }}>together.</span>
            </motion.h2>

            {/* Contact info rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {/* Email row */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                style={{
                  padding: "24px 0",
                  borderTop: "1px solid #1a1a1a",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#3a3a3a",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Email
                </span>
                <a
                  href="mailto:muhammedumarshaikh7@gmail.com"
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    fontFamily: "'Inter', sans-serif",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  className="contact-link"
                >
                  muhammedumarshaikh7@gmail.com
                </a>
              </motion.div>

              {/* GitHub row */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
                style={{
                  padding: "24px 0",
                  borderTop: "1px solid #1a1a1a",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#3a3a3a",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  GitHub
                </span>
                <a
                  href="https://github.com/umar7shaikh"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    fontFamily: "'Inter', sans-serif",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  className="contact-link"
                >
                  github.com/umar7shaikh
                </a>
              </motion.div>

              {/* LinkedIn row */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3}
                style={{
                  padding: "24px 0",
                  borderTop: "1px solid #1a1a1a",
                  borderBottom: "1px solid #1a1a1a",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#3a3a3a",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  LinkedIn
                </span>
                <a
                  href="https://www.linkedin.com/in/muhammed-umar-shaikh-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    fontFamily: "'Inter', sans-serif",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  className="contact-link"
                >
                  Muhammed Umar Shaikh
                </a>
              </motion.div>
            </div>
          </div>

          {/* Footer copyright */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            style={{
              fontSize: "12px",
              color: "#2e2e2e",
              fontFamily: "'Inter', sans-serif",
              marginTop: "48px",
            }}
          >
            © 2025 Muhammed Umar. All rights reserved.
          </motion.p>
        </div>

        {/* ── RIGHT: Form ── */}
        <div
          style={{
            padding: "72px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          className="contact-right"
        >
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            {/* Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label
                htmlFor="user_name"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#3a3a3a",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Name
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                placeholder="Your full name"
                required
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #222",
                  padding: "12px 0",
                  fontSize: "15px",
                  color: "#d0d0d0",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s",
                  width: "100%",
                }}
                className="contact-input"
              />
            </div>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label
                htmlFor="user_email"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#3a3a3a",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Email
              </label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                placeholder="your@email.com"
                required
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #222",
                  padding: "12px 0",
                  fontSize: "15px",
                  color: "#d0d0d0",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s",
                  width: "100%",
                }}
                className="contact-input"
              />
            </div>

            {/* Message */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label
                htmlFor="message"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#3a3a3a",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell me about your project..."
                required
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #222",
                  padding: "12px 0",
                  fontSize: "15px",
                  color: "#d0d0d0",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                  resize: "none",
                  transition: "border-color 0.2s",
                  width: "100%",
                }}
                className="contact-input"
              />
            </div>

            {/* Submit */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={sending}
                style={{
                  background: sending ? "#1a1a1a" : "#f0f0f0",
                  color: sending ? "#555" : "#0a0a0a",
                  border: "none",
                  padding: "16px 40px",
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: "600",
                  cursor: sending ? "not-allowed" : "pointer",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                className="contact-btn"
              >
                {sending ? "Sending..." : "Send Message"}
                {!sending && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              {status && (
                <p
                  style={{
                    fontSize: "13px",
                    color: status.includes("successfully") ? "#6a6a6a" : "#7a3a3a",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {status}
                </p>
              )}
            </div>
          </motion.form>
        </div>
      </div>

      {/* Responsive + interaction styles */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-left {
            padding: 56px 28px !important;
            border-right: none !important;
            border-bottom: 1px solid #1a1a1a !important;
          }
          .contact-right {
            padding: 48px 28px 64px !important;
          }
          .contact-label-bar {
            padding: 18px 28px !important;
          }
        }
        .contact-input:focus {
          border-bottom-color: #555 !important;
        }
        .contact-input::placeholder {
          color: #333;
        }
        .contact-link:hover {
          color: #d0d0d0 !important;
        }
        .contact-btn:hover:not(:disabled) {
          background: #ffffff !important;
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
};

export default Contacts;
