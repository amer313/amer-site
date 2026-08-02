"use client";

import { ReactLenis } from "lenis/react";

/**
 * Lenis options, at module scope so there's one stable object rather than a new
 * allocation per render. ReactLenis keys instance re-creation on
 * `JSON.stringify(options)`, so an inline literal with these same values would
 * NOT churn the instance — the stringified key is identical either way. Note
 * `easing` is a function and vanishes under stringify, meaning a change to it
 * alone would not be picked up; it still reaches the real instance because the
 * whole object is spread into `new Lenis()`.
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
