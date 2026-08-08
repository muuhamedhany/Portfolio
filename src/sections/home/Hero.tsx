import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Download, Github } from "lucide-react";
import type { SectionId } from "@/lib/constants/sections";
import { GlitchChar } from "@/sections/home/GlitchChar";
import { GlitchTicker } from "@/sections/home/GlitchTicker";
import { HeroParticleCanvas } from "@/sections/home/HeroParticleCanvas";
import { EditorialMonogram } from "@/sections/home/EditorialMonogram";
import { HeroStatusCapsule } from "@/sections/home/HeroStatusCapsule";

/* ─── Motion variants ─── */
const nameContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.4 } },
};

const nameLineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/* ─── Ambient glow with mouse parallax ─── */
function AmbientGlow() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const primaryX = useTransform(mouseX, [0, 1], [-20, 20]);
  const primaryY = useTransform(mouseY, [0, 1], [-20, 20]);
  const secondaryX = useTransform(mouseX, [0, 1], [12, -12]);
  const secondaryY = useTransform(mouseY, [0, 1], [12, -12]);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div aria-hidden="true" className="hero-ambient-glow pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className="hero-ambient-orb hero-ambient-orb-primary" style={{ x: primaryX, y: primaryY }} />
      <motion.div className="hero-ambient-orb hero-ambient-orb-secondary" style={{ x: secondaryX, y: secondaryY }} />
    </div>
  );
}

/* ─── Background pixel particles ─── */
const BG_PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: (i * 379 + 47) % 97,
  y: (i * 211 + 83) % 91,
  size: (i % 2) + 1.5,
  dur: 8 + (i % 3) * 3,
  delay: (i * 0.7) % 4,
}));

function BackgroundParticles() {
  return (
    <div aria-hidden="true" className="hero-bg-particles pointer-events-none absolute inset-0 overflow-hidden">
      {BG_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="hero-bg-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Particle Bridge between Portrait and Typography ─── */
function ParticleBridge() {
  return (
    <div aria-hidden="true" className="hero-particle-bridge pointer-events-none absolute inset-0 overflow-hidden hidden lg:block z-10">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`pb-${i}`}
          className="absolute bg-primary/40"
          style={{
            width: `${(i % 3) + 2.5}px`,
            height: `${(i % 3) + 2.5}px`,
            right: `${15 + (i * 6) % 35}%`,
            top: `${18 + (i * 7) % 55}%`,
          }}
          animate={{
            x: [-15 - (i % 4) * 10, -75 - (i % 5) * 18],
            y: [0, (i % 2 === 0 ? -20 : 20)],
            opacity: [0, 0.65, 0.15, 0],
          }}
          transition={{
            duration: 4.2 + (i % 3) * 1.4,
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Props ─── */
interface HeroProps {
  onNavigate: (id: SectionId) => void;
  theme: "dark" | "light";
}

/* ─── Main Component ─── */
export function Hero({ onNavigate, theme: _theme }: HeroProps) {
  const [glitchTrigger, setGlitchTrigger] = useState(0);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 22 });

  // 3-Layer 3D Depth Parallax
  const line1X = useTransform(springX, [0, 1], [-6, 6]);
  const line1Y = useTransform(springY, [0, 1], [-6, 6]);
  const line2X = useTransform(springX, [0, 1], [10, -10]);
  const line2Y = useTransform(springY, [0, 1], [10, -10]);

  // Periodic name glitch trigger (every 15 to 20 seconds)
  useEffect(() => {
    let timeoutId: number;
    const scheduleNext = () => {
      const delay = 15000 + Math.floor(Math.random() * 5000);
      timeoutId = window.setTimeout(() => {
        setGlitchTrigger((prev) => prev + 1);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="scanlines relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-10 pb-28 sm:py-12 lg:py-0">
      <BackgroundParticles />
      <HeroParticleCanvas />
      <ParticleBridge />

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-10 lg:px-14 z-20">
        <div className="relative flex flex-col items-center text-center">

          {/* ── Editorial Headline & Main Details (Centered) ── */}
          <div className="z-20 flex flex-col items-center text-center pt-2 lg:pt-0 w-full max-w-4xl mx-auto">

            {/* Status capsule */}
            <HeroStatusCapsule onNavigate={onNavigate} />

            {/* Creative Luxury Editorial Name Composition with Monogram Watermark */}
            <div className="relative w-full my-1 sm:my-2">
              {/* Massive background watermark monogram 'MH' */}
              <EditorialMonogram mouseX={mouseX} mouseY={mouseY} />

              <motion.h1
                variants={nameContainer}
                initial="hidden"
                animate="show"
                className="relative z-10 font-display leading-[0.82] tracking-tight select-none text-center w-full"
              >
                {/* Line 1: MUHAMED (Purple gradient display, top interlocked layer) */}
                <motion.span
                  variants={nameLineContainer}
                  style={{ x: line1X, y: line1Y, fontSize: "clamp(5.5rem, 9.5vw, 9.6rem)" }}
                  className="block overflow-visible text-gradient-hover text-center relative z-10"
                >
                  {"Muuhamed".split("").map((char, ci) => (
                    <GlitchChar
                      key={`muh-${ci}`}
                      char={char}
                      isGradient={true}
                      index={ci}
                      glitchTrigger={glitchTrigger}
                    />
                  ))}
                </motion.span>

                {/* Line 2: HANY (Interlocking directly into MUHAMED baseline with negative top margin) */}
                <motion.span
                  variants={nameLineContainer}
                  style={{ x: line2X, y: line2Y, fontSize: "clamp(5rem, 9.5vw, 9.6rem)" }}
                  className="block overflow-visible -mt-7 sm:-mt-6 lg:-mt-12 xl:-mt-14 text-center relative z-20"
                >
                  {"Hany".split("").map((char, ci) => (
                    <GlitchChar
                      key={`hany-${ci}`}
                      char={char}
                      isGradient={false}
                      index={ci + 7}
                      glitchTrigger={glitchTrigger}
                    />
                  ))}
                </motion.span>
              </motion.h1>
            </div>

            {/* Sub-headline with Glitch Scramble Role Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.55 }}
              className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.25em] text-muted-foreground w-full px-2"
            >
              <GlitchTicker />
              <span className="hidden md:block text-muted-foreground/70">•</span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-2.5 h-3 opacity-60" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                  <rect x="2" y="0" width="6" height="6" fill="currentColor" />
                  <rect x="4" y="6" width="2" height="4" fill="currentColor" />
                </svg>
                Based in Egypt
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div {...fadeUp(1.2)} className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full max-w-xs sm:max-w-none mx-auto">
              <button
                onClick={() => onNavigate("projects")}
                className="pixel-cta-btn justify-center"
              >
                <span className="pixel-cta-btn-bg" />
                <span className="pixel-cta-btn-text">Explore Projects</span>
                <span className="pixel-cta-btn-circle">
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="w-3.5 h-3.5">
                    <path d="M5 13L13 5M13 5H6M13 5V12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="bevel" />
                  </svg>
                </span>
              </button>

              <div className="flex items-center justify-center gap-3">
                <a
                  href="/cv.pdf"
                  download
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 border-2 border-border bg-card px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-foreground pixel-btn hover:border-foreground/30 transition-colors duration-200"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download CV
                </a>

                <a
                  href="https://github.com/muuhamedhany"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="inline-flex items-center justify-center gap-2 border-2 border-border bg-card px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-foreground pixel-btn hover:border-foreground/30 hover:text-foreground transition-colors duration-200"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
