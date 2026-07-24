"use client";

import { motion } from "framer-motion";
import Scramble from "@/components/Scramble";

const ease = [0.215, 0.61, 0.355, 1] as const;

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pt-28 md:px-10"
    >
      {/* faint vertical hairlines, editorial column ghosts */}
      <div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-6xl justify-between px-10 md:flex">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-full w-px bg-[var(--border)] opacity-50" />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p {...reveal(2.3)} className="text-label text-ember">
          {"// ENGINEER · FOUNDER"}
        </motion.p>

        <h1 className="mt-8 text-[13vw] font-medium leading-[0.92] tracking-[-0.045em] text-ink md:text-[7.5rem] lg:text-[8.5rem]">
          <motion.span {...reveal(2.45)} className="block">
            Building trust
          </motion.span>
          <motion.span {...reveal(2.6)} className="block">
            for machines
          </motion.span>
          <motion.span {...reveal(2.75)} className="block">
            that <span className="text-ember">think.</span>
          </motion.span>
        </h1>

        <motion.p
          {...reveal(3.0)}
          className="mt-10 max-w-md text-base leading-relaxed text-muted md:text-lg"
        >
          Engineer and founder. Building security for autonomous systems —
          currently in stealth.
        </motion.p>
      </div>

      {/* telemetry strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.4 }}
        className="relative mt-20 border-t border-[var(--border)]"
      >
        <div className="flex items-center overflow-x-auto font-mono text-[0.6rem] tracking-[0.15em] text-dim md:text-[0.65rem]">
          <span className="whitespace-nowrap border-r border-[var(--border)] px-6 py-3.5 md:px-10">
            STATUS — <span className="text-green-500">●</span>{" "}
            <Scramble text="BUILDING" onView onHover className="text-muted" />
          </span>
          <span className="whitespace-nowrap border-r border-[var(--border)] px-6 py-3.5 md:px-10">
            MODE — STEALTH
          </span>
          <span className="whitespace-nowrap border-r border-[var(--border)] px-6 py-3.5 md:px-10">
            FOCUS — AGENT SECURITY
          </span>
          <span className="ml-auto hidden whitespace-nowrap px-6 py-3.5 text-ember md:block md:px-10">
            SCROLL ↓
          </span>
        </div>
      </motion.div>
    </section>
  );
}
