"use client";

import ScrollReveal from "@/components/ScrollReveal";
import BentoCard from "@/components/BentoCard";

export default function About() {
  return (
    <section id="about" className="px-6 py-32 md:px-12 lg:px-24 max-w-5xl mx-auto">
      <ScrollReveal>
        <p className="text-base uppercase tracking-widest text-muted">About</p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <p className="text-2xl md:text-3xl text-accent/80 mt-8">
          Full-stack developer based in Northern Virginia. GMU grad. I like building things that feel polished and shipping them fast — currently working on <span className="italic text-accent font-semibold">LectureAI</span>.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <p className="text-lg text-muted mt-4">
          When I'm not coding, I'm on the soccer field, at the gym, or training MMA.
        </p>
      </ScrollReveal>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScrollReveal delay={0.2} className="md:col-span-2">
          <BentoCard>
            <h3 className="text-lg font-medium text-accent mb-4">Stack</h3>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "PostgreSQL", "AWS"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-accent/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </BentoCard>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <BentoCard>
            <h3 className="text-lg font-medium text-accent mb-4">Currently</h3>
            <p className="text-sm text-accent/70 mb-4">
              Building LectureAI — AI-powered lecture video generation
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-accent/70">Available for work</span>
            </div>
          </BentoCard>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <BentoCard>
            <h3 className="text-lg font-medium text-accent mb-4">Based in</h3>
            <p className="text-sm text-accent/70">Northern Virginia</p>
            <p className="text-xs text-muted mt-1">GMU '25</p>
          </BentoCard>
        </ScrollReveal>

        <ScrollReveal delay={0.5} className="md:col-span-2">
          <BentoCard>
            <h3 className="text-lg font-medium text-accent mb-4">Off the clock</h3>
            <p className="text-sm text-accent/70">
              Soccer, MMA, gym. Always moving.
            </p>
          </BentoCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
