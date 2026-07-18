import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { AvatarSvg } from "./AvatarSvg";

interface AvatarIllustrationProps {
  theme: "dark" | "light";
}

const TECH_SYMBOLS = ["</>", "{}", "React", "Node", "SQL", "const", "API", "<>"];

function FloatingSymbol({ symbol, delay }: { symbol: string; delay: number }) {
  // Random coordinates surrounding the avatar portrait
  const [coords] = useState(() => {
    const isLeft = Math.random() < 0.35; // 35% on the left, 65% on the right/center
    return {
      left: isLeft ? 8 + Math.random() * 15 : 68 + Math.random() * 24, // Left side or right side
      top: 10 + Math.random() * 75,
      duration: 6 + Math.random() * 4, // Very slow (6s to 10s)
      driftY: -30 - Math.random() * 25, // Upward drift
    };
  });

  return (
    <motion.div
      className="absolute font-mono text-[9px] font-bold pointer-events-none select-none z-10"
      style={{
        left: `${coords.left}%`,
        top: `${coords.top}%`,
        color: "var(--floating-symbol-color)",
        opacity: 0.12, // 10-20% very low opacity
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: [0, 0.14, 0.14, 0],
        y: [15, coords.driftY],
      }}
      transition={{
        duration: coords.duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {symbol}
    </motion.div>
  );
}

function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
      {/* A few tiny floating pixel squares to prevent clutter */}
      <motion.div
        className="absolute w-2.5 h-2.5 bg-current opacity-30"
        style={{ left: "18%", top: "30%", color: "var(--decorations-color)" }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-2 h-2 bg-current opacity-20"
        style={{ right: "22%", top: "25%", color: "var(--decorations-color)" }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute w-2.5 h-2.5 bg-current opacity-25"
        style={{ right: "18%", bottom: "30%", color: "var(--decorations-color)" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}

export function AvatarIllustration({ theme }: AvatarIllustrationProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check user motion preferences and screen resizing
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Motion values for cursor parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 35, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 18 });

  const translateX = useTransform(springX, [0, 1], [-10, 10]);
  const translateY = useTransform(springY, [0, 1], [-10, 10]);
  const rotateY = useTransform(springX, [0, 1], [-5, 5]);
  const rotateX = useTransform(springY, [0, 1], [5, -5]);

  useEffect(() => {
    // Disable parallax if user prefers reduced motion or on touch devices
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse || isReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isReducedMotion, mouseX, mouseY]);

  // Floating, breathing, and rotation parameters (subtle as requested)
  const floatY = isReducedMotion ? [0, 0] : (isMobile ? [0, -3, 0] : [0, -6, 0]);
  const floatRotate = isReducedMotion ? [0, 0] : (isMobile ? [0, 0.3, 0] : [-0.8, 0.8, -0.8]);
  const breatheScale = isReducedMotion ? [1, 1] : (isMobile ? [1, 1.006, 1] : [1, 1.01, 1]);

  return (
    <div className="avatar-illustration-container" style={{ perspective: "1000px" }}>
      {/* Very Soft Blurred Radial Glow (Low opacity, no neon explosion) */}
      <motion.div 
        className="avatar-radial-glow absolute inset-0 pointer-events-none z-0"
        animate={isReducedMotion ? {} : {
          opacity: [0.75, 1.0, 0.75],
          scale: [0.97, 1.03, 0.97]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Decorative tiny grid squares */}
      <BackgroundDecorations />

      {/* Floating tech icons */}
      {!isReducedMotion && TECH_SYMBOLS.map((sym, i) => (
        <FloatingSymbol key={`${sym}-${i}`} symbol={sym} delay={i * 1.1} />
      ))}

      {/* SVG Image wrapper */}
      <motion.div
        className="avatar-svg-container relative w-full h-full flex items-center justify-center z-10"
        style={{
          x: isReducedMotion ? 0 : translateX,
          y: isReducedMotion ? 0 : translateY,
          rotateX: isReducedMotion ? 0 : rotateX,
          rotateY: isReducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{
            y: floatY,
            rotate: floatRotate,
            scale: breatheScale
          }}
          transition={{
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <AvatarSvg theme={theme} isReducedMotion={isReducedMotion} />
        </motion.div>
      </motion.div>
    </div>
  );
}
