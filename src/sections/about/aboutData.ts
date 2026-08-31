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
  index: string;
  name: string;
  shortName: string;
  color: string;
  Icon: IconType;
}

export const CORE_TECH_STACK: CoreTech[] = [
  {
    id: "react",
    index: "01",
    name: "React",
    shortName: "RC",
    color: "#61dafb",
    Icon: SiReact,
  },
  {
    id: "nextjs",
    index: "02",
    name: "Next.js",
    shortName: "NX",
    color: "#ededed",
    Icon: SiNextdotjs,
  },
  {
    id: "typescript",
    index: "03",
    name: "TypeScript",
    shortName: "TS",
    color: "#3178c6",
    Icon: SiTypescript,
  },
  {
    id: "javascript",
    index: "04",
    name: "JavaScript",
    shortName: "JS",
    color: "#f7df1e",
    Icon: SiJavascript,
  },
  {
    id: "tailwind",
    index: "05",
    name: "Tailwind",
    shortName: "TW",
    color: "#38bdf8",
    Icon: SiTailwindcss,
  },
  {
    id: "figma",
    index: "06",
    name: "Figma",
    shortName: "FG",
    color: "#a259ff",
    Icon: SiFigma,
  },
];

export const SOCIALS = [
  { label: "GitHub", value: "muuhamedhany", href: "https://github.com/muuhamedhany", icon: Github },
  { label: "LinkedIn", value: "in/muuhammed-hany", href: "https://www.linkedin.com/in/muuhammed-hany", icon: Linkedin },
  { label: "Instagram", value: "@muuhamedhany", href: "https://www.instagram.com/muuhamedhany/", icon: Instagram },
];
