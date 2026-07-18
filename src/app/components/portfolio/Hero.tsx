import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { Download, Github } from "lucide-react";
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
const BG_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 379 + 47) % 97,
  y: (i * 211 + 83) % 91,
  size: (i % 3) + 1,
  dur: 6 + (i % 5) * 2.4,
  delay: (i * 0.55) % 5,
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

/* ─── Status badge — pixel-framed, green dot ─── */
function StatusBadge() {
  return (
    <motion.div {...fadeUp(0.3)} className="mb-6">
      <span className="hero-status-badge pixel-status-chip text-[10px]">
        {/* Green availability dot */}
        <span className="flex items-center gap-2 px-3 py-1.5 font-mono uppercase tracking-[0.18em] text-foreground">
          <span className="hero-status-dot-wrap" aria-hidden="true">
            <span className="hero-status-dot" />
            <span className="hero-status-dot-ring" />
          </span>
          Available for Work
        </span>
      </span>
    </motion.div>
  );
}

/* ─── Tech row ─── */
interface TechItemProps {
  label: string;
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function TechItem({ label, color, Icon }: TechItemProps) {
  return (
    <span
      className="hero-tech-item"
      style={{ "--tech-color": color } as React.CSSProperties}
    >
      <Icon className="hero-tech-icon" aria-hidden />
      <span className="hero-tech-label">{label}</span>
    </span>
  );
}

function ReactNativeIcon({ className }: { className?: string }) {
  return <SiReact className={className} aria-hidden />;
}

function TechRow() {
  const stack: TechItemProps[] = [
    { label: "React", color: "#61dafb", Icon: SiReact },
    { label: "React Native", color: "#61dafb", Icon: ReactNativeIcon },
    { label: "Node.js", color: "#5fa04e", Icon: SiNodedotjs },
    { label: "PostgreSQL", color: "#4169e1", Icon: SiPostgresql },
  ];
  return (
    <motion.div {...fadeUp(1.1)} className="hero-tech-row mt-6" aria-label="Primary technologies">
      {stack.map((item) => <TechItem key={item.label} {...item} />)}
    </motion.div>
  );
}

/* ─── Metadata row with pixel icons ─── */
function MetaRow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="hero-meta-row mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
      aria-label="Quick facts"
    >
      {/* Folder icon */}
      <span className="hero-meta-item">
        <svg className="hero-meta-icon" viewBox="0 0 12 10" fill="none" aria-hidden="true">
          <rect x="0" y="2" width="12" height="8" fill="currentColor" opacity="0.5" />
          <rect x="0" y="0" width="5" height="3" fill="currentColor" opacity="0.5" />
        </svg>
        <strong className="hero-meta-bold">4+</strong>{" "}Projects
      </span>

      <span className="hero-meta-sep" aria-hidden="true">•</span>

      {/* Location pin */}
      <span className="hero-meta-item">
        <svg className="hero-meta-icon" viewBox="0 0 10 12" fill="none" aria-hidden="true">
          <rect x="2" y="0" width="6" height="6" fill="currentColor" opacity="0.5" />
          <rect x="4" y="6" width="2" height="4" fill="currentColor" opacity="0.5" />
          <rect x="3" y="1" width="4" height="4" fill="currentColor" opacity="0.3" />
        </svg>
        Egypt
      </span>

      <span className="hero-meta-sep" aria-hidden="true">•</span>

      {/* Globe icon */}
      <span className="hero-meta-item">
        <svg className="hero-meta-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <rect x="5" y="1" width="2" height="10" fill="currentColor" opacity="0.3" />
          <rect x="1" y="5" width="10" height="2" fill="currentColor" opacity="0.3" />
        </svg>
        <strong className="hero-meta-bold">Remote</strong>{" "}Friendly
      </span>
    </motion.div>
  );
}

