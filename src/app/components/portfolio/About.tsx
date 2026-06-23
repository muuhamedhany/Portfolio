import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { ArrowUpRight, Github, Instagram, Linkedin } from "lucide-react";
import {
  SiCss,
  SiExpress,
  SiFigma,
  SiFramer,
  SiGit,
  SiGithub,
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

type TechName =
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "TypeScript"
  | "React"
  | "Tailwind"
  | "Node.js"
  | "Express.js"
  | "PHP"
  | "PostgreSQL"
  | "MySQL"
  | "Supabase"
  | "Git"
  | "Github"
  | "Figma"
  | "Framer Motion";

const TECH_STACK: TechName[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Tailwind",
  "Node.js",
  "Express.js",
  "PHP",
  "PostgreSQL",
  "MySQL",
  "Supabase",
  "Git",
  "Github",
  "Figma",
  "Framer Motion",
];

const TECH_ICONS: Record<TechName, { Icon: IconType; color: string }> = {
  HTML: { Icon: SiHtml5, color: "#e34f26" },
  CSS: { Icon: SiCss, color: "#bb8cff" },
  JavaScript: { Icon: SiJavascript, color: "#f7df1e" },
  TypeScript: { Icon: SiTypescript, color: "#3178c6" },
  React: { Icon: SiReact, color: "#61dafb" },
  Tailwind: { Icon: SiTailwindcss, color: "#06b6d4" },
  "Node.js": { Icon: SiNodedotjs, color: "#5fa04e" },
  "Express.js": { Icon: SiExpress, color: "#f2f2f2" },
  PHP: { Icon: SiPhp, color: "#777bb4" },
  PostgreSQL: { Icon: SiPostgresql, color: "#4169e1" },
  MySQL: { Icon: SiMysql, color: "#4479a1" },
  Supabase: { Icon: SiSupabase, color: "#3ecf8e" },
  Git: { Icon: SiGit, color: "#f05032" },
  Github: { Icon: SiGithub, color: "black" },
  Figma: { Icon: SiFigma, color: "#bb8cff" },
  "Framer Motion": { Icon: SiFramer, color: "#f2f2f2" },
};

const SOCIALS = [
  { label: "Instagram", value: "@muuhamedhany", href: "https://www.instagram.com/muuhamedhany/", icon: Instagram },
  { label: "LinkedIn", value: "in/mohamed-hany-helmy", href: "https://linkedin.com/in/mohamed-hany-helmy", icon: Linkedin },
  { label: "GitHub", value: "muuhamedhany", href: "https://github.com/muuhamedhany", icon: Github },
];

function TechStack() {
  const row = [...TECH_STACK, ...TECH_STACK];

  return (
    <aside aria-labelledby="about-tech-heading" className="about-tech-stack order-2 lg:order-1">
      <h3 id="about-tech-heading" className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Tech Stack
      </h3>
      <div className="about-tech-marquee mt-5" aria-label="Technology slideshow">
        <div className="about-tech-marquee-track">
          {row.map((tech, i) => {
            const { Icon, color } = TECH_ICONS[tech];
            const isDuplicate = i >= TECH_STACK.length;

            return (
              <span
                key={`${tech}-${i}`}
                className="about-tech-chip"
                style={{ "--skill-color": color } as CSSProperties}
                tabIndex={isDuplicate ? -1 : 0}
                role={isDuplicate ? undefined : "img"}
                aria-hidden={isDuplicate ? "true" : undefined}
                aria-label={isDuplicate ? undefined : tech}
              >
                <Icon className="about-tech-glyph" aria-hidden="true" />
                <span className="about-tech-label" aria-hidden="true">
                  {tech}
                </span>
              </span>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>
    </aside>
  );
}

export function About() {
  return (
    <section className="relative">
      <div className="mx-auto grid min-h-svh max-w-6xl content-center gap-10 px-5 pb-28 pt-24 sm:px-8 sm:pb-24 lg:grid-cols-[minmax(190px,260px)_1fr] lg:gap-16">
        <TechStack />

        <div className="order-1 min-w-0 lg:order-2">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 600 }}>
                About
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">02 / About</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="max-w-3xl text-balance font-display leading-[0.95] tracking-normal" style={{ fontSize: "clamp(2.3rem, 7vw, 5rem)", fontWeight: 700 }}>
              Frontend developer and <span className="text-gradient">UI/UX designer</span> based in Egypt.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              I graduated from AASTMT with a Bachelor's in Information Systems and spent the last few years building full-stack web and mobile applications. Before code, I spent years doing digital illustration - that design instinct still drives how I build interfaces today. I care about the details most developers skip. Currently open to new opportunities.
            </p>
          </Reveal>

          <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
            {SOCIALS.map((social, i) => {
              const Icon = social.icon;
              return (
                <Reveal key={social.label} delay={0.18 + i * 0.05}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <Icon className="h-5 w-5 flex-none text-muted-foreground transition-colors group-hover:text-[var(--accent-to)]" aria-hidden="true" />
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{social.label}</span>
                      <span className="truncate text-base text-foreground transition-colors group-hover:text-gradient sm:text-lg">
                        {social.value}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 flex-none text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-to)]" aria-hidden="true" />
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
