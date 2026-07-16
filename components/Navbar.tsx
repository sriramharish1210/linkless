"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "16px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        background: scrolled ? "rgba(4,5,8,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 7 }}>
        <Image
          src="/logo.png"
          alt="Linkless logo"
          width={36}
          height={36}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "var(--text)",
          }}
        >
          LINKLESS
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div className="nav-links-desktop" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[
            { label: "HOW IT WORKS", href: "/#how" },
            { label: "RESPOND", href: "/responders" },
            { label: "HISTORY", href: "/history" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "var(--muted)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--muted)")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}