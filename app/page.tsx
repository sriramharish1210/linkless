"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Preloader from "@/components/Preloader";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";



const DEMO_MESSAGES = [
  "Need a doctor for my injured father.",
  "Looking for food near the station.",
  "Shelter needed for a family of 3.",
  "Need transport to reach the hospital.",
];

const CHIP_CONFIGS = [
  [
    { label: "Medical", cls: "chip-category" },
    { label: "High Priority", cls: "chip-priority" },
    { label: "Location Detected", cls: "chip-signal" },
    { label: "6 Responders Found", cls: "chip-success" },
  ],
  [
    { label: "Food", cls: "chip-category" },
    { label: "Medium Priority", cls: "chip-warn" },
    { label: "Location Detected", cls: "chip-signal" },
    { label: "4 Responders Found", cls: "chip-success" },
  ],
  [
    { label: "Shelter", cls: "chip-category" },
    { label: "High Priority", cls: "chip-priority" },
    { label: "Location Detected", cls: "chip-signal" },
    { label: "3 Responders Found", cls: "chip-success" },
  ],
  [
    { label: "Transport", cls: "chip-category" },
    { label: "Urgent", cls: "chip-priority" },
    { label: "Location Detected", cls: "chip-signal" },
    { label: "2 Responders Found", cls: "chip-success" },
  ],
];

