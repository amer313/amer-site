"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import MagneticWrap from "@/components/MagneticWrap";

const projects = [
  {
    title: "LectureAI",
    description: "Upload slides, get a lecture — AI-powered video generation from PDFs",
    tags: ["Next.js", "React", "AWS", "AI", "FFmpeg"],
    href: "https://lecture-ai.com",
    color: "#1a1a2e",
    colorEnd: "#16213e",
  },
  {
    title: "This Portfolio",
    description: "The site you're looking at — a motion-heavy portfolio with 3D particle scenes, parallax scrolling, and a custom cursor",
    tags: ["Next.js", "React", "Three.js", "Framer Motion", "Tailwind"],
    href: "https://github.com/amer313/amer-site",
    color: "#0f0f23",
    colorEnd: "#1a0a2e",
  },
];

function ProjectRow({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: card content moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  // Gradient shifts on scroll
  const gradientY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div ref={ref} className={isEven ? "md:pr-44" : "md:pl-44"}>
      <ScrollReveal>
        <motion.a
          href={project.href}
          target={project.href !== "#" ? "_blank" : undefined}
          rel={project.href !== "#" ? "noopener noreferrer" : undefined}
          className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors duration-500"
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
          data-cursor="pointer"
        >
          {/* Solid background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${project.color}, ${project.colorEnd})`,
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08), transparent 60%)`,
              y: gradientY,
            }}
            data-no-transition
          />

          {/* Content */}
          <motion.div
            className="relative z-10 p-8 md:p-12"
            style={{ y }}
            data-no-transition
          >
            {/* Number */}
            <p className="font-mono text-sm text-white/40 tracking-widest mb-4">
              {String(index + 1).padStart(2, "0")}
            </p>

            {/* Title */}
            <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-none text-white">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/70 max-w-lg mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/60 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2 text-base text-white/50 group-hover:text-white transition-colors duration-300">
              <span className="uppercase tracking-wider">
                {project.href !== "#" ? "Visit project" : "Coming soon"}
              </span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                &rarr;
              </span>
            </div>
          </motion.div>

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${project.color}33, transparent 70%)`,
            }}
          />
        </motion.a>
      </ScrollReveal>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="px-6 py-32 md:px-12 lg:px-24 max-w-6xl mx-auto">
      <div className="mb-12 md:mb-16">
        <ScrollReveal>
          <p className="text-base uppercase tracking-wider text-muted">
            Projects
          </p>
        </ScrollReveal>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        {projects.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
