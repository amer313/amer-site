"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Gate {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

function GateElement({ gate, mouseX, mouseY }: { gate: Gate; mouseX: number; mouseY: number }) {
  const dx = gate.x - mouseX;
  const dy = gate.y - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxDist = 150;
  const openAmount = Math.max(0, 1 - dist / maxDist);
  const spread = openAmount * 18;
  const glowOpacity = openAmount * 0.6;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: gate.x,
        top: gate.y,
        transform: `rotate(${gate.rotation}deg)`,
      }}
    >
      {/* Left gate half */}
      <motion.div
        className="absolute rounded-full bg-accent"
        animate={{
          x: -spread - gate.size / 2,
          y: -1,
          width: gate.size,
          height: 2,
          opacity: 0.15 + openAmount * 0.3,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
      {/* Right gate half */}
      <motion.div
        className="absolute rounded-full bg-accent"
        animate={{
          x: spread - gate.size / 2 + gate.size,
          y: -1,
          width: gate.size,
          height: 2,
          opacity: 0.15 + openAmount * 0.3,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
      {/* Center glow when open */}
      {openAmount > 0.05 && (
        <motion.div
          className="absolute rounded-full"
          animate={{
            x: -2,
            y: -2,
            width: 4,
            height: 4,
            opacity: glowOpacity,
          }}
          style={{
            background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        />
      )}
    </div>
  );
}

export default function CursorGates() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gates, setGates] = useState<Gate[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateGates = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const newGates: Gate[] = [];

      for (let i = 0; i < 40; i++) {
        newGates.push({
          id: i,
          x: Math.random() * w,
          y: Math.random() * h,
          rotation: Math.random() * 360,
          size: 8 + Math.random() * 16,
        });
      }
      setGates(newGates);
    };

    generateGates();
    window.addEventListener("resize", generateGates);
    return () => window.removeEventListener("resize", generateGates);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[40] overflow-hidden"
      data-no-transition
    >
      {gates.map((gate) => (
        <GateElement
          key={gate.id}
          gate={gate}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
        />
      ))}
    </div>
  );
}
