import React from "react";
import type { IconType } from "react-icons";
import { Github, Instagram, Linkedin } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiPrisma,
  SiFigma,
  SiGit,
  SiGithub,
  SiSupabase,
  SiVercel,
} from "react-icons/si";

export type TechCategory = "frontend" | "backend" | "tools";

export interface TechCategoryMeta {
  id: TechCategory;
  label: string;
}

export const TECH_CATEGORIES: TechCategoryMeta[] = [
  { id: "frontend", label: "FRONTEND" },
  { id: "backend", label: "BACKEND & DB" },
  { id: "tools", label: "TOOLS & CLOUD" },
];

export interface CoreTech {
  id: string;
  name: string;
  category: TechCategory;
  color: string;
  Icon: IconType | React.ComponentType<{ className?: string }>;
}

// Custom Neon Database SVG Icon via pure React.createElement (zero JSX parsing requirement in .ts)
function NeonIcon({ className }: { className?: string }) {
  return React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      "aria-hidden": true,
    },
    React.createElement("path", {
      d: "M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 2.311L19.535 8.5 12 12.689 4.465 8.5 12 4.311zM4 9.878l7 3.937v7.564l-7-3.85V9.878zm9 11.501v-7.564l7-3.937v7.651l-7 3.85z",
    })
  );
}

export const CORE_TECH_STACK: CoreTech[] = [
  // ─── FRONTEND ───
  {
    id: "react",
    name: "React",
    category: "frontend",
    color: "#61dafb",
    Icon: SiReact,
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    color: "var(--foreground)",
    Icon: SiNextdotjs,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    color: "#3178c6",
    Icon: SiTypescript,
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "frontend",
    color: "#f7df1e",
    Icon: SiJavascript,
  },
  {
    id: "tailwind",
    name: "Tailwind",
    category: "frontend",
    color: "#38bdf8",
    Icon: SiTailwindcss,
  },

  // ─── BACKEND & DB ───
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    color: "#5fa04e",
    Icon: SiNodedotjs,
  },
  {
    id: "express",
    name: "Express.js",
    category: "backend",
    color: "var(--foreground)",
    Icon: SiExpress,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    color: "#4169e1",
    Icon: SiPostgresql,
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "backend",
    color: "var(--foreground)",
    Icon: SiPrisma,
  },

  // ─── TOOLS & CLOUD ───
  {
    id: "figma",
    name: "Figma",
    category: "tools",
    color: "#a259ff",
    Icon: SiFigma,
  },
  {
    id: "git",
    name: "Git",
    category: "tools",
    color: "#f05032",
    Icon: SiGit,
  },
  {
    id: "github",
    name: "GitHub",
    category: "tools",
    color: "var(--foreground)",
    Icon: SiGithub,
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "tools",
    color: "#3ecf8e",
    Icon: SiSupabase,
  },
  {
    id: "neon",
    name: "Neon DB",
    category: "tools",
    color: "#00e599",
    Icon: NeonIcon,
  },
];

export const SOCIALS = [
  { label: "GitHub", value: "muuhamedhany", href: "https://github.com/muuhamedhany", icon: Github },
  { label: "LinkedIn", value: "in/muuhammed-hany", href: "https://www.linkedin.com/in/muuhammed-hany", icon: Linkedin },
  { label: "Instagram", value: "@muuhamedhany", href: "https://www.instagram.com/muuhamedhany/", icon: Instagram },
];
