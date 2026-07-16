"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Background from "@/components/Background";
import { analyzeIntent, AnalysisResult } from "@/lib/gemini";
import { saveMessage, generateId } from "@/lib/storage";

const STAGES = [
  "Reading your signal...",
  "Parsing intent...",
  "Detecting category...",
  "Assessing urgency...",
  "Finding best responders...",
  "Signal ready to route.",
];

export default function AnalyzePage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("linkless_pending");
    if (!raw) { router.push("/send"); return; }
    const pending = JSON.parse(raw);

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < STAGES.length - 1) setStage(stageIdx);
    }, 800);

    analyzeIntent(pending.need, pending.description, pending.priority)
      .then((analysis) => {
        clearInterval(interval);
        setStage(STAGES.length - 1);
        setResult(analysis);

        const id = generateId();
        saveMessage({
          id,
          need: pending.need,
          description: pending.description,
          priority: pending.priority,
          anonName: pending.anonName,
          location: pending.location,
          locationLabel: pending.locationLabel,
          analysis,
          status: "pending",
          timestamp: pending.timestamp,
        });
        localStorage.setItem("linkless_current_id", id);
        localStorage.removeItem("linkless_pending");

        setTimeout(() => router.push("/route"), 2000);
      })
      .catch(() => {
        clearInterval(interval);
        setError(true);
      });

    return () => clearInterval(interval);
  }, [router]);

  const CATEGORY_COLORS: Record<string, string> = {
    Medical: "#EF4444",
    Food: "#22C55E",
    Shelter: "#F59E0B",
    Transport: "#4F7FFF",
    Safety: "#FF3A3A",
    Emotional: "#A78BFA",
    Other: "#7E8A9F",
  };

  const catColor = result ? (CATEGORY_COLORS[result.category] || "#4F7FFF") : "#4F7FFF";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Background />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto 32px",
              position: "relative",
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `1px solid rgba(79,127,255,${0.6 - i * 0.15})`,
                }}
                animate={{ scale: [1, 1.4 + i * 0.3], opacity: [0.8, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  delay: i * 0.45,
                  ease: "easeOut",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(79,127,255,0.12)",
                border: "1px solid rgba(79,127,255,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--signal)",
                }}
              />
            </div>
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            {error ? "Signal failed." : "Analyzing intent"}
          </h1>

          {!error && (
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                color: "var(--dim)",
                marginBottom: 48,
                lineHeight: 1.6,
              }}
            >
              {STAGES[stage]}
            </p>
          )}

          <div
            style={{
              background: "var(--ink)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            {STAGES.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0.25 }}
                animate={{ opacity: stage >= i ? 1 : 0.25 }}
                style={{
                  padding: "14px 20px",
                  borderBottom:
                    i < STAGES.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      stage > i
                        ? "var(--success)"
                        : stage === i
                        ? "var(--signal)"
                        : "var(--muted)",
                    flexShrink: 0,
                    transition: "background 0.3s",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: stage >= i ? "var(--text)" : "var(--muted)",
                    transition: "color 0.3s",
                  }}
                >
                  {s}
                </span>
                {stage === i && !result && (
                  <motion.div
                    style={{
                      marginLeft: "auto",
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "2px solid rgba(79,127,255,0.2)",
                      borderTopColor: "var(--signal)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "var(--ink)",
                border: `1px solid ${catColor}33`,
                borderRadius: 12,
                padding: "20px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {[
                  { label: result.category, color: catColor },
                  {
                    label: result.priority,
                    color:
                      result.priority === "Critical" || result.priority === "High"
                        ? "#EF4444"
                        : result.priority === "Medium"
                        ? "#F59E0B"
                        : "#22C55E",
                  },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      padding: "4px 12px",
                      borderRadius: 20,
                      border: `1px solid ${chip.color}44`,
                      color: chip.color,
                      background: `${chip.color}10`,
                    }}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "var(--dim)",
                  lineHeight: 1.65,
                  marginBottom: 12,
                }}
              >
                {result.summary}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                Routing to: {result.bestReceiver}
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginTop: 24 }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "var(--danger)",
                  marginBottom: 20,
                }}
              >
                Could not reach the AI. Check your API key or try again.
              </p>
              <button
                onClick={() => router.push("/send")}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  background: "var(--signal)",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
