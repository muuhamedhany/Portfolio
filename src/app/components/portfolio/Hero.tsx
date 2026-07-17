import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Download, Github } from "lucide-react";
import {
  SiReact,
  SiNodedotjs,
  SiPostgresql,
} from "react-icons/si";
import type { SectionId } from "./sections";

/* ─── Static data ─── */
const NAME_LINES = ["Muhamed", "Hany"];

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
      <motion.div
        className="hero-ambient-orb hero-ambient-orb-primary"
        style={{ x: primaryX, y: primaryY }}
      />
      <motion.div
        className="hero-ambient-orb hero-ambient-orb-secondary"
        style={{ x: secondaryX, y: secondaryY }}
      />
    </div>
  );
}

/* ─── Tech row item ─── */
interface TechItemProps {
  label: string;
  color: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

function TechItem({ label, color, Icon }: TechItemProps) {
  return (
    <span
      className="hero-tech-item group"
      style={{ "--tech-color": color } as React.CSSProperties}
      title={label}
    >
      <Icon className="hero-tech-icon" aria-hidden="true" />
      <span className="hero-tech-label">{label}</span>
    </span>
  );
}

/* ─── React Native SVG icon (slightly modified React icon) ─── */
function ReactNativeIcon({ className }: { className?: string }) {
  return <SiReact className={className} aria-hidden />;
}

/* ─── Tech Row ─── */
function TechRow() {
  const stack: TechItemProps[] = [
    { label: "React", color: "#61dafb", Icon: SiReact },
    { label: "React Native", color: "#61dafb", Icon: ReactNativeIcon },
    { label: "Node.js", color: "#5fa04e", Icon: SiNodedotjs },
    { label: "PostgreSQL", color: "#4169e1", Icon: SiPostgresql },
  ];

  return (
    <motion.div
      {...fadeUpVariant(1.15)}
      className="hero-tech-row mt-5"
      aria-label="Primary technologies"
    >
      {stack.map((item) => (
        <TechItem key={item.label} {...item} />
      ))}
    </motion.div>
  );
}

/* ─── Bottom Metadata Row ─── */
function MetaRow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.45, duration: 0.6 }}
      className="hero-meta-row mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
      aria-label="Quick facts"
    >
      <span>4+ Production Projects</span>
      <span className="hero-meta-sep" aria-hidden="true">•</span>
      <span>Based in Egypt</span>
      <span className="hero-meta-sep" aria-hidden="true">•</span>
      <span>Remote Friendly</span>
    </motion.div>
  );
}

