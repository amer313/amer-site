"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const trailConfig = { damping: 30, stiffness: 200, mass: 0.6 };
  const shadowX = useSpring(cursorX, trailConfig);
  const shadowY = useSpring(cursorY, trailConfig);

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

  const size = isPressed ? 14 : isHovering ? 32 : 22;

  return (
    <>
      {/* Shadow triangle — lagging behind, blurred */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[997] mix-blend-difference"
        data-no-transition
        style={{
          x: shadowX,
          y: shadowY,
          translateX: "-50%",
          translateY: "-50%",
          filter: "blur(4px)",
        }}
        animate={{
          width: size * 1.6,
          height: size * 1.6,
          rotate: isHovering ? 180 : 0,
          opacity: 0.3,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="h-full w-full">
          <polygon points="12,2 22,20 2,20" />
        </svg>
      </motion.div>

      {/* Main triangle cursor */}
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
          width: size,
          height: size,
          rotate: isPressed ? 60 : isHovering ? 180 : 0,
        }}
        transition={{ type: "spring", damping: 22, stiffness: 400 }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="h-full w-full">
          <polygon points="12,2 22,20 2,20" />
        </svg>
      </motion.div>
    </>
  );
}
