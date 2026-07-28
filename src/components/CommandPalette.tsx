"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Command = {
  id: string;
  label: string;
  hint?: string;
  keywords?: string;
  group: "CONNECT" | "SYSTEM";
  run: (ctx: Ctx) => void | Promise<void>;
};

type Ctx = {
  close: () => void;
  toast: (msg: string) => void;
  setMatrix: (on: boolean) => void;
};

const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

const COMMANDS: Command[] = [
  {
    id: "email",
    label: "Copy email address",
    hint: "amerabbadi377@gmail.com",
    group: "CONNECT",
    keywords: "mail contact reach clipboard",
    run: async ({ close, toast }) => {
      try {
        await navigator.clipboard.writeText("amerabbadi377@gmail.com");
        toast("EMAIL COPIED TO CLIPBOARD");
      } catch {
        toast("COPY FAILED, USE THE EMAIL LINK");
      }
      close();
    },
  },
  {
    id: "mailto",
    label: "Send an email",
    group: "CONNECT",
    keywords: "mail contact write",
    run: ({ close }) => {
      window.location.href = "mailto:amerabbadi377@gmail.com";
      close();
    },
  },
  {
    id: "github",
    label: "Open GitHub",
    hint: "@amer313",
    group: "CONNECT",
    keywords: "code repos source",
    run: ({ close }) => {
      open("https://github.com/amer313");
      close();
    },
  },
  {
    id: "linkedin",
    label: "Open LinkedIn",
    hint: "/amer-abbadi",
    group: "CONNECT",
    keywords: "work resume professional",
    run: ({ close }) => {
      open("https://www.linkedin.com/in/amer-abbadi/");
      close();
    },
  },
  {
    id: "x",
    label: "Open X",
    hint: "@amer_abbadi",
    group: "CONNECT",
    keywords: "twitter posts",
    run: ({ close }) => {
      open("https://x.com/amer_abbadi");
      close();
    },
  },
  {
    id: "copy-url",
    label: "Copy link to this page",
    group: "SYSTEM",
    keywords: "share url clipboard",
    run: async ({ close, toast }) => {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        toast("LINK COPIED");
      } catch {
        toast("COPY FAILED");
      }
      close();
    },
  },
  {
    id: "whoami",
    label: "whoami",
    hint: "who is this guy",
    group: "SYSTEM",
    keywords: "about bio identity",
    run: ({ close, toast }) => {
      toast("ENGINEER. FOUNDER. EXCEL IN EVERY HUMAN DOMAIN.");
      close();
    },
  },
  {
    id: "sudo",
    label: "sudo make me a sandwich",
    group: "SYSTEM",
    keywords: "root admin xkcd",
    run: ({ close, toast }) => {
      toast("PERMISSION DENIED. NICE TRY.");
      close();
    },
  },
  {
    id: "matrix",
    label: "Enter the matrix",
    hint: "you sure?",
    group: "SYSTEM",
    keywords: "rain green hack",
    run: ({ close, setMatrix }) => {
      setMatrix(true);
      close();
    },
  },
];

const GROUP_ORDER: Command["group"][] = ["CONNECT", "SYSTEM"];

function score(cmd: Command, q: string) {
  if (!q) return 1;
  const hay = `${cmd.label} ${cmd.hint ?? ""} ${cmd.keywords ?? ""}`.toLowerCase();
  const needle = q.toLowerCase();
  if (hay.includes(needle)) return 3;
  // fuzzy: all chars in order
  let i = 0;
  for (const ch of needle) {
    i = hay.indexOf(ch, i);
    if (i === -1) return 0;
    i++;
  }
  return 1;
}

