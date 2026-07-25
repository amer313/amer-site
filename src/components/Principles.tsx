"use client";

import { motion } from "framer-motion";
import Scramble from "@/components/Scramble";

const ease = [0.215, 0.61, 0.355, 1] as const;

const principles = [
  {
    n: "01",
    line: (
      <>
        You don&apos;t understand a system until you&apos;ve watched it{" "}
        <span className="text-ember">fail.</span>
      </>
    ),
  },
  {
    n: "02",
    line: (
      <>
        Abstractions are <span className="text-ember">loans.</span> Something
        breaks and you pay them back with interest.
      </>
    ),
  },
  {
    n: "03",
    line: (
      <>
        Most slow software is just the first thing that worked,{" "}
        <span className="text-ember">shipped.</span>
      </>
    ),
  },
  {
    n: "04",
    line: (
      <>
        Complexity is a decision someone made and{" "}
        <span className="text-ember">didn&apos;t write down.</span>
      </>
    ),
  },
];

export default function Principles() {
  return (
    <section id="principles" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-32 md:px-10 md:py-40">
        <p className="text-label mb-16 text-ember">
          <Scramble text="// PRINCIPLES" onView />
        </p>

        <div>
          {principles.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease }}
              className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-t border-[var(--border)] py-8 last:border-b md:py-10"
            >
              <span className="col-span-12 font-mono text-sm tracking-[0.15em] text-dim transition-colors duration-300 group-hover:text-ember md:col-span-1 md:text-base">
                {p.n}
              </span>
              <p className="col-span-12 text-2xl font-medium leading-[1.12] tracking-[-0.02em] text-ink md:col-span-11 md:text-4xl">
                {p.line}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