/* ─── Workspace illustration ─── */
function WorkspaceIllustration({ theme }: { theme: "dark" | "light" }) {
  const dk = theme === "dark";

  const c = {
    /* desk */
    deskTop: dk ? "#211d35" : "#edeaf8",
    deskFace: dk ? "#191626" : "#e3dff5",
    deskEdge: dk ? "#110f1e" : "#cec9e8",

    /* monitor stand */
    stand: dk ? "#2e2a47" : "#d4cfed",
    standShadow: dk ? "#1a1730" : "#c4bfe2",

    /* monitor bezel */
    bezel: dk ? "#2a2642" : "#d8d4ee",
    bezelLight: dk ? "#35305a" : "#e0ddf4",

    /* screen */
    screenBg: dk ? "#0a0914" : "#fafaf8",
    titleBar: dk ? "#18162a" : "#e8e4f8",
    gutter: dk ? "#14121f" : "#eeebf9",
    lineHL: dk ? "#7064cb1a" : "#7064cb12",

    /* syntax */
    sxPurple: dk ? "#978ce5" : "#6558c7",
    sxBlue: dk ? "#61d4fb" : "#0070c6",
    sxGreen: dk ? "#5fbe8e" : "#22863a",
    sxGray: dk ? "#615b78" : "#8a82a0",
    sxOrange: dk ? "#e5a366" : "#c07530",
    sxString: dk ? "#97c97a" : "#1a7f37",
    cursor: dk ? "#978ce5" : "#6558c7",

    /* keyboard */
    kbd: dk ? "#252240" : "#d0ccec",
    kbdKey: dk ? "#1e1c38" : "#c4c0e4",

    /* mug */
    mug: dk ? "#4a3870" : "#7064cb",
    mugHL: dk ? "#6050a8" : "#9188df",
    mugSteam: dk ? "#7064cb55" : "#6558c733",

    /* plant */
    pot: dk ? "#8a6240" : "#a07050",
    potRim: dk ? "#9a7250" : "#b08060",
    soil: dk ? "#2a1e14" : "#3a2814",
    stem: dk ? "#2a5a3a" : "#1f4a2c",
    leaf1: dk ? "#3a7a50" : "#2d6540",
    leaf2: dk ? "#4a9060" : "#3d7550",

    /* glow / particles */
    glow: dk ? "#7064cb" : "#6558c7",
    ambient: dk ? "rgba(112,100,203,0.22)" : "rgba(101,88,199,0.12)",
    particle: dk ? "#7064cb" : "#5146a8",
    codeIcon: dk ? "#978ce5" : "#6558c7",

    /* status bar */
    statusBar: dk ? "#181630" : "#d8d4f0",
  };

  return (
    <div className="hero-workspace" aria-hidden="true">
      {/* Ambient glow */}
      <div
        className="hero-ws-glow"
        style={{ background: `radial-gradient(ellipse at 52% 50%, ${c.ambient} 0%, transparent 68%)` }}
      />

      {/* Floating particles around monitor */}
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="hero-ws-particle"
          style={{
            left: `${8 + i * 13}%`,
            top: `${6 + (i % 4) * 12}%`,
            animationDelay: `${i * 0.65}s`,
            animationDuration: `${3.2 + i * 0.55}s`,
            background: c.particle,
          }}
        />
      ))}

      {/* Floating code icon — upper right of monitor */}
      <div className="hero-ws-code-icon" style={{ color: c.codeIcon }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M5 4L1 9L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M13 4L17 9L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M11 1.5L7 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" opacity="0.5" />
        </svg>
      </div>

      {/* ── SVG scene ── */}
      <svg viewBox="0 0 360 290" className="hero-ws-svg" xmlns="http://www.w3.org/2000/svg">

        {/* Desk */}
        <rect x="10" y="206" width="340" height="12" fill={c.deskTop} />
        <rect x="10" y="218" width="340" height="26" fill={c.deskFace} />
        <rect x="10" y="206" width="340" height="2" fill={c.deskEdge} />
        <rect x="30" y="244" width="10" height="32" fill={c.deskEdge} />
        <rect x="320" y="244" width="10" height="32" fill={c.deskEdge} />

        {/* Coffee Mug */}
        <path d="M296 158 Q298 149 296 140" stroke={c.mugSteam} strokeWidth="2.5" fill="none" strokeLinecap="square" className="hero-ws-steam hero-ws-steam-1" />
        <path d="M303 160 Q305 150 303 140" stroke={c.mugSteam} strokeWidth="2.5" fill="none" strokeLinecap="square" className="hero-ws-steam hero-ws-steam-2" />
        <path d="M310 156 Q312 147 310 138" stroke={c.mugSteam} strokeWidth="2" fill="none" strokeLinecap="square" className="hero-ws-steam hero-ws-steam-3" />
        <rect x="300" y="164" width="32" height="36" fill={c.mug} />
        <rect x="300" y="164" width="32" height="4" fill={c.mugHL} />
        <rect x="300" y="196" width="32" height="4" fill={c.mugHL} />
        <rect x="297" y="172" width="8" height="3" fill={c.mugHL} />
        <rect x="297" y="182" width="8" height="3" fill={c.mugHL} />
        <rect x="294" y="172" width="4" height="13" fill={c.mugHL} />
        <rect x="297" y="200" width="38" height="6" fill={c.deskEdge} />


        {/* Monitor bezel */}
        <rect x="68" y="22" width="224" height="178" fill={c.bezel} />
        <rect x="68" y="22" width="224" height="3" fill={c.bezelLight} />

        {/* Screen */}
        <rect x="76" y="30" width="208" height="162" fill={c.screenBg} />

        {/* Monitor glow overlay */}
        <rect x="76" y="30" width="208" height="162" fill="url(#monGlow)" className="hero-ws-monitor-glow" />

        {/* VS Code title bar */}
        <rect x="76" y="30" width="208" height="10" fill={c.titleBar} />
        {/* Traffic lights */}
        <rect x="83" y="34" width="3" height="3" fill="#ff5f57" />
        <rect x="90" y="34" width="3" height="3" fill="#febc2e" />
        <rect x="97" y="34" width="3" height="3" fill="#28c840" />
        {/* Active tab */}
        <rect x="112" y="30" width="72" height="10" fill={c.screenBg} />
        <text x="116" y="38" fontSize="7.5" fill={c.sxGray} fontFamily="monospace">muu.ts</text>

        {/* Gutter */}
        <rect x="76" y="46" width="24" height="146" fill={c.gutter} />

        {/* Active line highlight — on the "stack" key line */}
        <rect x="76" y="98" width="208" height="9" fill={c.lineHL} className="hero-ws-active-line" />

        {/* ── Code: full developer object ── */}
        <g clipPath="url(#editorClip)">

          {/* 1: const developer = { */}
          <text x="80" y="57" fontSize="7" fill={c.sxGray} fontFamily="monospace">1</text>
          <text x="104" y="57" fontSize="7" fill={c.sxPurple} fontFamily="monospace">const</text>
          <text x="132" y="57" fontSize="7" fill={c.sxBlue} fontFamily="monospace">developer</text>
          <text x="171" y="57" fontSize="7" fill={c.sxGray} fontFamily="monospace">{"= {"}</text>

          {/* 2:   name: "Muhamed Hany", */}
          <text x="80" y="67" fontSize="7" fill={c.sxGray} fontFamily="monospace">2</text>
          <text x="110" y="67" fontSize="7" fill={c.sxBlue} fontFamily="monospace">name</text>
          <text x="134" y="67" fontSize="7" fill={c.sxGray} fontFamily="monospace">:</text>
          <text x="141" y="67" fontSize="7" fill={c.sxString} fontFamily="monospace">"Muhamed Hany"</text>
          <text x="197" y="67" fontSize="7" fill={c.sxGray} fontFamily="monospace">,</text>

          {/* 3:   role: "Full-Stack Engineer", */}
          <text x="80" y="77" fontSize="7" fill={c.sxGray} fontFamily="monospace">3</text>
          <text x="110" y="77" fontSize="7" fill={c.sxBlue} fontFamily="monospace">role</text>
          <text x="134" y="77" fontSize="7" fill={c.sxGray} fontFamily="monospace">:</text>
          <text x="141" y="77" fontSize="7" fill={c.sxString} fontFamily="monospace">"Full-Stack Dev"</text>
          <text x="205" y="77" fontSize="7" fill={c.sxGray} fontFamily="monospace">,</text>

          {/* 4: (blank) */}
          <text x="80" y="87" fontSize="7" fill={c.sxGray} fontFamily="monospace">4</text>

          {/* 5:   stack: [ */}
          <text x="80" y="97" fontSize="7" fill={c.sxGray} fontFamily="monospace">5</text>
          <text x="110" y="97" fontSize="7" fill={c.sxBlue} fontFamily="monospace">stack</text>
          <text x="134" y="97" fontSize="7" fill={c.sxGray} fontFamily="monospace">: [</text>
          {/* cursor on this line */}
          <rect x="119" y="140" width="1.2" height="9" fill={c.cursor} className="hero-ws-cursor" />

          {/* 6:     "React", */}
          <text x="80" y="107" fontSize="7" fill={c.sxGray} fontFamily="monospace">6</text>
          <text x="120" y="107" fontSize="7" fill={c.sxString} fontFamily="monospace">"React"</text>
          <text x="150" y="107" fontSize="7" fill={c.sxGray} fontFamily="monospace">,</text>

          {/* 7:     "React Native", */}
          <text x="80" y="117" fontSize="7" fill={c.sxGray} fontFamily="monospace">7</text>
          <text x="120" y="117" fontSize="7" fill={c.sxString} fontFamily="monospace">"React Native"</text>
          <text x="176" y="117" fontSize="7" fill={c.sxGray} fontFamily="monospace">,</text>

          {/* 8:     "Node.js", */}
          <text x="80" y="127" fontSize="7" fill={c.sxGray} fontFamily="monospace">8</text>
          <text x="120" y="127" fontSize="7" fill={c.sxString} fontFamily="monospace">"Node.js"</text>
          <text x="158" y="127" fontSize="7" fill={c.sxGray} fontFamily="monospace">,</text>

          {/* 9:     "PostgreSQL", */}
          <text x="80" y="137" fontSize="7" fill={c.sxGray} fontFamily="monospace">9</text>
          <text x="120" y="137" fontSize="7" fill={c.sxString} fontFamily="monospace">"PostgreSQL"</text>
          <text x="170" y="137" fontSize="7" fill={c.sxGray} fontFamily="monospace">,</text>

          {/* 10:   ], */}
          <text x="80" y="147" fontSize="7" fill={c.sxGray} fontFamily="monospace">10</text>
          <text x="110" y="147" fontSize="7" fill={c.sxGray} fontFamily="monospace">],</text>

          {/* 11: (blank) */}
          <text x="80" y="157" fontSize="7" fill={c.sxGray} fontFamily="monospace">11</text>

        </g>

        {/* Status bar */}
        <rect x="76" y="184" width="208" height="8" fill={c.statusBar} />
        <text x="83" y="190" fontSize="5.5" fill={c.sxGray} fontFamily="monospace">TypeScript  ●  muu.ts  ●  Ln 10</text>

        {/* Keyboard */}
        <rect x="76" y="198" width="208" height="10" fill={c.kbd} />
        {[0, 1, 2].map((row) =>
          Array.from({ length: 11 }, (_, col) => (
            <rect
              key={`k-${row}-${col}`}
              x={80 + col * 18}
              y={200 + row * 3}
              width="14"
              height="2"
              fill={c.kbdKey}
              opacity="0.7"
            />
          ))
        )}
        <rect x="158" y="200" width="44" height="6" fill={c.kbdKey} opacity="0.4" />

        {/* Defs */}
        <defs>
          <radialGradient id="monGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={c.glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
          </radialGradient>
          <clipPath id="editorClip">
            <rect x="76" y="46" width="208" height="138" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Double-bezel emblem frame ─── */
function EmblemFrame({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="hero-emblem-outer hero-emblem-outer--xl">
      <div className="hero-emblem-inner">
        <WorkspaceIllustration theme={theme} />
      </div>
      <span className="hero-emblem-corner hero-emblem-corner-tl" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-tr" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-bl" aria-hidden="true" />
      <span className="hero-emblem-corner hero-emblem-corner-br" aria-hidden="true" />
    </div>
  );
}

/* ─── Caption ─── */
function CaptionArrow() {
  return (
    <div className="hero-caption-arrow pointer-events-none">

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
      <AmbientGlow />
      <BackgroundParticles />

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-[1.45fr_1fr] lg:items-center">

        {/* ── Left column ── */}
        <div className="pl-1 sm:pl-2">

          {/* Status */}
          <StatusBadge />

          {/* Name */}
          <motion.h1
            variants={nameContainer}
            initial="hidden"
            animate="show"
            className="font-display leading-[0.88] tracking-normal"
            style={{ fontSize: "clamp(2.9rem, 8.5vw, 6.8rem)", fontWeight: 700 }}
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

          {/* Role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.55 }}
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            Full-Stack Engineer
          </motion.div>

          {/* Description — two paragraphs, tighter readable width */}
          <motion.div {...fadeUp(1.0)} className="mt-5 max-w-[38ch] space-y-3">
            <p className="text-sm leading-[1.85] text-muted-foreground">
              I build modern web and mobile applications with React,
              React&nbsp;Native, Node.js and PostgreSQL.
            </p>
            <p className="text-sm leading-[1.85] text-muted-foreground">
              From product ideas to production-ready software, I focus on
              clean architecture, performance and thoughtful user experience.
            </p>
          </motion.div>

          {/* Tech Row */}
          <TechRow />

          {/* CTA buttons — unified height via py-3, GitHub wider via px-6 */}
          <motion.div {...fadeUp(1.2)} className="mt-7 flex flex-wrap items-center gap-3">
            {/* Primary */}
            <button
              onClick={() => onNavigate("projects")}
              className="hero-cta-primary group inline-flex items-center gap-2 border-2 border-foreground/10 bg-gradient-accent px-5 py-3 text-sm font-medium text-white pixel-btn"
            >
              Explore Projects
              <span className="hero-cta-arrow-wrap">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </span>
            </button>

            {/* Secondary */}
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 border-2 border-border bg-card px-5 py-3 text-sm font-medium text-foreground pixel-btn hover:border-foreground/30 transition-colors duration-200"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download CV
            </a>

            {/* GitHub — wider padding */}
            <a
              href="https://github.com/muuhamedhany"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-border bg-card px-6 py-3 text-sm font-medium text-foreground pixel-btn hover:border-foreground/30 hover:text-foreground transition-colors duration-200"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </a>
          </motion.div>

          {/* Metadata */}
          <MetaRow />
        </div>

        {/* ── Right column ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <EmblemFrame theme={theme} />

          {/* Caption */}
          <div className="pointer-events-none mt-4 flex items-center justify-center">
            <CaptionArrow />
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
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
