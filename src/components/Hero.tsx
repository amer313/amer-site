"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SplitText from "@/components/SplitText";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <HeroScene />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-[clamp(3rem,10vw,9rem)] font-bold leading-none tracking-tighter text-accent">
          <div>
            <SplitText text="AMER" delay={0.3} />
          </div>
          <div>
            <SplitText text="ABBADI" delay={0.6} />
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
          className="mt-6 text-xl text-muted md:text-2xl"
        >
          Developer. Builder. Creator.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="mt-12 flex flex-col items-center gap-2 text-sm text-muted"
        >
          <span>Scroll to explore</span>
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}
