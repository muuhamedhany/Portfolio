import { useEffect, useState, useRef } from "react";

const ROLES = [
  "FULL-STACK DEV",
  "FRONT-END FOCUSED",
];

const GLITCH_GLYPHS = "!@#$%^&*()_+-=[]{}|;:<>?/░▒▓█+=";

interface GlitchTickerProps {
  className?: string;
}

export function GlitchTicker({ className = "" }: GlitchTickerProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(ROLES[0]);
  const [isGlitching, setIsGlitching] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (roleIndex + 1) % ROLES.length;
      triggerScramble(ROLES[nextIndex], () => {
        setRoleIndex(nextIndex);
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [roleIndex]);

  const triggerScramble = (targetText: string, onComplete: () => void) => {
    setIsGlitching(true);
    let frame = 0;
    const totalFrames = 24; // ~400ms at 60fps

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * targetText.length);

      const scrambled = targetText
        .split("")
        .map((char, idx) => {
          if (char === " ") return " ";
          if (idx < revealCount) return char;
          return GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
        })
        .join("");

      setDisplayedText(scrambled);

      if (frame < totalFrames) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayedText(targetText);
        setIsGlitching(false);
        onComplete();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <span className={`inline-flex items-center font-mono ${className}`}>
      <span
        className={`text-xs md:text-lg transition-colors duration-150 ${isGlitching ? "text-primary font-bold tracking-[0.28em]" : "text-foreground/90 font-semibold"
          }`}
      >
        {displayedText}
      </span>
      {/* Pixel block cursor */}
      <span className="ml-1.5 inline-block w-2 h-3.5 bg-primary/80 animate-pulse" />
    </span>
  );
}
