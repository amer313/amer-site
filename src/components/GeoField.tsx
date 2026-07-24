"use client";

import { useEffect, useRef } from "react";

/**
 * GeoField — reactive geometric background.
 * A triangular lattice of nodes; the pointer warps nearby nodes and
 * ignites edges ember. Signal pulses travel the lattice like live
 * network traffic. Scroll drifts the whole field slowly.
 */
export default function GeoField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const SPACING = 90;
    const RADIUS = 220; // pointer influence
    const WARP = 26; // max displacement px

    type Node = { ox: number; oy: number; x: number; y: number };
    let nodes: Node[] = [];
    let cols = 0;
    let rows = 0;

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let scrollY = window.scrollY;
    let raf = 0;

    // signal pulses that walk the lattice
    type Pulse = {
      r: number;
      c: number;
      pr: number;
      pc: number;
      t: number; // 0..1 along current edge
      speed: number;
      life: number; // hops remaining
      trail: { x: number; y: number }[];
    };
    let pulses: Pulse[] = [];

    const spawnPulse = (): Pulse => {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      return {
        r,
        c,
        pr: r,
        pc: c,
        t: 1, // pick a new edge immediately
        speed: 0.012 + Math.random() * 0.02,
        life: 6 + Math.floor(Math.random() * 10),
        trail: [],
      };
    };

    const hop = (p: Pulse) => {
      // choose a random lattice neighbor
      const even = p.r % 2 === 0;
      const opts = [
        [p.r, p.c + 1],
        [p.r, p.c - 1],
        [p.r + 1, p.c],
        [p.r - 1, p.c],
        [p.r + 1, even ? p.c - 1 : p.c + 1],
        [p.r - 1, even ? p.c - 1 : p.c + 1],
      ].filter(
        ([nr, nc]) =>
          nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
          !(nr === p.pr && nc === p.pc) // don't immediately backtrack
      );
      const [nr, nc] = opts[Math.floor(Math.random() * opts.length)] ?? [p.r, p.c];
      p.pr = p.r;
      p.pc = p.c;
      p.r = nr;
      p.c = nc;
      p.t = 0;
      p.life--;
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / SPACING) + 3;
      rows = Math.ceil(h / SPACING) + 3;
      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // offset every other row → triangular lattice
          const ox = c * SPACING + (r % 2 === 0 ? 0 : SPACING / 2) - SPACING;
          const oy = r * SPACING - SPACING;
          nodes.push({ ox, oy, x: ox, y: oy });
        }
      }
    };

    const idx = (r: number, c: number) => r * cols + c;

    const draw = () => {
      // ease pointer
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const drift = reduceMotion ? 0 : (scrollY * 0.06) % SPACING;

      ctx.clearRect(0, 0, w, h);

      // displace nodes
      for (const n of nodes) {
        const ny = n.oy - drift;
        const dx = n.ox - mouse.x;
        const dy = ny - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS && dist > 0.01 && !reduceMotion) {
          const force = (1 - dist / RADIUS) ** 2 * WARP;
          n.x = n.ox + (dx / dist) * force;
          n.y = ny + (dy / dist) * force;
        } else {
          n.x = n.ox;
          n.y = ny;
        }
      }

      // draw lattice edges
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = nodes[idx(r, c)];
          const draw2 = (b: Node | undefined) => {
            if (!b) return;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const dist = Math.hypot(mx - mouse.x, my - mouse.y);
            const heat = Math.max(0, 1 - dist / RADIUS);
            const base = 0.045;
            if (heat > 0.01) {
              ctx.strokeStyle = `rgba(255, 77, 0, ${base + heat * 0.5})`;
            } else {
              ctx.strokeStyle = `rgba(232, 230, 225, ${base})`;
            }
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          };
          // right neighbor
          if (c < cols - 1) draw2(nodes[idx(r, c + 1)]);
          // down-left / down-right neighbors (lattice diagonals)
          if (r < rows - 1) {
            draw2(nodes[idx(r + 1, c)]);
            const dc = r % 2 === 0 ? c - 1 : c + 1;
            if (dc >= 0 && dc < cols) draw2(nodes[idx(r + 1, dc)]);
          }
        }
      }

      // node points near pointer
      for (const n of nodes) {
        const dist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const heat = Math.max(0, 1 - dist / RADIUS);
        if (heat > 0.05) {
          ctx.fillStyle = `rgba(255, 77, 0, ${heat * 0.9})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.5 + heat * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // signal pulses walking the lattice
      if (!reduceMotion) {
        if (pulses.length < 7 && Math.random() < 0.02) pulses.push(spawnPulse());
        for (const p of pulses) {
          p.t += p.speed;
          if (p.t >= 1) {
            if (p.life <= 0) continue;
            hop(p);
          }
          const a = nodes[idx(p.pr, p.pc)];
          const b = nodes[idx(p.r, p.c)];
          if (!a || !b) continue;
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          p.trail.unshift({ x, y });
          if (p.trail.length > 14) p.trail.pop();

          // fading trail
          for (let i = 1; i < p.trail.length; i++) {
            const t0 = p.trail[i - 1];
            const t1 = p.trail[i];
            const fade = (1 - i / p.trail.length) * 0.55;
            ctx.strokeStyle = `rgba(255, 77, 0, ${fade})`;
            ctx.beginPath();
            ctx.moveTo(t0.x, t0.y);
            ctx.lineTo(t1.x, t1.y);
            ctx.stroke();
          }
          // bright head
          ctx.fillStyle = "rgba(255, 140, 60, 0.95)";
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        pulses = pulses.filter((p) => p.life > 0 || p.t < 1);
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };

    build();
    ctx.lineWidth = 1;
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", build);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
