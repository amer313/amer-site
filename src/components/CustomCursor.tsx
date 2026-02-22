"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const mid = { damping: 22, stiffness: 300, mass: 0.4 };
  const outer = { damping: 28, stiffness: 180, mass: 0.7 };
  const midX = useSpring(cursorX, mid);
  const midY = useSpring(cursorY, mid);
  const outerX = useSpring(cursorX, outer);
  const outerY = useSpring(cursorY, outer);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

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
  }, [handleMouseMove, isTouchDevice]);

  if (isTouchDevice) return null;

  const innerSize = isPressed ? 10 : isHovering ? 18 : 14;
  const midSize = isPressed ? 18 : isHovering ? 32 : 24;
  const outerSize = isPressed ? 26 : isHovering ? 48 : 36;

  return (
    <>
      {/* Outer triangle — slowest, largest */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[997] mix-blend-difference"
        data-no-transition
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: outerSize,
          height: outerSize,
          rotate: isPressed ? 120 : isHovering ? 240 : 0,
        }}
        transition={{ type: "spring", damping: 28, stiffness: 180 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="h-full w-full opacity-40">
          <polygon points="12,2 22,20 2,20" />
        </svg>
      </motion.div>

      {/* Middle triangle — medium speed */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[998] mix-blend-difference"
        data-no-transition
        style={{
          x: midX,
          y: midY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: midSize,
          height: midSize,
          rotate: isPressed ? 60 : isHovering ? 180 : 0,
        }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="h-full w-full opacity-70">
          <polygon points="12,2 22,20 2,20" />
        </svg>
      </motion.div>

      {/* Inner triangle — fastest, smallest, solid */}
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
          width: innerSize,
          height: innerSize,
          rotate: isPressed ? 30 : isHovering ? 60 : 0,
        }}
        transition={{ type: "spring", damping: 18, stiffness: 400 }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="h-full w-full">
          <polygon points="12,2 22,20 2,20" />
        </svg>
      </motion.div>
    </>
  );
}
