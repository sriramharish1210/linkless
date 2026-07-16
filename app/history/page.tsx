"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import { getMessages, StoredMessage } from "@/lib/storage";

const CATEGORY_CONFIG: Record<string, { color: string; bg: string }> = {
  Medical: { color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
  Food: { color: "#22C55E", bg: "rgba(34,197,94,0.08)" },
  Shelter: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  Transport: { color: "#4F7FFF", bg: "rgba(79,127,255,0.08)" },
  Safety: { color: "#FF3A3A", bg: "rgba(255,58,58,0.08)" },
  Emotional: { color: "#A78BFA", bg: "rgba(167,139,250,0.08)" },
  Other: { color: "#7E8A9F", bg: "rgba(126,138,159,0.08)" },
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: "#F59E0B", label: "Pending" },
  routed: { color: "#4F7FFF", label: "Routed" },
  accepted: { color: "#22C55E", label: "Accepted" },
  resolved: { color: "#7E8A9F", label: "Resolved" },
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function HistoryCard({ msg, index }: { msg: StoredMessage; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cat = msg.analysis?.category || "Other";
  const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other;
  const status = STATUS_CONFIG[msg.status] || STATUS_CONFIG.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        background: "var(--ink)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ padding: "20px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 20,
                  border: `1px solid ${cfg.color}33`,
                  color: cfg.color,
                  background: cfg.bg,
                }}
              >
                {cat}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: status.color,
                }}
              >
                {status.label}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: "var(--muted)",
                  marginLeft: "auto",
                }}
              >
                {timeAgo(msg.timestamp)}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text)",
                lineHeight: 1.4,
              }}
            >
              {msg.need}
            </p>
          </div>
          <div
            style={{
              color: "var(--muted)",
              fontSize: 18,
              flexShrink: 0,
              marginTop: 2,
              transition: "transform 0.25s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ↓
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                borderTop: "1px solid var(--border)",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {msg.description && (
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Description
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "var(--dim)",
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.description}
                  </p>
                </div>
              )}

              {msg.analysis && (
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    AI Summary
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "var(--dim)",
                      lineHeight: 1.6,
                      marginBottom: 10,
                    }}
                  >
                    {msg.analysis.summary}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {msg.analysis.keywords.map((kw) => (
                      <span
                        key={kw}
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          padding: "3px 9px",
                          borderRadius: 20,
                          border: "1px solid rgba(79,127,255,0.18)",
                          color: "var(--signal)",
                          background: "rgba(79,127,255,0.05)",
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Signal ID", value: msg.id },
                  { label: "Sender", value: msg.anonName },
                  { label: "Priority", value: msg.priority },
                  msg.locationLabel
                    ? { label: "Location", value: msg.locationLabel }
                    : null,
                ]
                  .filter(Boolean)
                  .map((item) => (
                    <div key={item!.label}>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          letterSpacing: "0.08em",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          marginBottom: 3,
                        }}
                      >
                        {item!.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text)",
                        }}
                      >
                        {item!.value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HistoryPage() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);

  useEffect(() => {
    setMessages(getMessages());
  }, []);

  const stats = {
    total: messages.length,
    accepted: messages.filter((m) => m.status === "accepted").length,
    categories: [...new Set(messages.map((m) => m.analysis?.category).filter(Boolean))].length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--void)" }}>
      <Background />
      <Navbar />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 40 }}
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
              marginBottom: 10,
            }}
          >
            Signal History
          </span>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: 10,
            }}
          >
            Your signals
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "var(--dim)",
            }}
          >
            Stored locally. Never sent to a server. Never tied to your identity.
          </p>
        </motion.div>

        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 32,
            }}
          >
            {[
              { label: "Signals sent", value: stats.total },
              { label: "Accepted", value: stats.accepted },
              { label: "Categories", value: stats.categories },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--ink)",
                  padding: "20px 24px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--text)",
                    display: "block",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: "var(--muted)",
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: "center",
              padding: "80px 24px",
              border: "1px solid var(--border)",
              borderRadius: 16,
              background: "var(--ink)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--signal-dim)",
                border: "1px solid rgba(79,127,255,0.2)",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--signal)",
                  opacity: 0.5,
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: 10,
              }}
            >
              No signals yet
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "var(--dim)",
                marginBottom: 28,
              }}
            >
              Send your first signal and it will appear here.
            </p>
            <a
              href="/send"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                background: "var(--signal)",
                padding: "12px 28px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Send a Signal
            </a>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <HistoryCard key={msg.id} msg={msg} index={i} />
            ))}
          </div>
        )}

        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: 32, textAlign: "center" }}
          >
            <button
              onClick={() => {
                localStorage.removeItem("linkless_messages");
                setMessages([]);
              }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "var(--muted)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "8px 20px",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--danger)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              Clear all history
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
