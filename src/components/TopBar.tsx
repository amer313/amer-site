"use client";

import { motion } from "framer-motion";

const links = [
  { label: "work", href: "#work" },
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact", ember: true },
];

export default function TopBar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.2 }}
      className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 px-6 py-4 backdrop-blur-md md:px-10"
    >
      <a href="#top" className="text-label text-ink" data-cursor="pointer">
        AMER ABBADI
      </a>
      <nav className="flex items-center gap-6 md:gap-8">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-cursor="pointer"
            className={`text-label link-sweep transition-colors duration-300 ${
              link.ember ? "text-ember" : "text-muted hover:text-ink"
            }`}
          >
            {link.label}
            {link.ember && " ↗"}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
