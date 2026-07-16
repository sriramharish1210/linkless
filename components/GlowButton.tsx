"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GlowButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function GlowButton({
  href,
  onClick,
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
}: GlowButtonProps) {
  const sizes = {
    sm: { padding: "10px 20px", fontSize: 13 },
    md: { padding: "13px 28px", fontSize: 14 },
    lg: { padding: "16px 40px", fontSize: 16 },
  };

  const variants = {
    primary: {
      background: "var(--signal)",
      color: "#ffffff",
      border: "1px solid var(--signal)",
      hover: {
        background: "#3d6de8",
        boxShadow: "0 8px 32px rgba(79,127,255,0.38)",
      },
    },
    secondary: {
      background: "transparent",
      color: "var(--dim)",
      border: "1px solid rgba(255,255,255,0.1)",
      hover: {
        background: "rgba(255,255,255,0.04)",
        color: "var(--text)",
        border: "1px solid rgba(255,255,255,0.22)",
      },
    },
    ghost: {
      background: "transparent",
      color: "var(--signal)",
      border: "1px solid rgba(79,127,255,0.25)",
      hover: {
        background: "rgba(79,127,255,0.08)",
        border: "1px solid rgba(79,127,255,0.5)",
      },
    },
  };

  const v = variants[variant];
  const s = sizes[size];

  const buttonStyles: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.01em",
    padding: s.padding,
    fontSize: s.fontSize,
    borderRadius: 8,
    cursor: "pointer",
    border: v.border,
    background: v.background,
    color: v.color,
    width: fullWidth ? "100%" : "auto",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s ease",
    position: "relative",
    overflow: "hidden",
  };

  const inner = (
    <motion.button
      style={buttonStyles}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }

  return inner;
}
