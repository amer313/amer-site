"use client";

import ScrollReveal from "@/components/ScrollReveal";
import MagneticWrap from "@/components/MagneticWrap";
import Marquee from "@/components/Marquee";

const socialLinks = [
  { name: "Email", href: "mailto:amerabbadi377@gmail.com" },
  { name: "GitHub", href: "https://github.com/amer313" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/amer-abbadi/" },
];

export default function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Marquee text="LET'S WORK TOGETHER" className="mb-20" />

      <section className="px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-base uppercase tracking-wider text-muted mb-8">
              Contact
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-2xl text-accent/80 mb-12">
              Got a project in mind? Let's build something great.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <MagneticWrap key={link.name} strength={0.4}>
                  <a
                    href={link.href}
                    className="group relative rounded-full border border-[var(--border)] px-6 py-3 text-sm text-accent/80 transition-colors duration-300 hover:border-[var(--border-hover)] hover:text-accent"
                    data-cursor="pointer"
                  >
                    <div className="absolute inset-0 -z-10 rounded-full bg-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {link.name}
                  </a>
                </MagneticWrap>
              ))}
            </div>
          </ScrollReveal>

          <div className="mt-32 border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted">
            <p>© {currentYear} Amer Abbadi</p>
            <p>Built with obsessive attention to detail.</p>
          </div>
        </div>
      </section>
    </>
  );
}