export default function CommandPalette() {
  const [isTouch, setIsTouch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [matrix, setMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const results = useMemo(() => {
    const scored = COMMANDS.map((c) => ({ c, s: score(c, query) })).filter(
      (r) => r.s > 0
    );
    scored.sort((a, b) => b.s - a.s);
    return scored.map((r) => r.c);
  }, [query]);

  const grouped = useMemo(() => {
    const out: { group: Command["group"]; items: Command[] }[] = [];
    for (const g of GROUP_ORDER) {
      const items = results.filter((c) => c.group === g);
      if (items.length) out.push({ group: g, items });
    }
    return out;
  }, [results]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        if (matrix) setMatrix(false);
        else close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, matrix]);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActive(0);
      // focus after mount animation starts
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const ctx: Ctx = { close, toast, setMatrix };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[active]?.run(ctx);
    }
  };

  // keep active row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let runningIndex = -1;

  return (
    <>
      {/* trigger hint, bottom right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open command menu"
        className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 border border-[var(--border)] bg-[var(--bg)]/70 px-4 py-3 font-mono text-sm tracking-[0.12em] text-dim backdrop-blur-md transition-colors duration-300 hover:border-[var(--ember)] hover:text-ember active:border-[var(--ember)] active:text-ember"
      >
        {isTouch ? (
          // three-line menu glyph on touch; a keyboard hint would be a lie
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M1 1h16M1 6h16M1 11h10" />
          </svg>
        ) : (
          <>
            <span className="text-base leading-none">⌘</span> K
          </>
        )}
      </motion.button>

      {/* toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 border border-[var(--ember)] bg-[var(--bg)]/95 px-5 py-3 font-mono text-sm tracking-[0.12em] text-ember backdrop-blur-md"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* matrix easter egg */}
      <AnimatePresence>
        {matrix && <MatrixRain onExit={() => setMatrix(false)} />}
      </AnimatePresence>

      {/* palette */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[110] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.215, 0.61, 0.355, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl border border-[var(--border-hover)] bg-[var(--srf)] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
                <span className="font-mono text-sm text-ember">{">"}</span>
                <input
                  ref={inputRef}
                  id="command-palette-input"
                  name="command"
                  aria-label="Command"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type a command..."
                  className="w-full bg-transparent font-mono text-base text-ink outline-none placeholder:text-dim"
                  spellCheck={false}
                  autoComplete="off"
                />
                {isTouch ? (
                  <button
                    onClick={close}
                    aria-label="Close command menu"
                    className="shrink-0 border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-dim"
                  >
                    ✕
                  </button>
                ) : (
                  <kbd className="hidden shrink-0 border border-[var(--border)] px-2 py-1 font-mono text-xs text-dim sm:block">
                    ESC
                  </kbd>
                )}
              </div>

              <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
                {flat.length === 0 && (
                  <p className="px-5 py-6 font-mono text-sm text-dim">
                    No matches. Try &quot;email&quot; or &quot;github&quot;.
                  </p>
                )}

                {grouped.map(({ group, items }) => (
                  <div key={group} className="mb-1">
                    <p className="px-5 pb-1 pt-3 font-mono text-xs tracking-[0.2em] text-dim">
                      {group}
                    </p>
                    {items.map((cmd) => {
                      runningIndex++;
                      const idx = runningIndex;
                      const selected = idx === active;
                      return (
                        <button
                          key={cmd.id}
                          data-index={idx}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => cmd.run(ctx)}
                          className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors duration-150 ${
                            selected
                              ? "bg-[var(--ember)] text-[#0a0908]"
                              : "text-ink hover:bg-white/5"
                          }`}
                        >
                          <span className="font-mono text-base">
                            {cmd.label}
                          </span>
                          {cmd.hint && (
                            <span
                              className={`shrink-0 font-mono text-xs ${
                                selected ? "text-[#0a0908]/70" : "text-dim"
                              }`}
                            >
                              {cmd.hint}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-5 border-t border-[var(--border)] px-5 py-3 font-mono text-xs tracking-[0.12em] text-dim">
                {isTouch ? (
                  <span>TAP TO RUN</span>
                ) : (
                  <>
                    <span>↑↓ NAVIGATE</span>
                    <span>↵ RUN</span>
                  </>
                )}
                <span className="ml-auto">{flat.length} COMMANDS</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Ember-tinted digital rain. Click or Esc to exit. */
function MatrixRain({ onExit }: { onExit: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const FONT = 16;
    let cols = 0;
    let drops: number[] = [];

    const fit = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(w / FONT);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, w, h);
    };

    const CHARS = "01アイウエオカキクケコサシスセソABCDEF<>/\\{}[]#$%&";

    const draw = () => {
      // heavier clear = shorter, brighter trails
      ctx.fillStyle = "rgba(10, 9, 8, 0.16)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `700 ${FONT}px ui-monospace, monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * FONT;
        // bright leading glyph
        ctx.fillStyle = "rgba(255, 220, 190, 1)";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT, y);
        // ember tail
        ctx.fillStyle = "rgba(255, 110, 30, 0.95)";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT, y - FONT);
        ctx.fillStyle = "rgba(255, 77, 0, 0.6)";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT, y - FONT * 2);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.9;
      }
      raf = requestAnimationFrame(draw);
    };

    fit();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", fit);
    setTick(1);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onExit}
      className="fixed inset-0 z-[115]"
    >
      <canvas ref={ref} className="h-full w-full" />
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-sm tracking-[0.2em] text-ember">
        CLICK OR PRESS ESC TO WAKE UP
      </p>
    </motion.div>
  );
}
