"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 400, mass: 0.3 };
  const trailConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const smoothX = useSpring(cursorX, trailConfig);
  const smoothY = useSpring(cursorY, trailConfig);
  const trailX = useSpring(cursorX, { damping: 40, stiffness: 120, mass: 1.2 });
  const trailY = useSpring(cursorY, { damping: 40, stiffness: 120, mass: 1.2 });

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

  const baseSize = isPressed ? 12 : isHovering ? 60 : 20;

  return (
    <>
      {/* Outer trail — mix-blend-difference for inversion effect */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[997] rounded-full mix-blend-difference"
        data-no-transition
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "white",
        }}
        animate={{
          width: isHovering ? 80 : 30,
          height: isHovering ? 80 : 30,
          opacity: 0.15,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Main cursor — mix-blend-difference */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] rounded-full mix-blend-difference"
        data-no-transition
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "white",
        }}
        animate={{
          width: baseSize,
          height: baseSize,
        }}
        transition={{ type: "spring", ...springConfig }}
      />

      {/* Center dot — always crisp */}
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
