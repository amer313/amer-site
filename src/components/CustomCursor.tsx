"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 26, stiffness: 250, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 26, stiffness: 250, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY]
  );

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

  return (
    <>
      {/* trailing ring — ember on hover */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: isHovering
            ? "var(--cursor-border-hover)"
            : "var(--cursor-border)",
        }}
        animate={{
          width: isPressed ? 22 : isHovering ? 44 : 32,
          height: isPressed ? 22 : isHovering ? 44 : 32,
        }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
      />

      {/* core dot — instant */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          background: isHovering ? "var(--ember)" : "var(--cursor-color)",
        }}
        animate={{
          width: isPressed ? 8 : 5,
          height: isPressed ? 8 : 5,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 400 }}
      />
    </>
  );
}
