"use client";

import { motion } from "framer-motion";
import Scramble from "@/components/Scramble";

const ease = [0.215, 0.61, 0.355, 1] as const;

const lines = [
  <>
    I build systems that <span className="font-serif-it text-ember">watch</span> other
    systems.
  </>,
  <>
    By day I ship at Amazon. The rest of the time I&apos;m building Quint —
    because the world is about to hand autonomous agents the keys to
    everything, and someone needs to check their behavior.
  </>,
  <>
    Off the clock: soccer, MMA, the gym.{" "}
    <span className="font-serif-it text-ink">Always moving.</span>
  </>,
];

const facts = [
  { k: "BASE", v: "Northern Virginia" },
  { k: "EDU", v: "George Mason '25" },
  { k: "STACK", v: "TypeScript · Go · Python · AWS" },
  { k: "TRAINING", v: "MMA, reluctantly humble" },
];

export default function About() {
  return (
    <section id="about" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-32 md:px-10 md:py-44">
        <p className="text-label mb-16 text-ember">
          <Scramble text="// ABOUT" onView />
        </p>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-8">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className="mb-8 text-2xl leading-snug tracking-tight text-ink md:text-4xl"
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="col-span-12 md:col-span-4"
          >
            <div className="border border-[var(--border)]">
              {facts.map((fact) => (
                <div
                  key={fact.k}
                  className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] px-5 py-4 last:border-b-0"
                >
                  <span className="font-mono text-[0.6rem] tracking-[0.18em] text-dim">
                    {fact.k}
                  </span>
                  <span className="text-right text-sm text-muted">{fact.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
