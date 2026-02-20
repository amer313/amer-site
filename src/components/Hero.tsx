"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
});

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] as const },
});

export default function Hero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <HeroScene />

      {/* ── Top-left: Name ── */}
      <div className="absolute left-6 top-8 z-10 md:left-12">
        <motion.p {...fadeUp(0.2)} className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          // Portfolio 2026
        </motion.p>
        <motion.p {...fadeUp(0.35)} className="mt-1 font-mono text-xs text-muted">
          Amer Abbadi
        </motion.p>
      </div>

      {/* ── Top-right: Status ── */}
      <div className="absolute right-6 top-8 z-10 text-right md:right-12">
        <motion.p {...fadeUp(0.3)} className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          ////// Status
        </motion.p>
        <motion.p {...fadeUp(0.45)} className="mt-1 font-mono text-xs text-muted">
          Available for work
        </motion.p>
        <motion.div {...fadeUp(0.55)} className="mt-2 flex items-center justify-end gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          <span className="font-mono text-[10px] text-green-500">ONLINE</span>
        </motion.div>
      </div>

      {/* ── Center: Main Title ── */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.85] tracking-tighter text-accent">
          <div>
            <SplitText text="AMER" delay={0.3} />
          </div>
          <div>
            <SplitText text="ABBADI" delay={0.6} />
          </div>
        </h1>

        <motion.p
          {...fadeUp(1.2)}
          className="mt-8 max-w-md font-mono text-sm leading-relaxed text-muted"
        >
          Developer. Builder. Creator.
        </motion.p>
      </div>

      {/* ── Bottom-left: Scroll indicator ── */}
      <div className="absolute bottom-8 left-6 z-10 md:left-12">
        <motion.div {...fadeUp(1.6)} className="flex flex-col gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Scroll down to
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            discover.
          </p>
          <motion.div
            className="mt-2 h-8 w-px bg-accent/20"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originY: 0 }}
          />
        </motion.div>
      </div>

      {/* ── Bottom-right: Coordinates / Location ── */}
      <div className="absolute bottom-8 right-6 z-10 text-right md:right-12">
        <motion.p {...fadeUp(1.4)} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Full-Stack Engineer
        </motion.p>
        <motion.p {...fadeUp(1.5)} className="mt-1 font-mono text-[10px] text-muted">
          Remote — Worldwide
        </motion.p>
      </div>
    </section>
  );
}
