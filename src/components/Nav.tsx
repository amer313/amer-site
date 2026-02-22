"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--color-surface)]/80 backdrop-blur-md px-2 py-1.5"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor="pointer"
              className="rounded-full px-4 py-1.5 text-sm text-muted hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
