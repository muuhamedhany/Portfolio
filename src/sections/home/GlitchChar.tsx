import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";

const GLITCH_SYMBOLS = "!@#$%^&*()_+-=[]{}|;:<>?/░▒▓█";

export interface GlitchCharProps {
  char: string;
  isGradient: boolean;
  index?: number;
  glitchTrigger?: number;
}

export const charVariant = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function GlitchChar({ char, isGradient, index = 0, glitchTrigger }: GlitchCharProps) {
  const [displayChar, setDisplayChar] = useState(char);
  const [isGlitching, setIsGlitching] = useState(false);
  const timerRef = useRef<number | null>(null);
  const isGlitchingRef = useRef(false);

  const triggerGlitch = useCallback(() => {
    if (isGlitchingRef.current) return;
    isGlitchingRef.current = true;
    setIsGlitching(true);
    let count = 0;
    const maxGlitchFrames = 6;

    const glitch = () => {
      count++;
      if (count < maxGlitchFrames) {
        setDisplayChar(GLITCH_SYMBOLS[Math.floor(Math.random() * GLITCH_SYMBOLS.length)]);
        timerRef.current = window.setTimeout(glitch, 35);
      } else {
        setDisplayChar(char);
        setIsGlitching(false);
        isGlitchingRef.current = false;
      }
    };

    glitch();
  }, [char]);

  // Handle auto-glitch trigger wave (staggered across letters)
  useEffect(() => {
    if (!glitchTrigger) return;
    const staggerTimer = window.setTimeout(() => {
      triggerGlitch();
    }, index * 40);

    return () => clearTimeout(staggerTimer);
  }, [glitchTrigger, index, triggerGlitch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.span
      variants={charVariant}
      onMouseEnter={triggerGlitch}
      className={`inline-block cursor-pointer select-none transition-transform duration-150 ${isGradient ? "text-gradient" : "text-foreground"
        } ${isGlitching ? "scale-125 text-primary drop-shadow-[0_0_14px_rgba(139,128,223,0.9)]" : "hover:scale-110"
        }`}
    >
      {displayChar}
    </motion.span>
  );
}
