"use client";

import { ReactLenis } from "lenis/react";

/**
 * Lenis options. Hoisted to module scope because ReactLenis re-creates the
 * instance whenever `JSON.stringify(options)` changes — an inline object would
 * be a fresh literal every render. (`easing` is dropped by stringify, so it
 * doesn't affect the identity either way.)
 */
const OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
};

/**
 * `root` puts the instance in Lenis's own module-level store, so `useLenis()`
 * resolves from anywhere in the tree — including siblings of this component,
 * which is how CommandPalette reaches it without restructuring the layout.
 * autoRaf handles the frame loop, so there's no manual requestAnimationFrame
 * to keep in sync.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={OPTIONS}>
      {children}
    </ReactLenis>
  );
}
