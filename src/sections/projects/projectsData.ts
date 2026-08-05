import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {
  ArrowUpRight,
  Code2,
  Figma as FigmaIcon,
  Github,
  Globe,
  MapPin,
  Monitor,
  Palette,
  Rocket,
  Server,
  Smartphone,
} from "lucide-react";
import { SiExpress, SiFigma, SiFramer, SiNodedotjs, SiPostgresql, SiReact, SiSupabase, SiTailwindcss } from "react-icons/si";

/* ─── Types ─── */
export interface ProjectLink {
  label: string;
  href: string;
  icon: "live" | "github" | "behance";
}

export interface ProjectVideo {
  src: string;
  title: string;
  poster?: string;
  type?: string;
}

export interface ProjectStackGroup {
  label: string;
  icon: ProjectStackIcon;
  items: string[];
}

export type ProjectStackIcon = "mobile" | "web" | "portal" | "backend" | "deploy" | "frontend" | "design" | "publish";

export type ProjectCategory = "all" | "mobile & full-stack" | "web" | "design";

export interface Project {
  index: string;
  name: string;
  blurb: string;
  category: "mobile & full-stack" | "web" | "design";
  tags: string[];
  stackGroups: ProjectStackGroup[];
  links: ProjectLink[];
  previewImage?: {
    src: string;
    alt: string;
  };
  previewVideo?: ProjectVideo;
  featured?: boolean;
  note?: string;
}

/* ─── Static data ─── */
export const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "mobile & full-stack", label: "MOBILE & FULL-STACK" },
  { id: "web", label: "WEB" },
  { id: "design", label: "DESIGN" },
];

