"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import { getMessages, updateMessageStatus, StoredMessage } from "@/lib/storage";

const MOCK_REQUESTS: StoredMessage[] = [
  {
    id: "DEMO01",
    need: "Need a doctor for my elderly father who fell.",
    description: "He is conscious but in pain, cannot walk.",
    priority: "critical",
    anonName: "Seeker",
    location: null,
    locationLabel: "2.4 km away",
    analysis: {
      category: "Medical",
      priority: "Critical",
      summary: "Elderly person injured from fall, needs immediate medical attention.",
      bestReceiver: "Medical Volunteer",
      keywords: ["doctor", "elderly", "fall", "injury"],
      urgencyScore: 92,
    },
    status: "pending",
    timestamp: Date.now() - 120000,
  },
  {
    id: "DEMO02",
    need: "Family of 4 needs food, haven't eaten since yesterday.",
    description: "",
    priority: "high",
    anonName: "Wanderer",
    location: null,
    locationLabel: "0.8 km away",
    analysis: {
      category: "Food",
      priority: "High",
      summary: "Family requiring urgent food assistance.",
      bestReceiver: "Food Aid Worker",
      keywords: ["food", "family", "hungry", "urgent"],
      urgencyScore: 78,
    },
    status: "pending",
    timestamp: Date.now() - 300000,
  },
  {
    id: "DEMO03",
    need: "Need shelter for tonight, street is not safe.",
    description: "Two people, one child.",
    priority: "high",
    anonName: "Ghost",
    location: null,
    locationLabel: "1.2 km away",
    analysis: {
      category: "Shelter",
      priority: "High",
      summary: "Small group needs safe overnight shelter.",
      bestReceiver: "Shelter Coordinator",
      keywords: ["shelter", "safety", "child", "overnight"],
      urgencyScore: 81,
    },
    status: "pending",
    timestamp: Date.now() - 600000,
  },
  {
    id: "DEMO04",
    need: "Transport needed to reach general hospital.",
    description: "Have appointment in 2 hours, no vehicle.",
    priority: "medium",
    anonName: "Signal",
    location: null,
    locationLabel: "3.1 km away",
    analysis: {
      category: "Transport",
      priority: "Medium",
      summary: "Person needs transport to hospital for scheduled appointment.",
      bestReceiver: "Transport Volunteer",
      keywords: ["transport", "hospital", "appointment", "vehicle"],
      urgencyScore: 60,
    },
    status: "pending",
    timestamp: Date.now() - 900000,
  },
];

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Medical: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", icon: "M" },
  Food: { color: "#22C55E", bg: "rgba(34,197,94,0.08)", icon: "F" },
  Shelter: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", icon: "S" },
  Transport: { color: "#4F7FFF", bg: "rgba(79,127,255,0.08)", icon: "T" },
  Safety: { color: "#FF3A3A", bg: "rgba(255,58,58,0.08)", icon: "!" },
  Emotional: { color: "#A78BFA", bg: "rgba(167,139,250,0.08)", icon: "E" },
  Other: { color: "#7E8A9F", bg: "rgba(126,138,159,0.08)", icon: "?" },
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function RequestCard({
  msg,
  onAccept,
  accepted,
}: {
  msg: StoredMessage;
  onAccept: (id: string) => void;
  accepted: boolean;
}) {
  const cat = msg.analysis?.category || "Other";
  const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other;
  const urgency = msg.analysis?.urgencyScore || 50;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "var(--ink)",
        border: `1px solid ${accepted ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
        borderRadius: 14,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${urgency}%`,
          height: 2,
          background: cfg.color,
          opacity: 0.7,
          borderRadius: "2px 0 0 0",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: cfg.bg,
            border: `1px solid ${cfg.color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: cfg.color,
          }}
        >
          {cfg.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
              lineHeight: 1.4,
              marginBottom: 6,
            }}
          >
            {msg.need}
          </p>
          {msg.analysis?.summary && (
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "var(--dim)",
                lineHeight: 1.55,
              }}
            >
              {msg.analysis.summary}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            padding: "4px 10px",
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
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          {msg.locationLabel}
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "var(--muted)",
            marginLeft: "auto",
          }}
        >
          {timeAgo(msg.timestamp)}
        </span>
      </div>

      {!accepted ? (
        <motion.button
          onClick={() => onAccept(msg.id)}
          whileHover={{ y: -1, boxShadow: "0 8px 24px rgba(79,127,255,0.3)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "var(--signal)",
            border: "none",
            padding: "12px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Accept Request
        </motion.button>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px",
            borderRadius: 8,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8L6.5 11.5L13 5"
              stroke="#22C55E"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#22C55E",
            }}
          >
            Accepted
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function RespondersPage() {
  const [requests, setRequests] = useState<StoredMessage[]>([]);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    const stored = getMessages();
    const combined = [
      ...stored.filter((m) => m.status === "pending"),
      ...MOCK_REQUESTS,
    ];
    setRequests(combined);
  }, []);

  function handleAccept(id: string) {
    setAccepted((prev) => new Set([...prev, id]));
    updateMessageStatus(id, "accepted");
  }

  const categories = ["All", "Medical", "Food", "Shelter", "Transport", "Safety"];
  const filtered =
    filter === "All"
      ? requests
      : requests.filter((r) => r.analysis?.category === filter);

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
            Responder Dashboard
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
            Active Signals
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "var(--dim)",
            }}
          >
            {requests.length} requests waiting. Accept what you can help with.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {categories.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "7px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                  border: `1px solid ${isActive ? (cfg?.color || "var(--signal)") : "rgba(255,255,255,0.08)"}`,
                  background: isActive ? (cfg?.bg || "rgba(79,127,255,0.08)") : "transparent",
                  color: isActive ? (cfg?.color || "var(--signal)") : "var(--dim)",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <RequestCard
                  msg={msg}
                  onAccept={handleAccept}
                  accepted={accepted.has(msg.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                color: "var(--muted)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
              }}
            >
              No active signals in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
