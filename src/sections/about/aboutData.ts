import type { IconType } from "react-icons";
import { Github, Instagram, Linkedin } from "lucide-react";
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

export type TechName =
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

export const TECH_STACK: TechName[] = [
  "JavaScript",
  "React",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "MySQL",
  "Supabase",
  "Git",
  "Github",
  "Figma",
];

export const TECH_ICONS: Record<TechName, { Icon: IconType; color: string }> = {
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

export const SOCIALS = [
  { label: "Instagram", value: "@muuhamedhany", href: "https://www.instagram.com/muuhamedhany/", icon: Instagram },
  { label: "LinkedIn", value: "in/muuhammed-hany", href: "https://www.linkedin.com/in/muuhammed-hany", icon: Linkedin },
  { label: "GitHub", value: "muuhamedhany", href: "https://github.com/muuhamedhany", icon: Github },
];

export const HERO_ROLES = ["Frontend developer", "UI/UX designer"];
