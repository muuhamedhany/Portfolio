import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface TransitionProps {
  name: string;
  index: string;
}

const STRIP_COUNT = 14;
const TRACK = Array.from({ length: 9 });

interface StripMotion {
  delay: number;
  reduced: boolean;
}

const stripVariants = {
  hidden: ({ delay, reduced }: StripMotion) => ({
    scaleY: 0,
    transition: {
      duration: reduced ? 0.08 : 0.14,
      ease: "linear" as const,
      delay: reduced ? 0 : delay,
    },
  }),
  covered: ({ delay, reduced }: StripMotion) => ({
    scaleY: 1,
    transition: {
      duration: reduced ? 0.08 : 0.14,
      ease: "linear" as const,
      delay: reduced ? 0 : delay,
    },
  }),
};

/** Quiet pixel shutters cover the old page, announce the destination, then clear. */
export function Transition({ name, index }: TransitionProps) {
  const [phase, setPhase] = useState<"covered" | "hidden">("covered");
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const timer = setTimeout(() => setPhase("hidden"), 720);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-[repeat(14,minmax(0,1fr))]">
        {Array.from({ length: STRIP_COUNT }, (_, strip) => {
          const reverseStrip = STRIP_COUNT - strip - 1;
          const delay = (phase === "covered" ? strip : reverseStrip) * 0.016;

          return (
            <motion.div
              key={strip}
              custom={{ delay, reduced: reducedMotion }}
              variants={stripVariants}
              initial="hidden"
              animate={phase}
              className="bg-[var(--transition-base)]"
              style={{
                transformOrigin: strip % 2 === 0 ? "top" : "bottom",
                boxShadow: "inset -1px 0 0 var(--transition-line)",
                willChange: "transform",
              }}
            />
          );
        })}
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "covered" ? 0.38 : 0 }}
        transition={{ duration: reducedMotion ? 0.08 : 0.12, delay: phase === "covered" && !reducedMotion ? 0.22 : 0 }}
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--transition-line) 1px, transparent 1px), linear-gradient(to bottom, var(--transition-line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 grid place-items-center px-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "covered" ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0.08 : 0.14, delay: phase === "covered" && !reducedMotion ? 0.28 : 0 }}
      >
        <div>
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 bg-[var(--transition-accent)]" />
            <span className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-[var(--transition-line)]" />
            <h2
              className="font-display tracking-normal text-foreground"
              style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", fontWeight: 700 }}
            >
              {name}
            </h2>
          </div>

          <div aria-hidden="true" className="mx-auto mt-3 grid w-fit grid-cols-9 gap-1">
            {TRACK.map((_, block) => (
              <span
                key={block}
                className={`h-1.5 w-3 ${block === 4 ? "bg-[var(--transition-accent)]" : "bg-[var(--transition-panel)]"}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
