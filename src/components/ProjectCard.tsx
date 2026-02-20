"use client";

import { motion } from "framer-motion";
import MagneticWrap from "@/components/MagneticWrap";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href: string;
  color: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  href,
  color,
}: ProjectCardProps) {
  return (
    <MagneticWrap strength={0.15}>
      <motion.a
        href={href}
        className="group block w-[400px] md:w-[500px] flex-shrink-0"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        data-cursor="pointer"
      >
        <div className="relative aspect-[16/10] rounded-xl border border-white/5 overflow-hidden mb-4">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color.split(" to ")[0]}, ${color.split(" to ")[1]})`,
            }}
          >
            <h3 className="text-3xl font-bold text-white/20">{title}</h3>
          </div>
          <div className="absolute inset-0 bg-white/5 mix-blend-overlay backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <h3 className="text-lg font-medium mb-2 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.a>
    </MagneticWrap>
  );
}