export const PROJECTS: Project[] = [
  {
    index: "01",
    name: "CarKit",
    category: "mobile & full-stack",
    blurb:
      "CarKit is a multi-platform automotive marketplace and service system for the Egyptian market. It combines a customer/vendor/provider mobile app, an admin operations dashboard, and a driver/emergency employee web portal. The platform handles product shopping, vehicle management, workshop and mobile-service bookings, vendor/provider approvals, delivery tracking with proof uploads, emergency SOS dispatch, reviews, ads, notifications, and branch/location management. It runs on a Render-hosted Express API with PostgreSQL and Supabase storage, with Expo for the mobile app and Vite React for the web portals.",
    tags: ["React Native Expo", "Render", "Supabase", "Express", "Node.js", "React", "PostgreSQL", "Gemini AI"],
    stackGroups: [
      {
        label: "Mobile App",
        icon: "mobile",
        items: ["Expo SDK 54", "React Native", "TypeScript", "Expo Router", "React Context", "AsyncStorage", "Axios", "Supabase JS"],
      },
      {
        label: "Admin Web & Driver/Emergency Portal",
        icon: "web",
        items: ["React 19", "Vite 7", "Tailwind CSS v4", "React Router 7", "Axios", "Lucide React"],
      },
      {
        label: "Backend",
        icon: "backend",
        items: ["Node.js", "Express 5", "PostgreSQL", "pg", "JWT authentication", "Supabase Storage", "Resend"],
      },
      {
        label: "Deployment & Services",
        icon: "deploy",
        items: ["Render for backend API", "Supabase for PostgreSQL and file storage", "Vercel for web portals", "Expo for mobile app"],
      },
    ],
    links: [
      { label: "App repo", href: "https://github.com/muuhamedhany/CarKitApp", icon: "github" },
      { label: "Admin Web repo", href: "https://github.com/muuhamedhany/CarKit-Admin-Web", icon: "github" },
      { label: "Driver Web repo", href: "https://github.com/muuhamedhany/CarKit-Driver-Web", icon: "github" }
    ],
    previewVideo: {
      src: "/projects/CarKitVid-optimized.mp4",
      title: "CarKit project demo",
      type: "video/mp4",
    },
    previewImage: {
      src: "/projects/CarKitIPhone.png",
      alt: "CarKit Preview"
    },
    featured: true,
  },
  {
    index: "02",
    name: "Car Rental Landing Page",
    category: "web",
    blurb: "A motion-rich rental landing page with scroll choreography and crisp section reveals.",
    tags: ["React", "Tailwind", "Framer Motion"],
    stackGroups: [
      {
        label: "Frontend",
        icon: "frontend",
        items: ["React", "Tailwind CSS", "Framer Motion"],
      },
      {
        label: "Deployment",
        icon: "deploy",
        items: ["Vercel"],
      },
    ],
    links: [
      { label: "Live", href: "https://carrenral.vercel.app", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/Car-Renral-REACT", icon: "github" }
    ],
    previewImage: {
      src: "/projects/CarRental.png",
      alt: "Car Rental Preview"
    }
  },
  {
    index: "03",
    name: "Pure Store",
    category: "web",
    blurb: "A React e-commerce app — product browsing, cart, and a clean storefront flow.",
    tags: ["React", "E-commerce"],
    stackGroups: [
      {
        label: "Frontend",
        icon: "frontend",
        items: ["React", "E-commerce storefront", "Cart flow", "Product browsing"],
      },
      {
        label: "Deployment",
        icon: "deploy",
        items: ["Vercel"],
      },
    ],
    links: [
      { label: "Live", href: "https://pure-store.vercel.app", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/E-Commerce-REACT", icon: "github" },
    ],
    previewImage: {
      src: "/projects/PureStore.png",
      alt: "PureStore Preview"
    }
  },
  {
    index: "04",
    name: "Workout & Diet App",
    category: "design",
    blurb: "A UI/UX case study — user research, flows, and a high-fidelity prototype in Figma. NTI graduation project.",
    tags: ["Figma", "User Research", "Prototyping"],
    stackGroups: [
      {
        label: "Design & Research",
        icon: "design",
        items: ["Figma", "User Research", "User flows", "High-fidelity prototyping"],
      },
      {
        label: "Publishing",
        icon: "publish",
        items: ["Behance case study"],
      },
    ],
    links: [{ label: "Behance", href: "https://www.behance.net/gallery/234873613/UIUX-Workout-Diet-App", icon: "behance" }],
    previewImage: {
      src: "/projects/ShapeUp.png",
      alt: "ShapeUp Preview"
    }
  },
  {
    index: "05",
    name: "VitalityAI",
    category: "web",
    blurb:
      "VitalityAI is an AI-powered wellness platform that generates personalized plans and workouts. I contributed as a frontend developer, focusing on responsive UI implementation, animation polish, interaction enhancements, and refining the landing-page experience.",
    tags: ["Frontend UI", "Animations", "Responsive Design"],
    stackGroups: [
      {
        label: "Frontend",
        icon: "frontend",
        items: ["Frontend UI implementation", "Responsive landing page", "Animation polish", "Interaction enhancements"],
      },
    ],
    links: [{ label: "Live", href: "https://ai-wellness-tracker-mocha.vercel.app/", icon: "live" }],
    previewImage: {
      src: "/projects/VitalityAI.png",
      alt: "VitalityAI landing page preview"
    }
  },
];

/* ─── Icon maps ─── */
export const LINK_ICON = { live: Globe, github: Github, behance: FigmaIcon } as const;

export const STACK_GROUP_ICON: Record<ProjectStackIcon, LucideIcon> = {
  mobile: Smartphone,
  web: Monitor,
  portal: MapPin,
  backend: Server,
  deploy: Rocket,
  frontend: Code2,
  design: Palette,
  publish: Globe,
};

export const TAG_ICON: Record<string, IconType> = {
  "React Native": SiReact,
  "React Native Expo": SiReact,
  React: SiReact,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  PostgreSQL: SiPostgresql,
  Supabase: SiSupabase,
  Tailwind: SiTailwindcss,
  "Tailwind CSS v4": SiTailwindcss,
  "Framer Motion": SiFramer,
  Figma: SiFigma,
  "Frontend UI": SiReact,
  "Animations": SiFramer,
  "Responsive Design": SiTailwindcss,
};
