"use client";

import { motion } from "framer-motion";

export default function TopBar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 px-6 py-4 backdrop-blur-md md:px-10"
    >
      <span className="text-label text-ink">AMER ABBADI</span>
      <a
        href="mailto:amerabbadi377@gmail.com"
        className="text-label link-sweep text-ember"
      >
        contact ↗
      </a>
    </motion.header>
  );
}