function TypingDemo() {
  const [typed, setTyped] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [chipsVisible, setChipsVisible] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [erasing, setErasing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const msg = DEMO_MESSAGES[msgIdx];

    if (!erasing) {
      if (typed.length < msg.length) {
        timerRef.current = setTimeout(
          () => setTyped(msg.slice(0, typed.length + 1)),
          45 + Math.random() * 28
        );
      } else {
        timerRef.current = setTimeout(() => {
          setChipsVisible([true, true, true, true]);
          setTimeout(() => {
            setChipsVisible([false, false, false, false]);
            setTimeout(() => setErasing(true), 200);
          }, 2600);
        }, 300);
      }
    } else {
      if (typed.length > 0) {
        timerRef.current = setTimeout(
          () => setTyped(typed.slice(0, -1)),
          14
        );
      } else {
        setErasing(false);
        setMsgIdx((prev) => (prev + 1) % DEMO_MESSAGES.length);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [typed, erasing, msgIdx]);

  const chips = CHIP_CONFIGS[msgIdx];

  return (
    <div
      style={{
        background: "var(--ink)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
          <div
            key={c}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
              opacity: 0.7,
            }}
          />
        ))}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "var(--muted)",
            marginLeft: 8,
          }}
        >
          linkless.ai / send
        </span>
      </div>

      <div style={{ padding: 24 }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--muted)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          What do you need?
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "14px 16px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "var(--text)",
            minHeight: 52,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>{typed}</span>
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 16,
              background: "var(--signal)",
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "blink 0.9s step-end infinite",
            }}
          />
        </div>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--muted)",
            textTransform: "uppercase",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          AI Analysis
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {chips.map((chip, i) => (
            <motion.div
              key={`${msgIdx}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={
                chipsVisible[i]
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.35, delay: i * 0.1 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                padding: "5px 12px",
                borderRadius: 20,
                border: "1px solid",
                ...(chip.cls === "chip-category"
                  ? {
                      color: "#a78bfa",
                      borderColor: "rgba(167,139,250,0.3)",
                      background: "rgba(124,58,237,0.08)",
                    }
                  : chip.cls === "chip-priority"
                  ? {
                      color: "#f87171",
                      borderColor: "rgba(239,68,68,0.3)",
                      background: "rgba(239,68,68,0.07)",
                    }
                  : chip.cls === "chip-signal"
                  ? {
                      color: "#7aa2ff",
                      borderColor: "rgba(79,127,255,0.3)",
                      background: "rgba(79,127,255,0.07)",
                    }
                  : chip.cls === "chip-warn"
                  ? {
                      color: "#fbbf24",
                      borderColor: "rgba(245,158,11,0.3)",
                      background: "rgba(245,158,11,0.07)",
                    }
                  : {
                      color: "#4ade80",
                      borderColor: "rgba(34,197,94,0.3)",
                      background: "rgba(34,197,94,0.06)",
                    }),
              }}
            >
              {chip.label}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Show preloader on every hard page load (including refresh)
    // but skip on client-side navigation within the app
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isClientNav = navEntry ? navEntry.type === "navigate" && sessionStorage.getItem("ll_navigated") === "1" : false;
    if (isClientNav) {
      setReady(true);
      setShowPreloader(false);
    } else {
      sessionStorage.removeItem("ll_navigated");
      setShowPreloader(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    let timeout: ReturnType<typeof setTimeout>;
    function scheduleGlitch() {
      timeout = setTimeout(
        () => {
          setGlitchActive(true);
          setTimeout(() => {
            setGlitchActive(false);
            scheduleGlitch();
          }, 280);
        },
        2800 + Math.random() * 4000
      );
    }
    scheduleGlitch();
    return () => clearTimeout(timeout);
  }, [ready]);

  return (
    <>
      {showPreloader && (
        <Preloader
          onComplete={() => {
            sessionStorage.setItem("ll_navigated", "1");
            setReady(true);
            setShowPreloader(false);
          }}
        />
      )}

      {ready && (
        <div style={{ position: "relative" }}>
          <Background />
          <Navbar />

          <style>{`
            @keyframes blink { 50% { opacity: 0; } }
            @keyframes signalDrop {
              0% { opacity: 0; top: 8%; }
              30% { opacity: 0.5; }
              70% { opacity: 0.5; }
              100% { opacity: 0; top: 92%; }
            }
            @keyframes scrollBob {
              0%, 100% { transform: translateY(0); opacity: 1; }
              50% { transform: translateY(5px); opacity: 0.25; }
            }
            .nav-links-desktop { display: flex; }
            @media (max-width: 768px) {
              .nav-links-desktop { display: none !important; }
            }
          `}</style>

          <section
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 24px",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            {[22, 55, 80].map((left, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 1,
                  height: 100,
                  background:
                    "linear-gradient(to bottom, transparent, rgba(79,127,255,0.6), transparent)",
                  left: `${left}%`,
                  animation: `signalDrop 4s ease-in-out infinite`,
                  animationDelay: `${i * 1.4}s`,
                  opacity: 0,
                }}
              />
            ))}

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.18em",
                color: "var(--signal)",
                textTransform: "uppercase",
                marginBottom: 28,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 28,
                  height: 1,
                  background: "var(--signal)",
                  opacity: 0.5,
                }}
              />
              Anonymous · Instant · Human
              <span
                style={{
                  display: "block",
                  width: 28,
                  height: 1,
                  background: "var(--signal)",
                  opacity: 0.5,
                }}
              />
            </motion.p>

            <div
              style={{
                marginBottom: 28,
                overflow: "hidden",
              }}
            >
              {["WHEN", "NAMES"].map((word, i) => (
                <div key={word} style={{ overflow: "hidden" }}>
                  <motion.div
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.05 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "clamp(60px, 11vw, 128px)",
                      fontWeight: 700,
                      lineHeight: 0.92,
                      letterSpacing: "-0.04em",
                      color: "var(--text)",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      {glitchActive && i === 1 && (
                        <>
                          <span
                            style={{
                              position: "absolute",
                              inset: 0,
                              color: "var(--signal)",
                              clipPath: "polygon(0 25%, 100% 25%, 100% 45%, 0 45%)",
                              transform: "translateX(-3px)",
                            }}
                          >
                            {word}
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              inset: 0,
                              color: "#EF4444",
                              clipPath: "polygon(0 58%, 100% 58%, 100% 76%, 0 76%)",
                              transform: "translateX(3px)",
                            }}
                          >
                            {word}
                          </span>
                        </>
                      )}
                      {word}
                    </span>
                  </motion.div>
                </div>
              ))}

              <div style={{ overflow: "visible" }}>
                <motion.div
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.29,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(60px, 11vw, 128px)",
                    fontWeight: 700,
                    lineHeight: 0.92,
                    letterSpacing: "-0.04em",
                    paddingRight: "0.06em",
                    background: "linear-gradient(90deg, #c8d8ff 0%, #4F7FFF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  DISAPPEAR
                </motion.div>
              </div>

              <div style={{ overflow: "hidden" }}>
                <motion.div
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.42,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontStyle: "italic",
                    fontSize: "clamp(22px, 4vw, 56px)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    letterSpacing: "0.02em",
                    color: "var(--muted)",
                    marginTop: 8,
                  }}
                >
                  intent remains.
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(14px, 2vw, 17px)",
                fontWeight: 300,
                color: "var(--dim)",
                lineHeight: 1.75,
                maxWidth: 460,
                marginBottom: 44,
              }}
            >
              Emergency communication for a world without identities. Describe
              what you need. AI routes it to the right hands. No login. No name.
              No trace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Link href="/send" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(79,127,255,0.38)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#fff",
                    background: "var(--signal)",
                    border: "none",
                    padding: "16px 40px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  SEND A SIGNAL
                </motion.button>
              </Link>

              <Link href="/responders" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "var(--text)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.18)",
                    padding: "16px 40px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onHoverStart={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                  onHoverEnd={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                >
                  BECOME A RESPONDER
                </motion.button>
              </Link>
            </motion.div>
          </section>

          <section
            id="how"
            style={{
              position: "relative",
              zIndex: 1,
              padding: "96px 24px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  color: "var(--signal)",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 16,
                }}
              >
                How it works
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  lineHeight: 1.1,
                  marginBottom: 56,
                  maxWidth: 440,
                }}
              >
                Five steps between need and help
              </motion.h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 1,
                  background: "var(--border)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {[
                  {
                    n: "01",
                    title: "Type your need",
                    desc: "No account. No name. Plain language.",
                  },
                  {
                    n: "02",
                    title: "AI parses intent",
                    desc: "Gemini extracts category and priority instantly.",
                  },
                  {
                    n: "03",
                    title: "Signal routes",
                    desc: "Your request reaches nearby responders.",
                  },
                  {
                    n: "04",
                    title: "Help responds",
                    desc: "Responders see need, distance, priority.",
                  },
                  {
                    n: "05",
                    title: "Need met",
                    desc: "Connection made. No identities exchanged.",
                  },
                ].map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    style={{
                      background: "var(--ink)",
                      padding: "32px 24px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--card)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--ink)")
                    }
                  >
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        color: "var(--signal)",
                        display: "block",
                        marginBottom: 24,
                      }}
                    >
                      {step.n}
                    </span>
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: 10,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        color: "var(--dim)",
                        lineHeight: 1.6,
                      }}
                    >
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section
            style={{
              position: "relative",
              zIndex: 1,
              padding: "96px 24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "center",
              maxWidth: 1100,
              margin: "0 auto",
            }}
            className="demo-grid"
          >
            <style>{`
              @media (max-width: 768px) {
                .demo-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
              }
            `}</style>

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  color: "var(--signal)",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 16,
                }}
              >
                Intent Engine
              </span>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  lineHeight: 1.1,
                  marginBottom: 20,
                }}
              >
                You speak.
                <br />
                AI translates.
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  fontWeight: 300,
                  color: "var(--dim)",
                  lineHeight: 1.75,
                  maxWidth: 420,
                }}
              >
                No forms. No dropdowns. Describe what you need and Gemini
                understands urgency, category, and reach automatically.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <TypingDemo />
            </motion.div>
          </section>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              background: "var(--border)",
            }}
            className="stats-bar-grid"
          >
            <style>{`
              @media (max-width: 640px) {
                .stats-bar-grid { grid-template-columns: 1fr 1fr !important; }
              }
            `}</style>
            {[
              { num: "0", suffix: "ms", label: "login time" },
              { num: "5", suffix: "+", label: "need categories" },
              { num: "100", suffix: "%", label: "anonymous" },
              { num: "AI", suffix: ".", label: "powered routing" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  background: "var(--void)",
                  padding: "40px 24px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(32px, 5vw, 52px)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "var(--text)",
                    display: "block",
                  }}
                >
                  {stat.num}
                  <span style={{ color: "var(--signal)" }}>{stat.suffix}</span>
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "var(--muted)",
                    display: "block",
                    marginTop: 4,
                    letterSpacing: "0.04em",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          <section
            style={{
              position: "relative",
              zIndex: 1,
              padding: "120px 24px",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 600,
                height: 600,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(79,127,255,0.07) 0%, transparent 70%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "var(--text)",
                lineHeight: 1.0,
                marginBottom: 20,
                position: "relative",
              }}
            >
              Ready to
              <br />
              <span style={{ color: "var(--signal)" }}>reconnect</span>
              <br />
              humanity?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                color: "var(--dim)",
                marginBottom: 48,
                position: "relative",
              }}
            >
              No account needed. No trace left behind.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              <Link href="/send" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(79,127,255,0.38)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#fff",
                    background: "var(--signal)",
                    border: "none",
                    padding: "16px 40px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  SEND A SIGNAL
                </motion.button>
              </Link>
              <Link href="/responders" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "var(--text)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.18)",
                    padding: "16px 32px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  BECOME A RESPONDER
                </motion.button>
              </Link>
            </motion.div>
          </section>

          <footer
            style={{
              position: "relative",
              zIndex: 1,
              padding: "28px 32px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "-0.01em",
              }}
            >
              LINK<span style={{ color: "var(--signal)" }}>.</span>LESS
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "var(--muted)",
                letterSpacing: "0.02em",
              }}
            >
              Communication without identities. Intent without names.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              Built for the world that needs it.
            </p>
          </footer>
        </div>
      )}
    </>
  );
}