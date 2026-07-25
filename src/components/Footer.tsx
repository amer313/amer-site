"use client";

import Scramble from "@/components/Scramble";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-10 font-mono text-sm tracking-[0.12em] text-dim md:px-10">
        <span>AMER ABBADI</span>
        <span className="text-[var(--border-hover)]">/</span>
        <Scramble text="AMBUSH" onView onHover className="text-ember" />
      </div>
    </footer>
  );
}
