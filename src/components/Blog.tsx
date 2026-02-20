"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const posts = [
  {
    title: "Building a Personal Site That Doesn't Suck",
    date: "2026",
    preview: "Why most dev portfolios look the same and how to break out.",
  },
  {
    title: "The Stack I Use for Everything",
    date: "2026",
    preview: "My go-to tools and why I chose them.",
  },
  {
    title: "Lessons from Shipping Fast",
    date: "2025",
    preview: "What I learned building and launching products quickly.",
  },
];

export default function Blog() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-32 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-wider text-muted mb-12">
            Writing
          </p>
        </ScrollReveal>

        <div>
          {posts.map((post, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <a
                href="#"
                className="group relative block border-t border-[var(--border)] py-8"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor="pointer"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-medium text-accent/80 group-hover:text-accent transition-colors duration-300">
                      {post.title}
                    </h3>
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-muted mt-2 overflow-hidden"
                        >
                          {post.preview}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-sm text-muted shrink-0">
                    {post.date}
                  </span>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-accent/20"
                  initial={{ width: "0%" }}
                  animate={{ width: hoveredIndex === i ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
