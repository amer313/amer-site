# Personal Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dark, animation-heavy personal website for Amer Abbadi with 3D elements, smooth scroll, custom cursor, and interactive project showcases.

**Architecture:** Next.js 14 App Router with Tailwind CSS for styling, Framer Motion for animations, Three.js (via React Three Fiber) for 3D, and Lenis for smooth scrolling. Single-page layout with five sections: Hero, About, Projects, Blog, Contact.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, @react-three/fiber, @react-three/drei, Lenis

---

### Task 1: Scaffold Project + Install Dependencies

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `tsconfig.json` (via create-next-app)
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Step 1: Create Next.js project**

Run:
```bash
cd /Users/amerabbadi/Quint/amer-site
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This will scaffold into the current directory.

**Step 2: Install animation and 3D dependencies**

Run:
```bash
npm install framer-motion @react-three/fiber @react-three/drei three lenis
npm install -D @types/three
```

**Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts on localhost:3000 with default Next.js page.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with animation dependencies"
```

---

### Task 2: Global Styles + Dark Theme + Noise Overlay

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`
- Create: `src/components/NoiseOverlay.tsx`

**Step 1: Configure Tailwind for dark theme**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        surface: "#0a0a0a",
        accent: "#e0e0e0",
        muted: "#555555",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Set up global styles**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #050505;
  --surface: #0a0a0a;
  --accent: #e0e0e0;
  --muted: #555555;
}

* {
  cursor: none;
}

html {
  background: var(--bg);
  color: var(--accent);
}

body {
  background: var(--bg);
  overflow-x: hidden;
}

::selection {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

/* Smooth scroll container target for Lenis */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}
```

**Step 3: Create NoiseOverlay component**

Create `src/components/NoiseOverlay.tsx`:

```tsx
"use client";

export default function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }}
    />
  );
}
```

**Step 4: Update layout.tsx**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Amer Abbadi",
  description: "Developer, builder, creator.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-bg font-sans antialiased">
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
```

**Step 5: Verify dark page loads**

Run: `npm run dev`
Expected: Solid dark page with subtle noise texture visible on close inspection.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: dark theme, global styles, and noise overlay"
```

---

### Task 3: Lenis Smooth Scroll Provider

**Files:**
- Create: `src/components/SmoothScroll.tsx`
- Modify: `src/app/layout.tsx` — wrap children with SmoothScroll

**Step 1: Create SmoothScroll component**

Create `src/components/SmoothScroll.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

**Step 2: Add SmoothScroll to layout.tsx**

In `src/app/layout.tsx`, import and wrap children:

```tsx
import SmoothScroll from "@/components/SmoothScroll";
```

Update the body contents to:

```tsx
<body className="bg-bg font-sans antialiased">
  <NoiseOverlay />
  <SmoothScroll>{children}</SmoothScroll>
</body>
```

**Step 3: Verify smooth scrolling works**

Add temporary tall content to `src/app/page.tsx` to test scroll. Verify scrolling feels smooth and buttery.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Lenis smooth scroll provider"
```

---

### Task 4: Custom Cursor

**Files:**
- Create: `src/components/CustomCursor.tsx`
- Modify: `src/app/layout.tsx` — add CustomCursor

**Step 1: Create CustomCursor component**

Create `src/components/CustomCursor.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "pointer"
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] rounded-full bg-white"
        style={{
          x: cursorX,
          y: cursorY,
          width: 6,
          height: 6,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[998] rounded-full border border-white/40"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 56 : 36,
          height: isHovering ? 56 : 36,
          borderColor: isHovering
            ? "rgba(255,255,255,0.8)"
            : "rgba(255,255,255,0.4)",
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
```

**Step 2: Add to layout.tsx**

Import and add `<CustomCursor />` inside body, before NoiseOverlay.

**Step 3: Verify cursor works**

