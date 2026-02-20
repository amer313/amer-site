"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "Project One",
    description: "A full-stack application built with modern technologies",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "#",
    color: "#1a1a2e to #16213e",
  },
  {
    title: "Project Two",
    description: "Command-line tool for developer productivity",
    tags: ["Go", "CLI", "Open Source"],
    href: "#",
    color: "#0f0f23 to #1a0a2e",
  },
  {
    title: "Project Three",
    description: "Real-time collaboration platform with live updates",
    tags: ["React", "WebSocket", "Redis"],
    href: "#",
    color: "#1a2e1a to #0f230f",
  },
  {
    title: "Project Four",
    description: "Cross-platform mobile application with cloud backend",
    tags: ["React Native", "Node.js", "AWS"],
    href: "#",
    color: "#2e1a1a to #231616",
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="mb-12 px-6 md:px-12 lg:px-24">
          <ScrollReveal>
            <p className="text-sm uppercase tracking-wider text-muted">Projects</p>
          </ScrollReveal>
        </div>
        <motion.div
          style={{ x }}
          className="flex gap-8 pl-6 md:pl-12 lg:pl-24"
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
