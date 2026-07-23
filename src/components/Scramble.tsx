"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";

interface ScrambleProps {
  text: string;
  className?: string;
  /** scramble once when scrolled into view */
  onView?: boolean;
  /** re-scramble on mouse enter */
  onHover?: boolean;
  speed?: number;
}

export default function Scramble({
  text,
  className = "",
  onView = true,
  onHover = false,
  speed = 28,
}: ScrambleProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);

  const play = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    const queue = text.split("").map((char, i) => ({
      char,
      start: i * 2,
      end: i * 2 + 10 + Math.floor(Math.random() * 10),
    }));
    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      if (now - last >= speed) {
        last = now;
        frame++;
        let out = "";
        let done = 0;
        for (const q of queue) {
          if (frame >= q.end) {
            out += q.char;
            done++;
          } else if (frame >= q.start) {
            out += q.char === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            out += " ";
          }
        }
        setDisplay(out);
        if (done === queue.length) return;
      }
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }, [text, speed]);

  useEffect(() => {
    if (!onView || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !playedRef.current) {
          playedRef.current = true;
          play();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [onView, play]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={onHover ? play : undefined}
      aria-label={text}
    >
      {display}
    </span>
  );
}
