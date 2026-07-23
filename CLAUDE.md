# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Amer Abbadi (amerabbadi.com). Next.js 16 App Router, deployed on Vercel.

## Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** with `@tailwindcss/postcss` — theme tokens defined as CSS custom properties in `src/app/globals.css`
- **Framer Motion** for animations
- **Lenis** for smooth scrolling
- **Fonts**: Archivo (body/display), JetBrains Mono (labels/telemetry), Instrument Serif italic (accent words) — loaded via `next/font/google`

## Commands

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # ESLint (next core-web-vitals + typescript)
```

## Architecture

- `src/app/` — App Router pages and layout. Single-page site with sections as components: BootIntro → Hero → Work → About → Contact.
- `src/components/` — All UI components. No subdirectory nesting.
- `@/*` path alias maps to `./src/*`
- **Design system: "Ember"** — dark only (no theme toggle). CSS variables in `globals.css`: `--bg` (warm near-black), `--ink` (bone white), `--ember` (#ff4d00 accent), `--mut`/`--dim` (grays).
- Signature elements: boot-sequence intro (once per tab via sessionStorage), text scramble effect (`Scramble.tsx`), mono telemetry strips, serif-italic accent words, ember wipe on work rows.

## Conventions

- Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, etc.
- Custom cursor hides the native cursor on `pointer: fine` devices — keep `cursor: none` in globals.css
- Tailwind v4 uses `@theme inline` directive for design tokens, not `tailwind.config`

## Design Reference

Design philosophy and section specs are in `docs/plans/2026-02-19-personal-site-design.md`.
