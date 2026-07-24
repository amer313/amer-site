"use client";

import { motion } from "framer-motion";

const ease = [0.215, 0.61, 0.355, 1] as const;

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

const socials = [
  { name: "GITHUB", href: "https://github.com/amer313" },
  { name: "LINKEDIN", href: "https://www.linkedin.com/in/amer-abbadi/" },
  { name: "X", href: "https://x.com/amer_abbadi" },
  { name: "EMAIL", href: "mailto:amerabbadi377@gmail.com" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden px-6 pt-28 md:px-10"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center pb-16">
        <motion.p {...reveal(0)} className="text-label text-ember">
          {"// ENGINEER · FOUNDER"}
        </motion.p>

        <h1 className="mt-8 text-[13vw] font-medium leading-[0.92] tracking-[-0.045em] text-ink md:text-[7.5rem] lg:text-[8.5rem]">
          <motion.span {...reveal(0.05)} className="block">
            Building trust
          </motion.span>
          <motion.span {...reveal(0.15)} className="block">
            for machines
          </motion.span>
          <motion.span {...reveal(0.25)} className="block">
            that <span className="text-ember">think.</span>
          </motion.span>
        </h1>

        <motion.p
          {...reveal(0.35)}
          className="mt-10 max-w-lg text-lg leading-relaxed text-muted md:text-xl"
        >
          Engineer and founder. Building security for autonomous systems,
          currently in stealth.{" "}
          <span className="text-ink">Excel in every human domain.</span>
        </motion.p>

        <motion.div {...reveal(0.45)} className="mt-12 flex flex-wrap gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group border border-[var(--border)] px-6 py-3 font-mono text-sm tracking-[0.15em] text-muted transition-colors duration-300 hover:border-[var(--ember)] hover:text-ember"
            >
              {s.name} <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
