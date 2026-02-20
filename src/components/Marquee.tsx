"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  text: string;
  className?: string;
}

export default function Marquee({ text, className = "" }: MarqueeProps) {
  const repeatedText = Array(6)
    .fill(text)
    .join(" — ");

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-block"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-accent/10">
          {repeatedText}
        </span>
        <span className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-accent/10">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
}
