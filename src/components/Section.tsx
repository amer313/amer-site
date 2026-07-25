"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Scramble from "@/components/Scramble";

const ease = [0.215, 0.61, 0.355, 1] as const;

/**
 * Section — reusable below-the-fold block matching the Ember system.
 * Label + optional headline + free-form children. Content TBD; this
 * is the structural shell.
 */
export default function Section({
  id,
  label,
  headline,
  children,
}: {
  id: string;
  label: string;
  headline?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-32 md:px-10 md:py-40">
        <p className="text-label mb-14 text-ember">
          <Scramble text={`// ${label.toUpperCase()}`} onView />
        </p>

        {headline && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-ink md:text-6xl"
          >
            {headline}
          </motion.h2>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="mt-12"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
