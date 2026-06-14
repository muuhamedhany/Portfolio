import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

interface TransitionProps {
  name: string;
  index: string;
}

const COLS = 22;
const ROWS = 13;
const COUNT = COLS * ROWS;

// weighted palette: mostly background blocks, occasional accent "ore"
const PALETTE = [
  "var(--background)",
  "var(--background)",
  "var(--background)",
  "var(--card)",
  "var(--accent-from)",
  "var(--accent-to)",
];

const blockVariants = {
  hidden: (c: { in: number; out: number }) => ({
    scale: 0,
    transition: { duration: 0.14, ease: "linear" as const, delay: c.out },
  }),
  covered: (c: { in: number; out: number }) => ({
    scale: 1,
    transition: { duration: 0.14, ease: "linear" as const, delay: c.in },
  }),
};

/** Minecraft-style pixel dissolve: blocks fill in, name shows, blocks clear out. */
export function Transition({ name, index }: TransitionProps) {
  const [phase, setPhase] = useState<"covered" | "hidden">("covered");

  // begin clearing the blocks once the page has swapped underneath
  useEffect(() => {
    const t = setTimeout(() => setPhase("hidden"), 720);
    return () => clearTimeout(t);
  }, []);

  const blocks = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        in: Math.random() * 0.38,
        out: Math.random() * 0.38,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* pixel block grid */}
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {blocks.map((b, i) => (
          <motion.div
            key={i}
            custom={b}
            variants={blockVariants}
            initial="hidden"
            animate={phase}
            style={{
              backgroundColor: b.color,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.025)",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* section announcer */}
      <motion.div
        className="pointer-events-none absolute inset-0 grid place-items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "covered" ? 1 : 0 }}
        transition={{ duration: 0.2, delay: phase === "covered" ? 0.22 : 0 }}
      >
        <div>
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[var(--accent-to)]">{index}</div>
          <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(2.5rem, 12vw, 8rem)", fontWeight: 800 }}>
            {name}
          </h2>
        </div>
      </motion.div>
    </div>
  );
}
