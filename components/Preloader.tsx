"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<"rise" | "hold" | "insert" | "zoom" | "done">("rise");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 750);
    const t2 = setTimeout(() => setPhase("insert"), 1300);
    const t3 = setTimeout(() => setPhase("zoom"), 2100);
    const t4 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const isInserted = phase === "insert" || phase === "zoom";
  const isZooming = phase === "zoom";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#F5F1EA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 3vw, 42px)",
                color: "#1a1a1a",
                lineHeight: 1,
                marginBottom: "-2px",
                alignSelf: "flex-start",
                paddingLeft: "6px",
                letterSpacing: "-0.01em",
              }}
            >
              the
            </motion.div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                paddingBottom: "2px",
              }}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0, x: isInserted ? -8 : 0 }}
                transition={{
                  y: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                  x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(64px, 11vw, 128px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "#1a1a1a",
                }}
              >
                LINK
              </motion.div>

              <motion.div
                initial={{ x: "-120%", opacity: 0 }}
                animate={
                  isInserted
                    ? { x: 0, opacity: 1 }
                    : { x: "-120%", opacity: 0 }
                }
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "clamp(64px, 11vw, 128px)",
                  width: isInserted ? "auto" : 0,
                  marginLeft: isInserted ? 8 : 0,
                  marginRight: isInserted ? 8 : 0,
                }}
              >
                <motion.div
                  animate={isZooming ? { scale: 40 } : { scale: 1 }}
                  transition={
                    isZooming
                      ? { duration: 0.85, ease: [0.4, 0, 0.15, 1] }
                      : {}
                  }
                  style={{
                    width: "clamp(80px, 12vw, 140px)",
                    height: "clamp(64px, 11vw, 128px)",
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                    transformOrigin: "center center",
                    position: "relative",
                    background: "transparent",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "#040508",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(ellipse at center, rgba(79,127,255,0.18) 0%, rgba(4,5,8,0.95) 70%)",
                    }}
                  />
                  {[
                    { top: "15%", left: "18%", size: 2 },
                    { top: "38%", left: "70%", size: 1.5 },
                    { top: "65%", left: "30%", size: 1.5 },
                    { top: "20%", left: "82%", size: 1 },
                    { top: "75%", left: "78%", size: 2 },
                    { top: "50%", left: "8%", size: 1 },
                    { top: "85%", left: "50%", size: 1.5 },
                    { top: "10%", left: "50%", size: 1 },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: s.top,
                        left: s.left,
                        width: s.size,
                        height: s.size,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.7)",
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0, x: isInserted ? 8 : 0 }}
                transition={{
                  y: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                  x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(64px, 11vw, 128px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: "#1a1a1a",
                }}
              >
                LESS
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}