/* ─── Workspace Illustration ─── */
function WorkspaceIllustration({ theme }: { theme: "dark" | "light" }) {
  const dark = theme === "dark";

  // Color tokens that match the portfolio palette
  const colors = {
    desk: dark ? "#1a172a" : "#e8e4f4",
    deskEdge: dark ? "#12101e" : "#d4cfe8",
    deskTop: dark ? "#221e38" : "#eeebf8",
    laptop: dark ? "#2b2642" : "#d8d4ee",
    laptopLight: dark ? "#38325a" : "#e4e0f4",
    screen: dark ? "#09080d" : "#f0eefa",
    screenBorder: dark ? "#4a4566" : "#b8b2d8",
    editorBg: dark ? "#0d0b18" : "#fafafa",
    editorGutter: dark ? "#16131f" : "#f0eefa",
    lineActive: dark ? "#7064cb22" : "#7064cb14",
    syntaxPurple: dark ? "#978ce5" : "#6558c7",
    syntaxBlue: dark ? "#61d4fb" : "#0070c6",
    syntaxGreen: dark ? "#5fbe8e" : "#22863a",
    syntaxGray: dark ? "#6b6480" : "#8a82a0",
    syntaxOrange: dark ? "#e5a366" : "#c07530",
    cursor: dark ? "#978ce5" : "#6558c7",
    mug: dark ? "#4a3870" : "#7064cb",
    mugHighlight: dark ? "#6458a8" : "#8b80df",
    mugSteam: dark ? "#7064cb44" : "#6558c744",
    plant: dark ? "#3a7a50" : "#2d6540",
    plantStem: dark ? "#2a5a3a" : "#1f4a2c",
    plantPot: dark ? "#8a6240" : "#a07050",
    glowColor: dark ? "#7064cb" : "#6558c7",
    codeIconColor: dark ? "#978ce5" : "#6558c7",
    particle: dark ? "#7064cb" : "#5146a8",
    ambient: dark ? "rgba(112,100,203,0.18)" : "rgba(101,88,199,0.10)",
  };

  return (
    <div className="hero-workspace" aria-hidden="true">
      {/* Ambient glow behind the laptop */}
      <div
        className="hero-ws-glow"
        style={{ background: `radial-gradient(ellipse at 50% 60%, ${colors.ambient} 0%, transparent 72%)` }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="hero-ws-particle"
          style={{
            left: `${10 + i * 14}%`,
            top: `${8 + (i % 3) * 14}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3.5 + i * 0.6}s`,
            background: colors.particle,
          }}
        />
      ))}

      {/* Floating code icon */}
      <div className="hero-ws-code-icon" style={{ color: colors.codeIconColor }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M7 6L2 11L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M15 6L20 11L15 16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M13 3L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" opacity="0.6" />
        </svg>
      </div>

      {/* SVG Workspace Scene */}
      <svg
        viewBox="0 0 340 270"
        className="hero-ws-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ─── Desk surface ─── */}
        {/* Desk top face (isometric-ish, flat pixel) */}
        <rect x="20" y="192" width="300" height="14" fill={colors.deskTop} />
        <rect x="20" y="206" width="300" height="30" fill={colors.desk} />
        <rect x="20" y="192" width="300" height="2" fill={colors.deskEdge} />

        {/* Desk legs */}
        <rect x="36" y="236" width="8" height="28" fill={colors.deskEdge} />
        <rect x="296" y="236" width="8" height="28" fill={colors.deskEdge} />

        {/* ─── Coffee Mug ─── */}
        {/* Steam lines */}
        <path
          d="M274 148 Q276 140 274 132"
          stroke={colors.mugSteam}
          strokeWidth="2"
          fill="none"
          strokeLinecap="square"
          className="hero-ws-steam hero-ws-steam-1"
        />
        <path
          d="M280 150 Q282 141 280 132"
          stroke={colors.mugSteam}
          strokeWidth="2"
          fill="none"
          strokeLinecap="square"
          className="hero-ws-steam hero-ws-steam-2"
        />
        {/* Mug body */}
        <rect x="264" y="154" width="28" height="32" fill={colors.mug} />
        <rect x="264" y="154" width="28" height="3" fill={colors.mugHighlight} />
        <rect x="264" y="182" width="28" height="4" fill={colors.mugHighlight} />
        {/* Mug handle */}
        <rect x="292" y="162" width="6" height="3" fill={colors.mugHighlight} />
        <rect x="292" y="171" width="6" height="3" fill={colors.mugHighlight} />
        <rect x="296" y="162" width="3" height="12" fill={colors.mugHighlight} />
        {/* Mug base */}
        <rect x="262" y="186" width="32" height="6" fill={colors.deskEdge} />

        {/* ─── Plant ─── */}
        {/* Pot */}
        <rect x="36" y="170" width="28" height="22" fill={colors.plantPot} />
        <rect x="34" y="168" width="32" height="4" fill={colors.plantPot} />
        {/* Dirt */}
        <rect x="38" y="170" width="24" height="6" fill={colors.deskEdge} />
        {/* Stem */}
        <rect x="49" y="140" width="3" height="30" fill={colors.plantStem} />
        {/* Leaves */}
        <rect x="36" y="144" width="14" height="10" fill={colors.plant} />
        <rect x="50" y="138" width="14" height="10" fill={colors.plant} />
        <rect x="38" y="134" width="12" height="8" fill={colors.plant} />
        {/* Plant base */}
        <rect x="34" y="190" width="34" height="4" fill={colors.deskEdge} />

        {/* ─── Laptop body ─── */}
        {/* Keyboard base */}
        <rect x="76" y="184" width="190" height="10" fill={colors.laptopLight} />
        <rect x="78" y="194" width="186" height="3" fill={colors.laptop} />
        {/* Keyboard keys (pixel dots) */}
        {[...Array(9)].map((_, col) =>
          [0, 1, 2].map((row) => (
            <rect
              key={`key-${col}-${row}`}
              x={92 + col * 18}
              y={186 + row * 3}
              width="12"
              height="2"
              fill={colors.screenBorder}
              opacity="0.5"
            />
          ))
        )}
        {/* Trackpad */}
        <rect x="148" y="187" width="48" height="5" fill={colors.screenBorder} opacity="0.3" rx="0" />

        {/* Screen hinge */}
        <rect x="78" y="180" width="186" height="6" fill={colors.laptop} />

        {/* Screen outer bezel */}
        <rect x="74" y="30" width="194" height="152" fill={colors.laptop} />
        {/* Screen inner (display area) */}
        <rect x="80" y="36" width="182" height="142" fill={colors.editorBg} />

        {/* Monitor glow effect */}
        <rect
          x="80" y="36" width="182" height="142"
          fill={`url(#monitorGlow)`}
          className="hero-ws-monitor-glow"
        />

        {/* ─── VS Code Editor ─── */}
        {/* Title bar */}
        <rect x="80" y="36" width="182" height="14" fill={dark ? "#1a1830" : "#e8e4f4"} />
        {/* Traffic lights */}
        <rect x="86" y="42" width="5" height="5" fill="#ff5f57" />
        <rect x="94" y="42" width="5" height="5" fill="#febc2e" />
        <rect x="102" y="42" width="5" height="5" fill="#28c840" />
        {/* Tab */}
        <rect x="116" y="36" width="60" height="14" fill={dark ? "#0d0b18" : "#fafafa"} />
        <text x="119" y="47" fontSize="7" fill={colors.syntaxGray} fontFamily="monospace">Portfolio.tsx</text>

        {/* Gutter */}
        <rect x="80" y="50" width="22" height="128" fill={colors.editorGutter} />

        {/* Active line highlight */}
        <rect x="80" y="80" width="182" height="8" fill={colors.lineActive} className="hero-ws-active-line" />

        {/* Code content - scrolling group */}
        <g className="hero-ws-code-scroll">
          {/* Line 1 */}
          <text x="84" y="62" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">1</text>
          <text x="106" y="62" fontSize="6.5" fill={colors.syntaxPurple} fontFamily="monospace">const</text>
          <text x="130" y="62" fontSize="6.5" fill={colors.syntaxBlue} fontFamily="monospace">stack</text>
          <text x="152" y="62" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">= [</text>

          {/* Line 2 */}
          <text x="84" y="71" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">2</text>
          <text x="112" y="71" fontSize="6.5" fill={colors.syntaxGreen} fontFamily="monospace">"React"</text>
          <text x="146" y="71" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">,</text>

          {/* Line 3 */}
          <text x="84" y="80" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">3</text>
          <text x="112" y="80" fontSize="6.5" fill={colors.syntaxGreen} fontFamily="monospace">"Node.js"</text>
          <text x="154" y="80" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">,</text>

          {/* Line 4 */}
          <text x="84" y="89" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">4</text>
          <text x="112" y="89" fontSize="6.5" fill={colors.syntaxGreen} fontFamily="monospace">"PostgreSQL"</text>
          <text x="172" y="89" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">,</text>

          {/* Line 5 */}
          <text x="84" y="98" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">5</text>
          <text x="106" y="98" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">];</text>

          {/* Line 6 - blank */}
          <text x="84" y="107" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">6</text>

          {/* Line 7 */}
          <text x="84" y="116" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">7</text>
          <text x="106" y="116" fontSize="6.5" fill={colors.syntaxPurple} fontFamily="monospace">export</text>
          <text x="132" y="116" fontSize="6.5" fill={colors.syntaxPurple} fontFamily="monospace">default</text>
          <text x="162" y="116" fontSize="6.5" fill={colors.syntaxPurple} fontFamily="monospace">function</text>

          {/* Line 8 */}
          <text x="84" y="125" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">8</text>
          <text x="106" y="125" fontSize="6.5" fill={colors.syntaxOrange} fontFamily="monospace">Portfolio</text>
          <text x="155" y="125" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">() {"{"}</text>

          {/* Line 9 */}
          <text x="84" y="134" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">9</text>
          <text x="112" y="134" fontSize="6.5" fill={colors.syntaxPurple} fontFamily="monospace">return</text>

          {/* Line 10 */}
          <text x="80" y="143" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">10</text>
          <text x="112" y="143" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">{"<"}</text>
          <text x="118" y="143" fontSize="6.5" fill={colors.syntaxBlue} fontFamily="monospace">Hero</text>
          <text x="136" y="143" fontSize="6.5" fill={colors.syntaxPurple} fontFamily="monospace">stack</text>
          <text x="158" y="143" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">={"{"}stack{"}"}</text>
          <text x="186" y="143" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">{"/>"}</text>

          {/* Line 11 */}
          <text x="80" y="152" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">11</text>
          <text x="106" y="152" fontSize="6.5" fill={colors.syntaxGray} fontFamily="monospace">{"}"}</text>

          {/* Blinking cursor */}
          <rect
            x="111"
            y="127"
            width="1.5"
            height="8"
            fill={colors.cursor}
            className="hero-ws-cursor"
          />
        </g>

        {/* Status bar */}
        <rect x="80" y="170" width="182" height="8" fill={dark ? "#1a1830" : "#d8d4ee"} />
        <text x="86" y="176" fontSize="5" fill={colors.syntaxGray} fontFamily="monospace">TypeScript  ●  Portfolio</text>

        {/* Defs for monitor glow gradient */}
        <defs>
          <radialGradient id="monitorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glowColor} stopOpacity="0.06" />
            <stop offset="100%" stopColor={colors.glowColor} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Double-bezel emblem frame (reused as-is) ─── */
function EmblemFrame({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="hero-emblem-outer">
      <div className="hero-emblem-inner">
        <WorkspaceIllustration theme={theme} />
      </div>
      {/* Corner accents */}
      <span className="hero-emblem-corner hero-emblem-corner-tl" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-tr" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-bl" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-br" aria-hidden="true" />
    </div>
  );
}

/* ─── Animated caption arrow ─── */
function CaptionArrow() {
  return (
    <div className="hero-caption-arrow pointer-events-none">
      <span className="hero-caption-word">IDEA</span>
      <span className="hero-caption-line" aria-hidden="true">
        {"--------"}
      </span>
      <span className="hero-caption-arrow-char">→</span>
      <span className="hero-caption-word">PRODUCT</span>
    </div>
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

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">

        {/* ── Left column: text content ── */}
        <div>
          {/* Status chip — eyebrow */}
          <motion.div
            {...fadeUpVariant(0.3)}
            className="mb-5 font-mono"
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
                Available for Work
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

          {/* Role — static, clean */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground sm:text-sm"
          >
            Full-Stack Developer
          </motion.div>

          {/* Bio */}
          <motion.p
            {...fadeUpVariant(1.05)}
            className="mt-5 max-w-md text-pretty text-sm leading-7 text-muted-foreground sm:text-base"
          >
            I build modern web and mobile applications using React, React Native,
            Node.js and PostgreSQL—turning product ideas into production-ready
            software with clean architecture and thoughtful user experience.
          </motion.p>

          {/* Tech Row */}
          <TechRow />

          {/* CTA buttons */}
          <motion.div
            {...fadeUpVariant(1.25)}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => onNavigate("projects")}
              className="hero-cta-primary group inline-flex items-center gap-2 border-2 border-foreground/10 bg-gradient-accent px-6 py-3 text-sm font-medium text-white pixel-btn"
            >
              View Projects →
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

            <a
              href="https://github.com/muuhamedhany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center justify-center border-2 border-border bg-card p-3 text-muted-foreground pixel-btn hover:border-foreground/30 hover:text-foreground transition-colors duration-200"
            >
              <Github className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Bottom Metadata */}
          <MetaRow />
        </div>

        {/* ── Right column: pixel workspace illustration ── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <EmblemFrame theme={theme} />

          {/* Caption below frame */}
          <div className="pointer-events-none mt-3 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <CaptionArrow />
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
