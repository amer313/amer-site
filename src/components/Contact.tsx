"use client";

import { motion } from "framer-motion";
import Scramble from "@/components/Scramble";

const ease = [0.215, 0.61, 0.355, 1] as const;

const links = [
  { name: "EMAIL", href: "mailto:amerabbadi377@gmail.com", handle: "amerabbadi377@gmail.com" },
  { name: "GITHUB", href: "https://github.com/amer313", handle: "@amer313" },
  { name: "LINKEDIN", href: "https://www.linkedin.com/in/amer-abbadi/", handle: "/amer-abbadi" },
  { name: "QUINT", href: "https://quintai.dev", handle: "quintai.dev" },
];

export default function Contact() {
  return (
    <section id="contact" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-32 md:px-10 md:py-44">
        <p className="text-label mb-16 text-ember">
          <Scramble text="// CONTACT" onView />
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-ink md:text-8xl"
        >
          Let&apos;s build something{" "}
          <span className="font-serif-it text-ember">worth watching.</span>
        </motion.h2>

        <div className="mt-20 grid grid-cols-1 gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
          {links.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              data-cursor="pointer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group bg-[var(--bg)] px-6 py-8 transition-colors duration-300 hover:bg-[var(--srf)]"
            >
              <p className="font-mono text-[0.6rem] tracking-[0.18em] text-dim transition-colors duration-300 group-hover:text-ember">
                {link.name} ↗
              </p>
              <p className="mt-3 truncate text-sm text-muted transition-colors duration-300 group-hover:text-ink">
                {link.handle}
              </p>
            </motion.a>
          ))}
        </div>

        <footer className="mt-28 flex flex-col justify-between gap-3 border-t border-[var(--border)] pt-8 font-mono text-[0.65rem] tracking-[0.12em] text-dim sm:flex-row">
          <p>© {new Date().getFullYear()} AMER ABBADI</p>
          <p>
            BUILT WITH <span className="text-ember">OBSESSIVE</span> ATTENTION TO DETAIL
          </p>
        </footer>
      </div>
    </section>
  );
}
