"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Scramble from "@/components/Scramble";

const ease = [0.215, 0.61, 0.355, 1] as const;

const entries = [
  {
    index: "01",
    title: "Quint",
    role: "FOUNDER",
    year: "2026 —",
    description:
      "Behavioral security for AI agents. Watches what agents actually do — not what they claim — and stops them when behavior drifts. The immune system for the agentic era.",
    tags: ["AGENT SECURITY", "BEHAVIORAL INTEL", "RUNTIME"],
    href: "https://quintai.dev",
  },
  {
    index: "02",
    title: "Amazon",
    role: "SOFTWARE ENGINEER",
    year: "— NOW",
    description:
      "Shipping at scale. Systems that survive contact with a hundred million users teach you what 'production-ready' actually means.",
    tags: ["DISTRIBUTED SYSTEMS", "SCALE"],
    href: null,
  },
  {
    index: "03",
    title: "LectureAI",
    role: "BUILDER",
    year: "2025",
    description:
      "Upload slides, get a lecture — AI-generated video lectures from PDFs. Built end-to-end: rendering pipeline, voice synthesis, the works.",
    tags: ["NEXT.JS", "AI", "FFMPEG", "AWS"],
    href: "https://lecture-ai.com",
  },
];

function WorkRow({ entry, i }: { entry: (typeof entries)[number]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const Tag = entry.href ? motion.a : motion.div;

  return (
    <Tag
      href={entry.href ?? undefined}
      target={entry.href ? "_blank" : undefined}
      rel={entry.href ? "noopener noreferrer" : undefined}
      data-cursor={entry.href ? "pointer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: i * 0.08, ease }}
      className="group relative block border-t border-[var(--border)] py-10 transition-colors duration-500 last:border-b md:py-14"
    >
      {/* ember wipe */}
      <div
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ember transition-transform duration-500 group-hover:scale-x-100"
        style={{ transitionTimingFunction: "cubic-bezier(0.215,0.61,0.355,1)" }}
      />

      <div className="relative grid grid-cols-12 items-baseline gap-4 px-1 transition-colors duration-300">
        <span
          className={`col-span-2 font-mono text-xs md:col-span-1 ${
            hovered ? "text-[#0a0908]" : "text-dim"
          }`}
        >
          {entry.index}
        </span>

        <h3
          className={`col-span-10 text-4xl font-medium tracking-tight md:col-span-5 md:text-6xl ${
            hovered ? "text-[#0a0908]" : "text-ink"
          }`}
        >
          {entry.title}
          {entry.href && (
            <span
              className={`ml-3 inline-block text-2xl transition-transform duration-300 md:text-3xl ${
                hovered ? "translate-x-1 -translate-y-1" : ""
              }`}
            >
              ↗
            </span>
          )}
        </h3>

        <div className="col-span-12 mt-2 md:col-span-4 md:mt-0">
          <p
            className={`text-sm leading-relaxed ${
              hovered ? "text-[#0a0908]/80" : "text-muted"
            }`}
          >
            {entry.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className={`font-mono text-[0.6rem] tracking-[0.15em] ${
                  hovered ? "text-[#0a0908]/60" : "text-dim"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`col-span-12 mt-2 font-mono text-[0.65rem] tracking-[0.15em] md:col-span-2 md:mt-0 md:text-right ${
            hovered ? "text-[#0a0908]/70" : "text-dim"
          }`}
        >
          {entry.role}
          <br />
          {entry.year}
        </div>
      </div>
    </Tag>
  );
}

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-32 md:px-10 md:py-44">
      <p className="text-label mb-16 text-ember">
        <Scramble text="// SELECTED WORK" onView />
      </p>
      <div>
        {entries.map((entry, i) => (
          <WorkRow key={entry.title} entry={entry} i={i} />
        ))}
      </div>
    </section>
  );
}
