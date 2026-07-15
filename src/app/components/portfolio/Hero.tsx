import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Download, MapPin, Briefcase, Calendar } from "lucide-react";
import type { SectionId } from "./sections";
import { ErrorBoundary } from "./ErrorBoundary";

const Hero3D = lazy(() => import("./Hero3D").then((m) => ({ default: m.Hero3D })));

/* ─── Fallback when 3D fails to load ─── */
function EmblemFallback() {
  return (
    <div className="grid h-[26rem] place-items-center">
      <div className="font-display text-7xl text-gradient" style={{ fontWeight: 700 }}>
        ✎ {">"}
      </div>
    </div>
  );
}

/* ─── Static data ─── */
const NAME_LINES = ["Muuhamed", "Hany"];
const HERO_ROLES = ["Frontend Developer", "UI/UX Designer", "Full Stack Developer"];

const HERO_STATS = [
  { icon: Calendar, label: "Since", value: "2022" },
  { icon: MapPin, label: "Based in", value: "Egypt" },
];

/* ─── Motion variants ─── */
const nameContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.5 } },
};

const nameLineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const charVariant = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeUpVariant = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const statsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 1.35 } },
};

const statItemVariant = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Typewriter hook ─── */
function useTypewriter(words: string[]) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const currentWord = words[wordIndex];
    let delay = 72;
    if (phase === "holding") delay = 1150;
    if (phase === "deleting") delay = 42;
    if (phase === "deleting" && visibleCount === 0) delay = 220;

    const timeout = window.setTimeout(() => {
      if (phase === "typing") {
        if (visibleCount < currentWord.length) {
          setVisibleCount((c) => c + 1);
        } else {
          setPhase("holding");
        }
        return;
      }
      if (phase === "holding") {
        setPhase("deleting");
        return;
      }
      if (visibleCount > 0) {
        setVisibleCount((c) => c - 1);
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [phase, prefersReducedMotion, visibleCount, wordIndex, words]);

  return useMemo(() => {
    if (prefersReducedMotion) {
      return { text: words.join(" / "), prefersReducedMotion };
    }
    return { text: words[wordIndex].slice(0, visibleCount), prefersReducedMotion };
  }, [prefersReducedMotion, visibleCount, wordIndex, words]);
}

/* ─── Role Ticker ─── */
function HeroRoleTicker() {
  const { text, prefersReducedMotion } = useTypewriter(HERO_ROLES);
  return (
    <span className="hero-role-ticker">
      <span className="sr-only">Frontend Developer, UI/UX, Full Stack</span>
      <span aria-hidden="true" className="hero-role-wrap text-foreground">
        {text || "\u00a0"}
        {!prefersReducedMotion && (
          <span className="about-type-caret" aria-hidden="true" />
        )}
      </span>
    </span>
  );
}

/* ─── Ambient radial glow background with mouse-reactive parallax ─── */
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
    <div
      aria-hidden="true"
      className="hero-ambient-glow pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Primary accent orb — bottom right */}
      <motion.div
        className="hero-ambient-orb hero-ambient-orb-primary"
        style={{ x: primaryX, y: primaryY }}
      />
      {/* Secondary softer orb — top left */}
      <motion.div
        className="hero-ambient-orb hero-ambient-orb-secondary"
        style={{ x: secondaryX, y: secondaryY }}
      />
    </div>
  );
}

/* ─── Double-bezel emblem frame ─── */
function EmblemFrame({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="hero-emblem-outer">
      <div className="hero-emblem-inner">
        <ErrorBoundary fallback={<EmblemFallback />}>
          <Suspense fallback={<EmblemFallback />}>
            <Hero3D theme={theme} />
          </Suspense>
        </ErrorBoundary>
      </div>
      {/* Corner accents */}
      <span className="hero-emblem-corner hero-emblem-corner-tl" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-tr" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-bl" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-br" aria-hidden="true" />
    </div>
  );
}

