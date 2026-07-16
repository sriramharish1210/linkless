"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";

type Priority = "low" | "medium" | "high" | "critical";

const PRIORITIES: { value: Priority; label: string; color: string; bg: string }[] = [
  { value: "low", label: "Low", color: "#22C55E", bg: "rgba(34,197,94,0.08)" },
  { value: "medium", label: "Medium", color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
  { value: "high", label: "High", color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
  { value: "critical", label: "Critical", color: "#FF3A3A", bg: "rgba(255,58,58,0.12)" },
];

export default function SendPage() {
  const router = useRouter();
  const [need, setNeed] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [anonName, setAnonName] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  function getLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel(
          `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        );
        setLocating(false);
      },
      () => {
        setLocationLabel("Location unavailable");
        setLocating(false);
      }
    );
  }

  function handleSubmit() {
    if (!need.trim()) return;
    const payload = {
      need,
      description,
      priority,
      anonName: anonName || "Anonymous",
      location: coords,
      locationLabel,
      timestamp: Date.now(),
    };
    localStorage.setItem("linkless_pending", JSON.stringify(payload));
    router.push("/analyze");
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focused === field ? "rgba(79,127,255,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused === field ? "rgba(79,127,255,0.35)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 8,
    padding: "14px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: "var(--text)",
    outline: "none",
    transition: "all 0.2s",
    resize: "none" as const,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    letterSpacing: "0.08em",
    color: "var(--muted)",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 10,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--void)" }}>
      <Background />
      <Navbar />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 560,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
              marginBottom: 12,
            }}
          >
            Send a Signal
          </span>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            What do you need?
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "var(--dim)",
              lineHeight: 1.7,
              marginBottom: 48,
            }}
          >
            No identity required. Your signal will be routed anonymously.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "var(--ink)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div>
            <label style={labelStyle}>Your need</label>
            <input
              style={inputStyle("need")}
              placeholder="e.g. Need a doctor for my father"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              onFocus={() => setFocused("need")}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div>
            <label style={labelStyle}>Description (optional)</label>
            <textarea
              style={{ ...inputStyle("description"), minHeight: 96 }}
              placeholder="Any additional context that might help responders..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused("description")}
              onBlur={() => setFocused(null)}
              rows={3}
            />
          </div>

          <div>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "8px 18px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: `1px solid ${priority === p.value ? p.color : "rgba(255,255,255,0.08)"}`,
                    background: priority === p.value ? p.bg : "transparent",
                    color: priority === p.value ? p.color : "var(--dim)",
                    transition: "all 0.2s",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={getLocation}
                disabled={locating}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "10px 18px",
                  borderRadius: 6,
                  cursor: locating ? "default" : "pointer",
                  border: "1px solid rgba(79,127,255,0.28)",
                  background: "rgba(79,127,255,0.06)",
                  color: "var(--signal)",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  opacity: locating ? 0.6 : 1,
                }}
              >
                {locating ? "Detecting..." : "Detect Location"}
              </button>
              {locationLabel && (
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: "var(--success)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {locationLabel}
                </span>
              )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Anonymous name (optional)</label>
            <input
              style={inputStyle("anon")}
              placeholder="e.g. Seeker, Wanderer, or leave blank"
              value={anonName}
              onChange={(e) => setAnonName(e.target.value)}
              onFocus={() => setFocused("anon")}
              onBlur={() => setFocused(null)}
            />
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 8,
              }}
            >
              Not your real name. Just a signal identifier.
            </p>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={!need.trim()}
            whileHover={need.trim() ? { y: -2, boxShadow: "0 12px 40px rgba(79,127,255,0.38)" } : {}}
            whileTap={need.trim() ? { scale: 0.97 } : {}}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              background: need.trim() ? "var(--signal)" : "rgba(79,127,255,0.3)",
              border: "none",
              padding: "16px",
              borderRadius: 8,
              cursor: need.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              marginTop: 4,
            }}
          >
            Send Signal to AI
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
