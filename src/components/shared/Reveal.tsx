import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useMemo } from "react";

interface PixelRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  gridCols?: number;
  gridRows?: number;
}

export function PixelReveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  gridCols = 8,
  gridRows = 5,
}: PixelRevealProps) {
  const reducedMotion = useReducedMotion() ?? false;

  const blockDelays = useMemo(() => {
    const delays: number[] = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        // Diagonal pixel wave with slight pseudo-random step
        const dist = (c + r) / (gridCols + gridRows);
        const jitter = (Math.sin(c * 12.9898 + r * 78.233) * 0.5 + 0.5) * 0.08;
        delays.push(dist * 0.2 + jitter);
      }
    }
    return delays;
  }, [gridCols, gridRows]);

  const baseDelay = 0.35 + delay;

  if (reducedMotion) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: baseDelay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: baseDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}

      {/* Pixel block dissolve mask overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 grid overflow-hidden rounded-sm"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: 0.01,
          delay: baseDelay + 0.42,
        }}
      >
        {blockDelays.map((blockDelay, idx) => (
          <motion.div
            key={idx}
            className="bg-[var(--card)] border border-[var(--border)]"
            initial={{ scale: 1.05, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              delay: baseDelay + blockDelay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Subtle pixel flash highlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 border border-[var(--accent-to)]/40 rounded-sm"
        initial={{ opacity: 0.8, scale: 1 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: baseDelay + 0.1,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}

interface RevealProps extends PixelRevealProps {
  variant?: "default" | "pixel";
}

/**
 * Mount-based entrance. Standard reveals can blur, but pixel variant entrance is 100% crisp without blur.
 */
export function Reveal({ children, delay = 0, y = 36, className, variant = "default", ...rest }: RevealProps) {
  if (variant === "pixel") {
    return (
      <PixelReveal delay={delay} y={y} className={className} {...rest}>
        {children}
      </PixelReveal>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.35 + delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
