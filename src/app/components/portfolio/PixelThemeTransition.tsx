import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@iconify/react";
import moonIcon from "@iconify-icons/pixelarticons/moon";
import sunIcon from "@iconify-icons/pixelarticons/sun";

interface PixelThemeTransitionProps {
  targetTheme: "dark" | "light";
  clickPos: { x: number; y: number } | null;
  onThemeSwap: () => void;
  onComplete: () => void;
}

const COLS = 12;
const ROWS = 8;
const TOTAL_BLOCKS = COLS * ROWS;

export function PixelThemeTransition({
  targetTheme,
  clickPos,
  onThemeSwap,
  onComplete,
}: PixelThemeTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const swappedRef = useRef(false);
  const reducedMotion = useReducedMotion() ?? false;
  const [badgeVisible, setBadgeVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      // Reduced motion: simple fast fade & swap
      onThemeSwap();
      const timer = setTimeout(onComplete, 300);
      return () => clearTimeout(timer);
    }

    const container = containerRef.current;
    if (!container) return;

    const blocks = container.querySelectorAll<HTMLElement>(".pixel-transition-block");
    if (!blocks.length) return;

    // Calculate origin col/row from click position
    const rect = container.getBoundingClientRect();
    const clickX = clickPos ? clickPos.x : rect.width / 2;
    const clickY = clickPos ? clickPos.y : rect.height / 2;

    const cellW = rect.width / COLS;
    const cellH = rect.height / ROWS;

    const originCol = Math.min(COLS - 1, Math.max(0, Math.floor(clickX / cellW)));
    const originRow = Math.min(ROWS - 1, Math.max(0, Math.floor(clickY / cellH)));

    let maxDist = 0;
    const distances: number[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dist = Math.hypot(c - originCol, r - originRow);
        distances.push(dist);
        if (dist > maxDist) maxDist = dist;
      }
    }

    // Step 1: Pixel blocks grow & cover from origin click position
    setBadgeVisible(true);

    const inAnimation = animate(blocks, {
      scale: [0, 1.04],
      opacity: [0, 1],
      delay: (el: HTMLElement, index: number) => distances[index] * 28,
      duration: 220,
      easing: "easeOutQuad",
      onComplete: () => {
        if (!swappedRef.current) {
          swappedRef.current = true;
          onThemeSwap();
        }

        // Step 2: Pixel blocks dissolve out with retro pixel steps
        animate(blocks, {
          scale: [1.04, 0],
          opacity: [1, 0],
          delay: (el: HTMLElement, index: number) =>
            (maxDist - distances[index]) * 22 + 100,
          duration: 240,
          easing: "cubicBezier(0.4, 0, 0.2, 1)",
          onComplete: () => {
            onComplete();
          },
        });
      },
    });

    // Safety fallback timer if swap didn't trigger
    const swapTimer = setTimeout(() => {
      if (!swappedRef.current) {
        swappedRef.current = true;
        onThemeSwap();
      }
    }, 420);

    return () => {
      inAnimation.pause();
      clearTimeout(swapTimer);
    };
  }, [clickPos, onThemeSwap, onComplete, reducedMotion]);

  if (reducedMotion) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-auto overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 12x8 Pixel Block Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-0">
        {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
          <div
            key={i}
            className="pixel-transition-block bg-[var(--pixel-frame)] border border-[var(--border)] shadow-[inset_1px_1px_0_var(--pixel-edge-light)] opacity-0 transform-gpu"
            style={{ willChange: "transform, opacity" }}
          />
        ))}
      </div>

      {/* Retro Scanline & Grid Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] opacity-30" />
    </div>
  );
}
