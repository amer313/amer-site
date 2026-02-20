# Personal Website Design — Amer Abbadi

## Purpose

Portfolio + creative playground + personal brand/blog hub. A site that signals "this person builds at a different level."

## Philosophy: "Quiet Chaos"

Dark, minimal layout that feels calm — but every element reveals depth on interaction. Restraint in layout, aggression in interaction.

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **Framer Motion** for animations and scroll-triggered reveals
- **Three.js** (via @react-three/fiber + @react-three/drei) for 3D elements
- **Lenis** for smooth scrolling
- Deployed on **Vercel**

## Visual Style

- Dark mode only — black/near-black backgrounds
- Clean sans-serif typography (Inter or similar)
- Subtle noise/grain overlay across the entire site
- Accent color: a single glow color (electric blue or white) for interactive highlights

## Sections

### 1. Hero (Full Viewport)

- Animated noise/grain background texture
- "AMER ABBADI" — large bold type, staggered split-text letter reveal on load
- Small interactive 3D geometry (torus knot) reacting to mouse position via Three.js
- Tagline fades in below name
- Custom cursor: small glowing dot with trailing blur

### 2. About

- Scroll-triggered text line reveals (each line animates in as it enters viewport)
- Bento grid layout with cards: tech stack, current projects, location
- Cards have 3D tilt on hover via Framer Motion transforms
- One card with live status (GitHub heatmap or "currently building" indicator)

### 3. Projects

- Horizontal scroll section pinned within the vertical page flow
- Large project cards with screenshots/previews
- Hover: image distortion effect (CSS/canvas ripple shader)
- Magnetic cursor that snaps toward project cards on approach
- Click expands into detail view with tech stack tags, description, links

### 4. Blog / Writing

- Clean list layout with scroll-triggered title reveals
- Hover on title: preview image slides in from the side
- Minimal — titles, dates, subtle line separators

### 5. Contact / Footer

- Marquee ticker strip: "LET'S WORK TOGETHER" repeating text
- Email and social links with magnetic hover effect
- Animated gradient blob background accent

## Global Effects

- **Lenis** smooth scrolling
- **Custom cursor**: dot + circle that morphs on interactive elements
- **Page transitions**: content fades/slides between routes
- **Noise overlay**: subtle grain texture for analog feel
- **Scroll progress indicator**: subtle side dots or top bar
