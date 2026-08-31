import type { IconType } from "react-icons";
import { Github, Instagram, Linkedin } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFigma,
} from "react-icons/si";

export interface CoreTech {
  id: string;
  name: string;
  category: "FRAMEWORK" | "LANGUAGE" | "STYLING" | "DESIGN";
  description: string;
  level: string;
  color: string;
  Icon: IconType;
}

export const CORE_TECH_STACK: CoreTech[] = [
  {
    id: "react",
    name: "React",
    category: "FRAMEWORK",
    description: "Component-driven architecture, custom hooks, and reactive state systems.",
    level: "Core Expert",
    color: "#61dafb",
    Icon: SiReact,
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "FRAMEWORK",
    description: "Server components, App Router, SSR/SSG, and fullstack API performance.",
    level: "Production Ready",
    color: "#ededed",
    Icon: SiNextdotjs,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "LANGUAGE",
    description: "Strict static typing, complex generic architectures, and rock-solid codebases.",
    level: "Type-Safe Daily",
    color: "#3178c6",
    Icon: SiTypescript,
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "LANGUAGE",
    description: "Modern ESNext, asynchronous runtime, DOM performance, and web standards.",
    level: "Foundation Deep",
    color: "#f7df1e",
    Icon: SiJavascript,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "STYLING",
    description: "Utility-first design systems, v4 architecture, fluid responsive layouts.",
    level: "Design System",
    color: "#38bdf8",
    Icon: SiTailwindcss,
  },
  {
    id: "figma",
    name: "Figma",
    category: "DESIGN",
    description: "UI/UX design, interactive prototyping, design tokens, and pixel craft.",
    level: "Pixel Craft",
    color: "#a259ff",
    Icon: SiFigma,
  },
];

export const SOCIALS = [
  { label: "GitHub", value: "muuhamedhany", href: "https://github.com/muuhamedhany", icon: Github },
  { label: "LinkedIn", value: "in/muuhammed-hany", href: "https://www.linkedin.com/in/muuhammed-hany", icon: Linkedin },
  { label: "Instagram", value: "@muuhamedhany", href: "https://www.instagram.com/muuhamedhany/", icon: Instagram },
];
