import type { IconType } from "react-icons";
import type { CSSProperties } from "react";
import {
  SiCss,
  SiExpress,
  SiFigma,
  SiFramer,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { Reveal } from "./Reveal";

type SkillName =
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "TypeScript"
  | "React"
  | "Tailwind"
  | "Node.js"
  | "Express.js"
  | "PostgreSQL"
  | "MySQL"
  | "Supabase"
  | "Git"
  | "Figma"
  | "Framer Motion";

const GROUPS: Array<{ label: string; items: SkillName[] }> = [
  { label: "Front-End", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind"] },
  { label: "Back-End", items: ["Node.js", "Express.js"] },
  { label: "Database", items: ["PostgreSQL", "MySQL", "Supabase"] },
  { label: "Tools", items: ["Git", "Figma", "Framer Motion"] },
];

const SKILL_ICONS: Record<SkillName, { Icon: IconType; color: string }> = {
  HTML: { Icon: SiHtml5, color: "#e34f26" },
  CSS: { Icon: SiCss, color: "#bb8cff" },
  JavaScript: { Icon: SiJavascript, color: "#f7df1e" },
  TypeScript: { Icon: SiTypescript, color: "#3178c6" },
  React: { Icon: SiReact, color: "#61dafb" },
  Tailwind: { Icon: SiTailwindcss, color: "#06b6d4" },
  "Node.js": { Icon: SiNodedotjs, color: "#5fa04e" },
  "Express.js": { Icon: SiExpress, color: "#f2f2f2" },
  PostgreSQL: { Icon: SiPostgresql, color: "#4169e1" },
  MySQL: { Icon: SiMysql, color: "#4479a1" },
  Supabase: { Icon: SiSupabase, color: "#3ecf8e" },
  Git: { Icon: SiGit, color: "#f05032" },
  Figma: { Icon: SiFigma, color: "#bb8cff" },
  "Framer Motion": { Icon: SiFramer, color: "#f2f2f2" },
};

const TICKER = GROUPS.flatMap((g) => g.items).map((name) => ({ name, ...SKILL_ICONS[name] }));

function Marquee() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="skills-marquee relative overflow-hidden border-y border-border py-4" aria-label="Technology slideshow">
      <div className="skills-marquee-track">
        {row.map(({ name, Icon, color }, i) => (
          <span
            key={`${name}-${i}`}
            className="skill-icon-chip"
            style={{ "--skill-color": color } as CSSProperties}
            tabIndex={0}
            role="img"
            aria-label={name}
          >
            <Icon className="skill-icon-glyph" aria-hidden="true" />
            <span className="skill-icon-label" aria-hidden="true">
              {name}
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export function Skills() {
  return (
    <section className="relative">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pb-28 pt-24 sm:px-8 sm:pb-24">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 600 }}>
              Skills
            </h2>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">02 / Stack</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Marquee />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.08}>
              <div className="group h-full rounded-none border-2 border-border bg-card p-5 pixel-shadow-sm transition-colors hover:border-[var(--accent-to)]">
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="text-[var(--accent-to)]">{String(gi + 1).padStart(2, "0")}</span>
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-none border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground/90 transition-colors group-hover:border-border"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