Run dev server. Default cursor should be hidden (via `cursor: none` in globals.css). Custom dot + ring should follow mouse. Ring should grow when hovering links/buttons.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: custom cursor with hover scaling"
```

---

### Task 5: Hero Section — Text Reveal + 3D Object

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/HeroScene.tsx`
- Create: `src/components/SplitText.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create SplitText animation component**

Create `src/components/SplitText.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function SplitText({ text, className = "", delay = 0 }: SplitTextProps) {
  const letters = text.split("");

  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}
```

**Step 2: Create 3D hero scene**

Create `src/components/HeroScene.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { TorusKnot, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function InteractiveShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      pointer.x * 1.5,
      0.05
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      pointer.y * 1.5,
      0.05
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <TorusKnot ref={meshRef} args={[1, 0.3, 128, 32]}>
        <MeshDistortMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          wireframe
        />
      </TorusKnot>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <InteractiveShape />
      </Canvas>
    </div>
  );
}
```

**Step 3: Create Hero section**

Create `src/components/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SplitText from "./SplitText";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <HeroScene />

      <div className="relative z-10 text-center">
        <h1 className="text-[clamp(3rem,10vw,9rem)] font-bold leading-none tracking-tighter">
          <SplitText text="AMER" delay={0.3} />
          <br />
          <SplitText text="ABBADI" delay={0.6} />
        </h1>

        <motion.p
          className="mt-6 text-lg text-muted"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Developer. Builder. Creator.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-widest text-muted">
            Scroll to explore
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-muted"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 4: Wire up page.tsx**

Replace `src/app/page.tsx`:

```tsx
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

**Step 5: Verify hero loads**

Run: `npm run dev`
Expected: Full-screen dark hero with animated name reveal, rotating wireframe torus knot following cursor, tagline fading in after.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: hero section with split-text reveal and 3D torus knot"
```

---

### Task 6: About Section — Scroll Reveals + Bento Grid

**Files:**
- Create: `src/components/About.tsx`
- Create: `src/components/BentoCard.tsx`
- Create: `src/components/ScrollReveal.tsx`
- Modify: `src/app/page.tsx` — add About section

**Step 1: Create ScrollReveal wrapper**

Create `src/components/ScrollReveal.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const offsets = {
    up: { y: 40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: offsets[direction].y,
        x: offsets[direction].x,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Create BentoCard with 3D tilt**

Create `src/components/BentoCard.tsx`:

```tsx
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
}

export default function BentoCard({ children, className = "" }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), {
    damping: 20,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), {
    damping: 20,
    stiffness: 150,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`rounded-2xl border border-white/5 bg-surface p-6 transition-colors hover:border-white/10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
```

**Step 3: Create About section**

Create `src/components/About.tsx`:

```tsx
"use client";

import ScrollReveal from "./ScrollReveal";
import BentoCard from "./BentoCard";

const stack = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Go", "PostgreSQL", "AWS",
];

export default function About() {
  return (
    <section className="relative px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-sm uppercase tracking-widest text-muted">
            About
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="max-w-2xl text-2xl leading-relaxed text-accent/80 md:text-3xl">
            I build products that feel alive. Full-stack developer
            obsessed with craft, performance, and the details that
            make software feel <em className="text-white">right</em>.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          <ScrollReveal delay={0.1} className="md:col-span-2">
            <BentoCard className="h-full">
              <h3 className="mb-4 text-xs uppercase tracking-widest text-muted">
                Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-accent/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <BentoCard className="h-full">
              <h3 className="mb-4 text-xs uppercase tracking-widest text-muted">
                Currently
              </h3>
              <p className="text-sm text-accent/70">
                Building tools that make developers faster.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs text-muted">Available for work</span>
              </div>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <BentoCard>
              <h3 className="mb-4 text-xs uppercase tracking-widest text-muted">
                Based in
              </h3>
              <p className="text-lg text-accent/80">🌍 Earth</p>
              <p className="mt-1 text-xs text-muted">Remote-first</p>
            </BentoCard>
          </ScrollReveal>

          <ScrollReveal delay={0.25} className="md:col-span-2">
            <BentoCard className="h-full">
              <h3 className="mb-4 text-xs uppercase tracking-widest text-muted">
                Philosophy
              </h3>
              <p className="text-sm leading-relaxed text-accent/70">
                Ship fast, iterate faster. Every pixel matters.
                Code should be as elegant as the interfaces it creates.
              </p>
            </BentoCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

**Step 4: Add About to page.tsx**

Import and add `<About />` after `<Hero />` in page.tsx.

**Step 5: Verify scroll reveals and tilt cards work**

Run dev server. Scroll down — text should animate in. Hover bento cards — they should tilt in 3D following the mouse.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: about section with scroll reveals and 3D tilt bento cards"
```

---

### Task 7: Projects Section — Horizontal Scroll + Hover Effects

**Files:**
- Create: `src/components/Projects.tsx`
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/MagneticWrap.tsx`
- Modify: `src/app/page.tsx` — add Projects section

**Step 1: Create MagneticWrap component**

Create `src/components/MagneticWrap.tsx`:

```tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, ReactNode } from "react";

