import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import type { SectionId } from "./sections";
import { ErrorBoundary } from "./ErrorBoundary";

const Hero3D = lazy(() => import("./Hero3D").then((m) => ({ default: m.Hero3D })));

function EmblemFallback() {
  return (
    <div className="grid h-[26rem] place-items-center">
      <div className="font-display text-7xl text-gradient" style={{ fontWeight: 700 }}>
        ✎ {">"}
      </div>
    </div>
  );
}

const NAME_LINES = ["Muuhamed", "Hany"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
};
const lineVariant = {
  hidden: { opacity: 0, y: "70%" },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

interface HeroProps {
  onNavigate: (id: SectionId) => void;
  theme: "dark" | "light";
}

export function Hero({ onNavigate, theme }: HeroProps) {
  return (
    <section className="scanlines relative grid h-svh place-items-center overflow-hidden pb-24 sm:pb-20">
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 font-mono"
          >
            <span className="pixel-status-chip text-[11px]">
              <span className="pixel-status-chip-label px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <span className="flex items-center gap-2 px-3 py-1 text-foreground">
                <span aria-hidden="true" className="pixel-status-chip-marker h-2 w-2" />
                Available for work
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="font-display leading-[0.9] tracking-normal"
            style={{ fontSize: "clamp(2.75rem, 9vw, 6.5rem)", fontWeight: 700 }}
          >
            {NAME_LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span variants={lineVariant} className={`block ${i === 0 ? "text-gradient" : ""}`}>
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground sm:text-sm"
          >
            <span className="text-foreground">Frontend Developer</span>
            <span className="text-[var(--accent-to)]">·</span>
            <span>Full Stack</span>
            <span className="text-[var(--accent-to)]">·</span>
            <span>UI/UX</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mt-6 max-w-md text-pretty text-base text-muted-foreground sm:text-lg"
          >
            I build things for the web and mobile — from wireframe to deployment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => onNavigate("projects")}
              className="group inline-flex items-center gap-2 border-2 border-foreground/10 bg-gradient-accent px-6 py-3 text-sm font-medium text-white pixel-btn"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            {/* Drop the real CV at public/cv.pdf to make this download a live file. */}
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 border-2 border-border bg-card px-6 py-3 text-sm font-medium text-foreground pixel-btn"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </motion.div>
        </div>

        {/* Interactive 3D emblem — pen (UI/UX) + ">" (dev) */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="relative hidden lg:block"
        >
          <ErrorBoundary fallback={<EmblemFallback />}>
            <Suspense fallback={<EmblemFallback />}>
              <Hero3D theme={theme} />
            </Suspense>
          </ErrorBoundary>
          <div className="pointer-events-none mt-2 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>✎ design</span>
            <span className="text-[var(--accent-to)]">/</span>
            <span>{"> code"}</span>
          </div>
          <div className="pointer-events-none absolute -top-2 right-0 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            drag to spin
          </div>
        </motion.div>
      </div>

      {/* paging hint */}
      <motion.button
        onClick={() => onNavigate("projects")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: "-50%", y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute left-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
        style={{ bottom: "calc(5.75rem + env(safe-area-inset-bottom))" }}
      >
        enter ↗
      </motion.button>
    </section>
  );
}
