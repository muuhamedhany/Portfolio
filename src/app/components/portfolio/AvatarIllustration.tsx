import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { AvatarSvg } from "./AvatarSvg";

interface AvatarIllustrationProps {
  theme: "dark" | "light";
}

const TECH_SYMBOLS = ["</>", "{}", "const", "React", "Node.js", "PostgreSQL", "TypeScript"];

function FloatingSymbol({ symbol, delay }: { symbol: string; delay: number }) {
  const [coords] = useState(() => ({
    left: 68 + Math.random() * 22,   // 68% to 90%
    top: 15 + Math.random() * 70,    // 15% to 85%
    duration: 4.5 + Math.random() * 3, // 4.5s to 7.5s
  }));

  return (
    <motion.div
      className="absolute font-mono text-[9px] font-bold pointer-events-none select-none z-10"
      style={{
        left: `${coords.left}%`,
        top: `${coords.top}%`,
        color: "var(--floating-symbol-color)",
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: [0, 0.18, 0.18, 0],
        y: [15, -45],
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
      {/* Tiny squares */}
      <motion.div
        className="absolute w-3 h-3 border border-current opacity-30"
        style={{ left: "15%", top: "25%", color: "var(--decorations-color)" }}
        animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-2 h-2 border border-current opacity-20"
        style={{ right: "20%", top: "15%", color: "var(--decorations-color)" }}
        animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Tiny crosses */}
      <motion.div
        className="absolute font-mono text-[10px] opacity-35"
        style={{ left: "22%", bottom: "22%", color: "var(--decorations-color)" }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        +
      </motion.div>
      <motion.div
        className="absolute font-mono text-[10px] opacity-25"
        style={{ right: "15%", bottom: "35%", color: "var(--decorations-color)" }}
        animate={{ y: [0, -8, 0], x: [0, -4, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        +
      </motion.div>
      
      {/* Small dots */}
      <motion.div
        className="absolute w-1 h-1 bg-current opacity-40"
        style={{ left: "45%", top: "12%", color: "var(--decorations-color)" }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 bg-current opacity-25"
        style={{ right: "35%", bottom: "15%", color: "var(--decorations-color)" }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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

  // Floating, breathing, and rotation parameters
  const floatY = isReducedMotion ? [0, 0] : (isMobile ? [0, -4, 0] : [0, -8, 0]);
  const floatRotate = isReducedMotion ? [0, 0] : (isMobile ? [0, 0.5, 0] : [-1, 1, -1]);
  const breatheScale = isReducedMotion ? [1, 1] : (isMobile ? [1, 1.008, 1] : [1, 1.015, 1]);

  return (
    <div className="avatar-illustration-container" style={{ perspective: "1000px" }}>
      {/* Blurred Radial Glow */}
      <motion.div 
        className="avatar-radial-glow absolute inset-0 pointer-events-none z-0"
        animate={isReducedMotion ? {} : {
          opacity: [0.8, 1.0, 0.8],
          scale: [0.96, 1.04, 0.96]
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Decorative futuristic UI grids */}
      <BackgroundDecorations />

      {/* Floating tech symbols */}
      {!isReducedMotion && TECH_SYMBOLS.map((sym, i) => (
        <FloatingSymbol key={sym} symbol={sym} delay={i * 0.9} />
      ))}

      {/* SVG Image with Tilt and Float wrapper */}
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