interface MagneticWrapProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticWrap({
  children,
  className = "",
  strength = 0.3,
}: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 150 });
  const springY = useSpring(y, { damping: 15, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Create ProjectCard component**

Create `src/components/ProjectCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import MagneticWrap from "./MagneticWrap";

interface Project {
  title: string;
  description: string;
  tags: string[];
  href: string;
  color: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <MagneticWrap strength={0.15}>
      <motion.a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="pointer"
        className="group block w-[400px] flex-shrink-0 md:w-[500px]"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image placeholder */}
        <div
          className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-white/5"
          style={{ background: project.color }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white/20">
            {project.title}
          </div>
          {/* Hover distortion overlay */}
          <motion.div
            className="absolute inset-0 bg-white/5 opacity-0 mix-blend-overlay backdrop-blur-[2px]"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <h3 className="text-lg font-medium text-accent group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
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
```

**Step 3: Create Projects section with horizontal scroll**

Create `src/components/Projects.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Project One",
    description: "A full-stack application that does amazing things.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "#",
    color: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  },
  {
    title: "Project Two",
    description: "Developer tooling that makes teams move faster.",
    tags: ["Go", "CLI", "Open Source"],
    href: "#",
    color: "linear-gradient(135deg, #0f0f23 0%, #1a0a2e 100%)",
  },
  {
    title: "Project Three",
    description: "Real-time collaboration platform with zero latency.",
    tags: ["React", "WebSocket", "Redis"],
    href: "#",
    color: "linear-gradient(135deg, #1a2e1a 0%, #0f230f 100%)",
  },
  {
    title: "Project Four",
    description: "Mobile-first experience built for scale.",
    tags: ["React Native", "Node.js", "AWS"],
    href: "#",
    color: "linear-gradient(135deg, #2e1a1a 0%, #231616 100%)",
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
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-12 lg:px-24">
          <ScrollReveal>
            <h2 className="mb-12 text-sm uppercase tracking-widest text-muted">
              Projects
            </h2>
          </ScrollReveal>
        </div>

        <motion.div
          style={{ x }}
          className="flex gap-8 pl-6 md:pl-12 lg:pl-24"
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 4: Add Projects to page.tsx**

Import and add `<Projects />` after `<About />`.

**Step 5: Verify horizontal scroll works**

Run dev server. Scroll through the projects section — cards should move horizontally as you scroll vertically. Hovering cards should show magnetic pull and scale effect.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: projects section with horizontal scroll and magnetic cards"
```

---

### Task 8: Blog Section

**Files:**
- Create: `src/components/Blog.tsx`
- Modify: `src/app/page.tsx` — add Blog section

**Step 1: Create Blog section**

Create `src/components/Blog.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

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
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-12 text-sm uppercase tracking-widest text-muted">
            Writing
          </h2>
        </ScrollReveal>

        <div className="space-y-0">
          {posts.map((post, i) => (
            <ScrollReveal key={post.title} delay={i * 0.1}>
              <a
                href="#"
                data-cursor="pointer"
                className="group relative block border-t border-white/5 py-8 transition-colors hover:border-white/10"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-accent transition-colors group-hover:text-white md:text-2xl">
                      {post.title}
                    </h3>
                    <AnimatePresence>
                      {hovered === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 text-sm text-muted"
                        >
                          {post.preview}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="shrink-0 text-sm text-muted">
                    {post.date}
                  </span>
                </div>

                {/* Hover line animation */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-white/20"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add Blog to page.tsx**

Import and add `<Blog />` after `<Projects />`.

**Step 3: Verify hover previews work**

Run dev server. Hover over blog titles — description should expand with animation. Bottom line should animate across.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: blog section with hover preview reveals"
```

---

### Task 9: Contact / Footer — Marquee + Magnetic Links

**Files:**
- Create: `src/components/Contact.tsx`
- Create: `src/components/Marquee.tsx`
- Modify: `src/app/page.tsx` — add Contact section

**Step 1: Create Marquee component**

Create `src/components/Marquee.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  text: string;
  className?: string;
}

export default function Marquee({ text, className = "" }: MarqueeProps) {
  const repeated = `${text} — `.repeat(6);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-block"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        <span className="inline-block pr-4 text-5xl font-bold uppercase tracking-tight text-accent/10 md:text-7xl lg:text-8xl">
          {repeated}
        </span>
        <span className="inline-block pr-4 text-5xl font-bold uppercase tracking-tight text-accent/10 md:text-7xl lg:text-8xl">
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}
```

**Step 2: Create Contact section**

Create `src/components/Contact.tsx`:

```tsx
"use client";

import ScrollReveal from "./ScrollReveal";
import MagneticWrap from "./MagneticWrap";
import Marquee from "./Marquee";

const links = [
  { label: "Email", href: "mailto:hello@amerabbadi.com" },
  { label: "GitHub", href: "https://github.com/amerabbadi" },
  { label: "LinkedIn", href: "https://linkedin.com/in/amerabbadi" },
  { label: "Twitter / X", href: "https://x.com/amerabbadi" },
];

export default function Contact() {
  return (
    <section className="relative py-32">
      <Marquee text="LET'S WORK TOGETHER" className="mb-20" />

      <div className="px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-4 text-sm uppercase tracking-widest text-muted">
              Contact
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mb-12 max-w-lg text-2xl text-accent/80">
              Got a project in mind? Let's build something great.
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap gap-6">
            {links.map((link, i) => (
              <ScrollReveal key={link.label} delay={0.1 + i * 0.05}>
                <MagneticWrap strength={0.4}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="pointer"
                    className="group relative inline-block rounded-full border border-white/10 px-6 py-3 text-sm text-accent/70 transition-all hover:border-white/30 hover:text-white"
                  >
                    {link.label}
                    <span className="absolute inset-0 -z-10 rounded-full bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </MagneticWrap>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-32 flex items-center justify-between border-t border-white/5 pt-8">
            <span className="text-xs text-muted">
              © {new Date().getFullYear()} Amer Abbadi
            </span>
            <span className="text-xs text-muted">
              Built with obsessive attention to detail.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Add Contact to page.tsx**

Import and add `<Contact />` after `<Blog />`.

**Step 4: Verify marquee and magnetic links work**

Run dev server. Marquee should scroll infinitely. Social links should have magnetic pull and hover glow.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: contact footer with marquee and magnetic links"
```

---

### Task 10: Final Polish + Build Verification

**Files:**
- Modify: various files for final tweaks
- Modify: `src/app/page.tsx` — ensure section spacing is consistent

**Step 1: Add section dividers and spacing pass**

Review all sections in page.tsx and ensure consistent spacing. Add subtle section dividers if needed (thin gradient lines between sections).

**Step 2: Verify full build passes**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 3: Test production build locally**

Run:
```bash
npm run start
```

Navigate through the entire page. Verify:
- Hero text animation plays on load
- 3D torus knot follows cursor
- Custom cursor works everywhere
- Smooth scroll is active
- About cards tilt on hover
- Projects scroll horizontally
- Blog titles expand on hover
- Marquee scrolls infinitely
- Magnetic links pull toward cursor
- Noise overlay is visible but subtle

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: final polish and build verification"
```
