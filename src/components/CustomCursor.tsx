"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const trailConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(cursorX, trailConfig);
  const smoothY = useSpring(cursorY, trailConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

  useEffect(() => {
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

    const handleMouseOut = () => setIsHovering(false);
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <>
      {/* Outer trail glow — soft, lagging */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[997] rounded-full mix-blend-difference"
        data-no-transition
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "white",
        }}
        animate={{
          width: isHovering ? 80 : 40,
          height: isHovering ? 80 : 40,
          opacity: 0.12,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Main cursor — rounded triangle shape */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] mix-blend-difference"
        data-no-transition
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isPressed ? 16 : isHovering ? 36 : 24,
          height: isPressed ? 16 : isHovering ? 36 : 24,
          rotate: isPressed ? 60 : isHovering ? 180 : 0,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 400 }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="h-full w-full">
          <path d="M12 3 L21.5 19.5 Q22 20.5 21 20.5 L3 20.5 Q2 20.5 2.5 19.5 Z" />
        </svg>
      </motion.div>

      {/* Tiny center dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[1000] rounded-full mix-blend-difference"
        data-no-transition
        style={{
          x: cursorX,
          y: cursorY,
          width: 4,
          height: 4,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "white",
        }}
      />
    </>
  );
}
