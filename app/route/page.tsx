"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Background from "@/components/Background";
import { getMessages } from "@/lib/storage";

const ROUTING_STAGES = [
  { label: "Signal encoded", duration: 600 },
  { label: "Scanning nearby nodes", duration: 900 },
  { label: "Matching responder profiles", duration: 1100 },
  { label: "Establishing anonymous relay", duration: 900 },
  { label: "Responders notified", duration: 700 },
];

interface Node {
  x: number;
  y: number;
  active: boolean;
  pulse: boolean;
  isCenter: boolean;
  responder: boolean;
}

function RoutingCanvas({ stage }: { stage: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const cx = W / 2;
    const cy = H / 2;

    const nodes: Node[] = [{ x: cx, y: cy, active: true, pulse: true, isCenter: true, responder: false }];

    const rings = [
      { count: 6, r: 80 },
      { count: 10, r: 160 },
      { count: 14, r: 230 },
    ];

    rings.forEach(({ count, r }) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        nodes.push({
          x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 20,
          y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 20,
          active: false,
          pulse: false,
          isCenter: false,
          responder: false,
        });
      }
    });

    nodesRef.current = nodes;

    function draw(t: number) {
      ctx.clearRect(0, 0, W, H);
      timeRef.current = t * 0.001;
      const time = timeRef.current;

      const ns = nodesRef.current;

      for (let i = 1; i < ns.length; i++) {
        const n = ns[i];
        if (!n.active) continue;
        const alpha = 0.06 + (n.responder ? 0.08 : 0);
        ctx.beginPath();
        ctx.moveTo(ns[0].x, ns[0].y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = `rgba(79,127,255,${alpha})`;
        ctx.lineWidth = n.responder ? 1 : 0.5;
        ctx.stroke();
      }

      ns.forEach((n) => {
        if (!n.active) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.06)";
          ctx.fill();
          return;
        }

        if (n.pulse || n.isCenter) {
          const pulseScale = 1 + 0.4 * Math.sin(time * 3 + n.x);
          ctx.beginPath();
          ctx.arc(n.x, n.y, (n.isCenter ? 18 : 10) * pulseScale, 0, Math.PI * 2);
          ctx.fillStyle = n.isCenter
            ? "rgba(79,127,255,0.06)"
            : "rgba(79,127,255,0.04)";
          ctx.fill();
        }

        const size = n.isCenter ? 7 : n.responder ? 5 : 3.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fillStyle = n.isCenter
          ? "#4F7FFF"
          : n.responder
          ? "#22C55E"
          : "rgba(79,127,255,0.7)";
        ctx.fill();
      });

      const signalProgress = (time * 0.6) % 1;
      ns.forEach((n, i) => {
        if (!n.active || n.isCenter) return;
        const sp = (signalProgress + i * 0.07) % 1;
        const sx = ns[0].x + (n.x - ns[0].x) * sp;
        const sy = ns[0].y + (n.y - ns[0].y) * sp;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(79,127,255,0.55)";
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const ns = nodesRef.current;
    if (!ns.length) return;

    const inactive = ns.filter((n) => !n.active && !n.isCenter);
    const toActivate = Math.floor((stage / ROUTING_STAGES.length) * inactive.length * 1.2);

    inactive.slice(0, toActivate).forEach((n, i) => {
      setTimeout(() => {
        n.active = true;
        if (stage >= 3) n.responder = true;
        n.pulse = stage >= 2;
      }, i * 40);
    });
  }, [stage]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

export default function RoutePage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);
  const [responderCount, setResponderCount] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    let stageIdx = 0;

    function advance() {
      if (stageIdx >= ROUTING_STAGES.length) {
        setDone(true);
        setResponderCount(3 + Math.floor(Math.random() * 5));
        return;
      }
      setStage(stageIdx);
      const delay = ROUTING_STAGES[stageIdx].duration;
      stageIdx++;
      elapsed += delay;
      setTimeout(advance, delay);
    }

    advance();
  }, []);

  const messages = getMessages();
  const current = messages[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        display: "flex",
        flexDirection: "column",
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
          maxWidth: 600,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.16em",
              color: "var(--signal)",
              textTransform: "uppercase",
            }}
          >
            Routing Signal
          </span>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginTop: 10,
            }}
          >
            {done ? "Signal delivered." : ROUTING_STAGES[stage]?.label}
          </h1>
        </motion.div>

        <div
          style={{
            width: "100%",
            height: 320,
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            background: "var(--ink)",
            marginBottom: 32,
            position: "relative",
          }}
        >
          <RoutingCanvas stage={stage} />
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(4,5,8,0.7)",
                backdropFilter: "blur(4px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M4 11L9 16L18 6"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {responderCount} responders notified
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "var(--dim)",
                }}
              >
                Your signal is live. No identity was shared.
              </p>
            </motion.div>
          )}
        </div>

        <div
          style={{
            background: "var(--ink)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          {ROUTING_STAGES.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "12px 20px",
                borderBottom:
                  i < ROUTING_STAGES.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: stage >= i || done ? 1 : 0.3,
                transition: "opacity 0.4s",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background:
                    done || stage > i
                      ? "#22C55E"
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
                  color: done || stage >= i ? "var(--text)" : "var(--muted)",
                  transition: "color 0.3s",
                }}
              >
                {s.label}
              </span>
              {stage === i && !done && (
                <motion.div
                  style={{
                    marginLeft: "auto",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid rgba(79,127,255,0.2)",
                    borderTopColor: "var(--signal)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
          ))}
        </div>

        {current?.analysis && (
          <div
            style={{
              background: "var(--ink)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {current.analysis.keywords.map((kw) => (
              <span
                key={kw}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 20,
                  border: "1px solid rgba(79,127,255,0.2)",
                  color: "var(--signal)",
                  background: "rgba(79,127,255,0.05)",
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <motion.button
              onClick={() => router.push("/responders")}
              whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(79,127,255,0.38)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                background: "var(--signal)",
                border: "none",
                padding: "14px",
                borderRadius: 8,
                cursor: "pointer",
                minWidth: 160,
              }}
            >
              View Responders
            </motion.button>
            <motion.button
              onClick={() => router.push("/history")}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "var(--dim)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "14px",
                borderRadius: 8,
                cursor: "pointer",
                minWidth: 160,
              }}
            >
              View History
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
