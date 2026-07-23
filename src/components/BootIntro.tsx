"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "$ init amer.sys",
  "> loading identity ............ ok",
  "> mounting /work /about ....... ok",
  "> trust protocol .............. active",
];

export default function BootIntro() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    // only theatrics on first visit per tab
    if (sessionStorage.getItem("booted")) {
      setSkipped(true);
      setDone(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 220 + i * 320));
    });
    timers.push(
      setTimeout(() => {
        sessionStorage.setItem("booted", "1");
        setDone(true);
      }, 220 + LINES.length * 320 + 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  if (skipped) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]"
        >
          <div className="font-mono text-xs leading-loose text-muted md:text-sm">
            {LINES.slice(0, visibleLines).map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {i === LINES.length - 1 ? (
                  <span className="text-ember">{line}</span>
                ) : (
                  line
                )}
              </motion.p>
            ))}
            <span className="inline-block h-4 w-2 animate-pulse bg-ember align-middle" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