/* ─── Stat badge ─── */
function StatBadge({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <motion.div variants={statItemVariant} className="hero-stat-chip">
      <Icon className="hero-stat-icon" aria-hidden="true" />
      <span className="hero-stat-label">{label}</span>
      <span className="hero-stat-value">{value}</span>
    </motion.div>
  );
}

/* ─── Props ─── */
interface HeroProps {
  onNavigate: (id: SectionId) => void;
  theme: "dark" | "light";
}

/* ─── Main Component ─── */
export function Hero({ onNavigate, theme }: HeroProps) {
  return (
    <section className="scanlines relative grid h-svh place-items-center overflow-hidden pb-24 sm:pb-20">
      {/* Ambient depth layer */}
      <AmbientGlow />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">

        {/* ── Left column: text content ── */}
        <div>
          {/* Status chip — eyebrow */}
          <motion.div
            {...fadeUpVariant(0.3)}
            className="mb-6 font-mono"
          >
            <span className="pixel-status-chip text-[11px]">
              <span className="pixel-status-chip-label px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <span className="flex items-center gap-2 px-3 py-1 text-foreground">
                <span aria-hidden="true" className="hero-pulse-dot-wrap">
                  <span className="pixel-status-chip-marker h-2 w-2" />
                  <span className="hero-pulse-ring" />
                </span>
                Available for work
              </span>
            </span>
          </motion.div>

          {/* Name headline — letter-by-letter staggered reveal */}
          <motion.h1
            variants={nameContainer}
            initial="hidden"
            animate="show"
            className="font-display leading-[0.88] tracking-normal"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)", fontWeight: 700 }}
          >
            {NAME_LINES.map((line, i) => (
              <motion.span
                key={line}
                variants={nameLineContainer}
                className={`block overflow-hidden ${i === 0 ? "text-gradient-hover" : ""}`}
              >
                {line.split("").map((char, ci) => (
                  <motion.span
                    key={`${line}-${ci}`}
                    variants={charVariant}
                    className={`inline-block ${i === 0 ? "text-gradient" : ""}`}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.h1>

          {/* Role ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground sm:text-sm"
          >
            <HeroRoleTicker />
          </motion.div>

          {/* Bio */}
          <motion.p
            {...fadeUpVariant(1.05)}
            className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
          >
            I engineer high-end web interfaces — shaping raw pixels into fluid, interactive digital experiences.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            {...fadeUpVariant(1.2)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => onNavigate("projects")}
              className="hero-cta-primary group inline-flex items-center gap-2 border-2 border-foreground/10 bg-gradient-accent px-6 py-3 text-sm font-medium text-white pixel-btn"
            >
              View Projects
              <span className="hero-cta-arrow-wrap">
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </button>
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 border-2 border-border bg-card px-6 py-3 text-sm font-medium text-foreground pixel-btn hover:border-foreground/30 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </motion.div>

          {/* Stat badges row */}
          <motion.div
            variants={statsContainer}
            initial="hidden"
            animate="show"
            className="mt-7 flex flex-wrap gap-2"
          >
            {HERO_STATS.map((stat) => (
              <StatBadge key={stat.label} {...stat} />
            ))}
          </motion.div>
        </div>

        {/* ── Right column: 3D emblem in double-bezel frame ── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <EmblemFrame theme={theme} />

          {/* Caption below frame */}
          <div className="pointer-events-none mt-3 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>✎ design</span>
            <span className="text-[var(--accent-to)]">/</span>
            <span>{">"} code</span>
          </div>


        </motion.div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.button
        onClick={() => onNavigate("projects")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: "-50%", y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.6, duration: 0.5 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
        }}
        className="absolute left-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        style={{ bottom: "calc(5.75rem + env(safe-area-inset-bottom))" }}
      >
        Scroll Down ↘
      </motion.button>
    </section>
  );
}
