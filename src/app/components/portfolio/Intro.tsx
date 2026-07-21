import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

interface IntroProps {
  onComplete: () => void;
  onExitStart?: () => void;
}

const STRIP_COUNT = 14;
const FULL_NAME = "muuhamedhany";
const GLITCH_GLYPHS = ["µ", "u", "█", "░", "§", "±", "×", "ø", "u"];

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

/** Pixel-shutter intro screen with typewriter name & primary color 'uu' glitch (~6.5s total pacing). */
export function Intro({ onComplete, onExitStart }: IntroProps) {
  const [phase, setPhase] = useState<"typing" | "glitching" | "holding" | "exit">("typing");
  const [typedCount, setTypedCount] = useState(0);
  const [glitchDisplay, setGlitchDisplay] = useState(["u", "u"]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const reducedMotion = useReducedMotion() ?? false;

  const onCompleteRef = useRef(onComplete);
  const onExitStartRef = useRef(onExitStart);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onExitStartRef.current = onExitStart;
  }, [onComplete, onExitStart]);

  // Cursor blinking timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 450);
    return () => clearInterval(blinkInterval);
  }, []);

  // Main intro sequence (~6.5s total timing)
  useEffect(() => {
    if (reducedMotion) {
      onCompleteRef.current();
      return;
    }

    const CHAR_DELAY_MS = 70; // ~2.16s typing duration for 12 chars
    const GLITCH_DURATION_MS = 800; // ~1.2s glitch duration
    const HOLD_DURATION_MS = 1500; // ~1.5s hold duration
    const SHUTTER_EXIT_MS = 1900; // ~1.3s shutter exit duration

    // 1. Typewriter step (180ms per character)
    const typeInterval = setInterval(() => {
      setTypedCount((count) => {
        if (count < FULL_NAME.length) {
          return count + 1;
        } else {
          clearInterval(typeInterval);
          return count;
        }
      });
    }, CHAR_DELAY_MS);

    // 2. Trigger 'uu' glitch once fully typed
    const glitchStartMs = FULL_NAME.length * CHAR_DELAY_MS + 240;

    let glitchInterval: NodeJS.Timeout;
    const glitchRunTimer = setTimeout(() => {
      setPhase("glitching");
      glitchInterval = setInterval(() => {
        const g1 = GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
        const g2 = GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
        setGlitchDisplay([g1, g2]);
      }, 60);
    }, glitchStartMs);

    // 3. Stop glitch & lock into primary color ('holding' phase)
    const holdTimer = setTimeout(() => {
      clearInterval(glitchInterval);
      setGlitchDisplay(["u", "u"]);
      setPhase("holding");
    }, glitchStartMs + GLITCH_DURATION_MS);

    // 4. Start shutter exit
    const exitTimer = setTimeout(() => {
      setPhase("exit");
      onExitStartRef.current?.();
    }, glitchStartMs + GLITCH_DURATION_MS + HOLD_DURATION_MS);

    // 5. Complete intro & unmount
    const doneTimer = setTimeout(() => {
      onCompleteRef.current();
    }, glitchStartMs + GLITCH_DURATION_MS + HOLD_DURATION_MS + SHUTTER_EXIT_MS);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(glitchRunTimer);
      clearInterval(glitchInterval);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [reducedMotion]);

  // Breakdown of typed string: "m" (0), "uu" (1..2), "hamedhany" (3..11)
  const showFirstM = typedCount >= 1;
  const showU1 = typedCount >= 2;
  const showU2 = typedCount >= 3;
  const restText = typedCount > 3 ? FULL_NAME.slice(3, typedCount) : "";

  const isGlitching = phase === "glitching";
  const isHoldingOrExit = phase === "holding" || phase === "exit";

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden select-none">
      {/* Shutter strips */}
      <div className="absolute inset-0 grid grid-cols-[repeat(14,minmax(0,1fr))]">
        {Array.from({ length: STRIP_COUNT }, (_, strip) => {
          const reverseStrip = STRIP_COUNT - strip - 1;
          const delay = phase === "exit" ? reverseStrip * 0.016 : 0;

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

      {/* Pixel grid overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: phase === "exit" ? 0 : 0.4 }}
        transition={{ duration: 0.15 }}
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--transition-line) 1px, transparent 1px), linear-gradient(to bottom, var(--transition-line) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Centered Pixel Intro Content */}
      <motion.div
        className="pointer-events-none absolute inset-0 grid place-items-center px-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: phase === "exit" ? 0.14 : 0.3, delay: phase === "exit" ? 0 : 0.1 }}
      >
        <div className="relative flex flex-col items-center">
          {/* Main Typewriter Name Header */}
          <h1
            className="font-display tracking-tight text-foreground flex items-center justify-center font-normal"
            style={{ fontSize: "clamp(2.5rem, 8.5vw, 5.5rem)", minHeight: "1.2em" }}
          >
            <span>{showFirstM ? "m" : ""}</span>

            {/* 'uu' Glitchable / Primary Color Section */}
            {(showU1 || showU2) && (
              <span
                className={`inline-flex transition-colors duration-200 ${
                  isGlitching
                    ? "text-foreground bg-primary/20 px-1 rounded-sm animate-pulse tracking-widest font-mono text-[0.85em]"
                    : isHoldingOrExit
                    ? "text-gradient drop-shadow-[0_0_18px_rgba(139,128,223,0.6)] font-bold scale-[1.03] transition-transform duration-300"
                    : "text-foreground"
                }`}
              >
                {isGlitching ? (
                  <>
                    <span>{glitchDisplay[0]}</span>
                    <span>{glitchDisplay[1]}</span>
                  </>
                ) : (
                  <>
                    <span>{showU1 ? "u" : ""}</span>
                    <span>{showU2 ? "u" : ""}</span>
                  </>
                )}
              </span>
            )}

            {/* Rest of name */}
            <span>{restText}</span>

            {/* Blinking Pixel Block Cursor */}
            <span
              className={`inline-block w-[0.45em] h-[0.78em] bg-[var(--primary)] ml-1 align-middle transition-opacity duration-100 ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ boxShadow: "0 0 10px var(--primary)" }}
            />
          </h1>

          {/* Minimalist Pixel Loading Track */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-1.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            aria-hidden="true"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <motion.span
                key={i}
                className="h-1.5 w-3.5 bg-[var(--transition-panel)]"
                animate={{
                  backgroundColor: [
                    "var(--transition-panel)",
                    "var(--primary)",
                    "var(--transition-panel)",
                  ],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.09,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
