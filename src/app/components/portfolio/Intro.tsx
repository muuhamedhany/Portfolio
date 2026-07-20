import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface IntroProps {
  onComplete: () => void;
}

const STRIP_COUNT = 14;

interface StripMotion {
  delay: number;
  reduced: boolean;
}

const stripVariants = {
  visible: ({ delay, reduced }: StripMotion) => ({
    scaleY: 1,
    transition: {
      duration: reduced ? 0 : 0.14,
      ease: "linear" as const,
      delay: reduced ? 0 : delay,
    },
  }),
  exit: ({ delay, reduced }: StripMotion) => ({
    scaleY: 0,
    transition: {
      duration: reduced ? 0.08 : 0.14,
      ease: "linear" as const,
      delay: reduced ? 0 : delay,
    },
  }),
};

/** Pixel-shutter intro screen. Plays once on first load, then unmounts. */
export function Intro({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState<"holding" | "exit">("holding");
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    // Hold for 1s showing the name, then begin exit
    const holdTimer = setTimeout(() => setPhase("exit"), 1000);
    // Full exit complete after strips retract (~1.0s + 14*16ms stagger)
    const doneTimer = setTimeout(() => onComplete(), 1700);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, reducedMotion]);

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      {/* Shutter strips */}
      <div className="absolute inset-0 grid grid-cols-[repeat(14,minmax(0,1fr))]">
        {Array.from({ length: STRIP_COUNT }, (_, strip) => {
          const reverseStrip = STRIP_COUNT - strip - 1;
          const delay = (phase === "holding" ? 0 : reverseStrip * 0.016);

          return (
            <motion.div
              key={strip}
              custom={{ delay, reduced: reducedMotion }}
              variants={stripVariants}
              initial="visible"
              animate={phase === "exit" ? "exit" : "visible"}
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

      {/* Grid overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0.38 }}
        animate={{ opacity: phase === "exit" ? 0 : 0.38 }}
        transition={{ duration: 0.12 }}
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--transition-line) 1px, transparent 1px), linear-gradient(to bottom, var(--transition-line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Centered name */}
      <motion.div
        className="pointer-events-none absolute inset-0 grid place-items-center px-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: phase === "exit" ? 0.14 : 0.3, delay: phase === "exit" ? 0 : 0.25 }}
      >
        <div>
          <h1
            className="font-display tracking-normal text-foreground"
            style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)" }}
          >
            m<span className="text-gradient">uu</span>hamedhany
          </h1>

          {/* Pixel loading track */}
          <div aria-hidden="true" className="mx-auto mt-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: 7 }, (_, i) => (
              <motion.span
                key={i}
                className="h-1.5 w-3 bg-[var(--transition-panel)]"
                animate={{
                  backgroundColor: [
                    "var(--transition-panel)",
                    "var(--transition-accent)",
                    "var(--transition-panel)",
                  ],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
