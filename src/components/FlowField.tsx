"use client";

import { useEffect, useRef } from "react";

/**
 * FlowField — full-page reactive background.
 * Hundreds of drifting streaks follow a noise flow. The cursor is a
 * gravity well that pulls them in and ignites them ember; click to
 * invert the well and blast them away.
 */
export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return; // static bg is fine

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;

    const N = Math.min(
      2200,
      Math.floor((window.innerWidth * window.innerHeight) / 650)
    );
    // influence radius, scaled to viewport so phones get a tight bright
    // well instead of a huge diffuse one
    const WELL = Math.max(
      150,
      Math.min(260, Math.min(window.innerWidth, window.innerHeight) * 0.42)
    );

    type P = { x: number; y: number; px: number; py: number };
    let ps: P[] = [];

    const mouse = { x: -9999, y: -9999 };
    let invert = 1;

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, w, h);
      ps = Array.from({ length: N }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        px: 0,
        py: 0,
      }));
    };

    const draw = () => {
      // translucent fill = motion trails
      ctx.fillStyle = "rgba(10, 9, 8, 0.09)";
      ctx.fillRect(0, 0, w, h);

      const t = performance.now() * 0.00022;
      ctx.lineWidth = 1;

      for (const p of ps) {
        p.px = p.x;
        p.py = p.y;

        // noise flow
        const a =
          Math.sin(p.x * 0.008 + t * 2) + Math.cos(p.y * 0.008 - t * 1.6);
        let vx = Math.cos(a * Math.PI) * 1.1;
        let vy = Math.sin(a * Math.PI) * 1.1;

        // cursor gravity well
        if (mouse.x > -100) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < WELL) {
            const f = (1 - d / WELL) ** 1.5 * 3.2 * invert;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }

        p.x += vx;
        p.y += vy;

        // respawn off-canvas
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.px = p.x;
          p.py = p.y;
        }

        const heat =
          mouse.x > -100
            ? Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / WELL)
            : 0;
        ctx.strokeStyle =
          heat > 0.02
            ? `rgba(255, ${77 + heat * 110}, ${heat * 60}, ${0.28 + heat * 0.72})`
            : "rgba(232, 230, 225, 0.16)";
        ctx.lineWidth = heat > 0.45 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onDown = () => {
      invert = -1;
    };
    const onUp = () => {
      invert = 1;
    };

    // touch: dragging moves the well, and it lingers instead of vanishing
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      tiltActive = false; // direct input wins over gyro
    };

    // gyroscope: tilting the phone drifts the well around, so the field
    // reacts even when nobody is touching the screen
    let tiltActive = false;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tiltActive = true;
      // gamma: left/right (-90..90), beta: front/back (-180..180)
      const nx = Math.max(-1, Math.min(1, e.gamma / 45));
      const ny = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
      tiltTarget.x = w / 2 + (nx * w) / 2;
      tiltTarget.y = h / 2 + (ny * h) / 2;
    };
    const tiltTarget = { x: -9999, y: -9999 };

    // ease the tilt-driven well toward its target each frame
    const tiltRaf = () => {
      if (tiltActive && tiltTarget.x > -100) {
        if (mouse.x < -100) {
          mouse.x = tiltTarget.x;
          mouse.y = tiltTarget.y;
        } else {
          mouse.x += (tiltTarget.x - mouse.x) * 0.05;
          mouse.y += (tiltTarget.y - mouse.y) * 0.05;
        }
      }
      tiltFrame = requestAnimationFrame(tiltRaf);
    };
    let tiltFrame = 0;

    fit();
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", fit);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    if (isTouch) {
      // seed the well at center so the field is alive on first paint
      mouse.x = w / 2;
      mouse.y = h * 0.4;
      window.addEventListener("touchstart", onTouch, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });
      window.addEventListener("deviceorientation", onTilt);
      tiltFrame = requestAnimationFrame(tiltRaf);
    } else {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tiltFrame);
      window.removeEventListener("resize", fit);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("deviceorientation", onTilt);
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
