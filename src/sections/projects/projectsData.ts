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
import {
  SiExpress,
  SiFigma,
  SiFramer,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVercel,
  SiRender,
  SiAxios,
  SiJsonwebtokens,
  SiExpo,
  SiThreedotjs,
  SiReactrouter,
  SiGsap,
} from "react-icons/si";

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
  items: ProjectStackItem[];
}

export interface ProjectStackItem {
  name: string;
  shortName?: string; // Shorter label for the chip
}

export type ProjectStackIcon = "mobile" | "web" | "portal" | "backend" | "deploy" | "frontend" | "design" | "publish";

export type ProjectCategory = "all" | "mobile & full-stack" | "web" | "design";

export interface ProjectGalleryImage {
  src: string;
  alt: string;
  title?: string;
}

export interface Project {
  index: string;
  name: string;
  blurb: string;
  shortBlurb: string; // Business-first 1-2 sentence summary
  category: "mobile & full-stack" | "web" | "design";
  tags: string[];
  stackGroups: ProjectStackGroup[];
  links: ProjectLink[];
  previewImage?: {
    src: string;
    alt: string;
  };
  galleryImages?: ProjectGalleryImage[];
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
    shortBlurb:
      "Full-scale automotive marketplace for Egypt — customer app, vendor dashboard, driver portal, and SOS dispatch in one platform.",
    blurb:
      "Full-scale automotive marketplace serving the Egyptian market. Customers browse and buy parts, book workshops, and track deliveries. Vendors manage inventory and orders. Drivers handle last-mile logistics. Emergency staff respond to SOS calls — all from one integrated backend.",
    tags: ["React Native Expo", "Express", "Node.js", "PostgreSQL", "Render", "Supabase"],
    stackGroups: [
      {
        label: "Mobile App",
        icon: "mobile",
        items: [
          { name: "Expo SDK", shortName: "Expo" },
          { name: "React Native", shortName: "RN" },
          { name: "TypeScript", shortName: "TS" },
        ],
      },
      {
        label: "Web Portals",
        icon: "web",
        items: [
          { name: "React", shortName: "React" },
          { name: "Tailwind CSS", shortName: "Tailwind" },
        ],
      },
      {
        label: "Backend",
        icon: "backend",
        items: [
          { name: "Node.js", shortName: "Node" },
          { name: "Express", shortName: "Express" },
          { name: "PostgreSQL", shortName: "Postgres" },
          { name: "JWT Auth", shortName: "JWT" },
          { name: "Supabase", shortName: "Supabase" },
        ],
      },
      {
        label: "Infrastructure",
        icon: "deploy",
        items: [
          { name: "Render", shortName: "Render" },
          { name: "Supabase", shortName: "Supabase" },
          { name: "Vercel", shortName: "Vercel" },
        ],
      },
    ],
    links: [
      { label: "App", href: "https://github.com/muuhamedhany/CarKitApp", icon: "github" },
      { label: "Admin", href: "https://github.com/muuhamedhany/CarKit-Admin-Web", icon: "github" },
      { label: "Driver", href: "https://github.com/muuhamedhany/CarKit-Driver-Web", icon: "github" }
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
    name: "Car Rental Platform",
    category: "web",
    shortBlurb:
      "Frontend React car rental platform optimized for vehicle reservation, rate estimation, and lead conversion.",
    blurb:
      "High-converting frontend car rental web platform engineered for instant booking and fleet exploration. Features an interactive vehicle reservation form, dynamic price calculator, vehicle specs comparison, GSAP scroll choreography, and seamless mobile responsiveness.",
    tags: ["Frontend", "React 19", "Tailwind CSS", "GSAP", "Framer Motion"],
    stackGroups: [
      {
        label: "Frontend Core",
        icon: "frontend",
        items: [
          { name: "React 19", shortName: "React" },
          { name: "Tailwind CSS", shortName: "Tailwind" },
          { name: "React Router", shortName: "Router" },
        ],
      },
      {
        label: "UI & Animations",
        icon: "web",
        items: [
          { name: "GSAP", shortName: "GSAP" },
          { name: "Framer Motion", shortName: "Motion" },
        ],
      },
      {
        label: "Deployment",
        icon: "deploy",
        items: [
          { name: "Vercel", shortName: "Vercel" },
        ],
      },
    ],
    links: [
      { label: "Live", href: "https://carrenral.vercel.app", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/Car-Renral-REACT", icon: "github" }
    ],
    previewImage: {
      src: "/projects/CarRental.png",
      alt: "Car Rental Preview"
    },
    galleryImages: [
      { src: "/projects/CarRental.png", alt: "Car Rental Landing Page", title: "Hero & Reservation" },
      { src: "/projects/CarRentalModels.png", alt: "Car Rental Vehicle Models", title: "Fleet & Rates" },
      { src: "/projects/CarRentalTeam.png", alt: "Car Rental Team Page", title: "Team Showcase" },
    ]
  },
  {
    index: "03",
    name: "Pure Store",
    category: "web",
    shortBlurb:
      "Responsive React e-commerce storefront optimized for product discovery, cart management, and seamless customer checkout.",
    blurb:
      "Modern frontend e-commerce storefront designed for speed and conversion. Delivers a frictionless shopping experience with instant product filtering, persistent cart & wishlist management, interactive product showcases, and secure user account flows.",
    tags: ["Frontend", "React 19", "Tailwind CSS v4", "React Router 7", "Framer Motion"],
    stackGroups: [
      {
        label: "Frontend Core",
        icon: "frontend",
        items: [
          { name: "React 19", shortName: "React" },
          { name: "Tailwind CSS", shortName: "Tailwind" },
          { name: "React Router 7", shortName: "Router" },
        ],
      },
      {
        label: "UI & Animations",
        icon: "web",
        items: [
          { name: "Framer Motion", shortName: "Motion" },
          { name: "React Icons", shortName: "Icons" },
        ],
      },
      {
        label: "Client State & Features",
        icon: "frontend",
        items: [
          { name: "Auth Context", shortName: "Auth" },
          { name: "Cart", shortName: "Cart" },
          { name: "Wishlist", shortName: "Wishlist" },
        ],
      },
      {
        label: "Deployment",
        icon: "deploy",
        items: [
          { name: "Vercel", shortName: "Vercel" },
        ],
      },
    ],
    links: [
      { label: "Live", href: "https://pure-store.vercel.app", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/E-Commerce-REACT", icon: "github" },
    ],
    previewImage: {
      src: "/projects/PureStore.png",
      alt: "PureStore Preview"
    },
    galleryImages: [
      { src: "/projects/PureStoreShop.png", alt: "Pure Store Shop Page", title: "Product Catalog & Filtering" },
      { src: "/projects/PureStoreDetails.png", alt: "Pure Store Product Details", title: "Product Details & Specs" },
      { src: "/projects/PureStoreCart.png", alt: "Pure Store Shopping Cart", title: "Shopping Cart & Checkout" },
    ]
  },
  {
    index: "04",
    name: "Workout & Diet App",
    category: "design",
    shortBlurb: "UI/UX case study — research-driven design, user flows, and a high-fidelity prototype. NTI graduation project.",
    blurb: "Research-driven UI/UX case study for a fitness app. Covers user research, journey mapping, interaction design, and a high-fidelity Figma prototype. Published as a full Behance case study.",
    tags: ["Figma", "User Research", "Prototyping"],
    stackGroups: [
      {
        label: "Design & Research",
        icon: "design",
        items: [
          { name: "Figma", shortName: "Figma" },
          { name: "User Research", shortName: "Research" },
          { name: "User flows", shortName: "Flows" },
          { name: "Prototyping", shortName: "Prototype" },
        ],
      },
      {
        label: "Publishing",
        icon: "publish",
        items: [
          { name: "Case study", shortName: "case study" },
        ],
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
    shortBlurb: "Frontend contribution to an AI wellness platform — responsive UI, animation polish, and landing page refinement.",
    blurb: "Frontend contribution to an AI-powered wellness platform. Delivered responsive UI implementation, animation polish, and interaction refinements that lifted the landing-page experience from prototype to production quality.",
    tags: ["Frontend UI", "Animations", "Responsive Design"],
    stackGroups: [
      {
        label: "Frontend",
        icon: "frontend",
        items: [
          { name: "Responsive UI", shortName: "Responsive" },
          { name: "Animation polish", shortName: "Animations" },
          { name: "Landing page", shortName: "Landing" },
        ],
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
  "React 19": SiReact,
  "Three.js": SiThreedotjs,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  PostgreSQL: SiPostgresql,
  Supabase: SiSupabase,
  Tailwind: SiTailwindcss,
  "Tailwind CSS v4": SiTailwindcss,
  "React Router 7": SiReactrouter,
  "Framer Motion": SiFramer,
  GSAP: SiGsap,
  Figma: SiFigma,
  "Frontend UI": SiReact,
  "Animations": SiFramer,
  "Responsive Design": SiTailwindcss,
};

/* ─── Stack item → icon lookup ─── */
export const STACK_ITEM_ICON: Record<string, IconType> = {
  // React ecosystem
  "React": SiReact,
  "React 19": SiReact,
  "React Native": SiReact,
  "React Native Expo": SiReact,
  "Expo SDK 54": SiExpo,
  "Expo": SiExpo,
  "Expo Router": SiExpo,
  "React Router 7": SiReactrouter,
  "React Router": SiReactrouter,
  // Animation / Motion
  "GSAP": SiGsap,
  // 3D & Graphics
  "Three.js": SiThreedotjs,
  "React Three Fiber": SiThreedotjs,
  "R3F": SiThreedotjs,
  "OGL WebGL": SiThreedotjs,
  // TypeScript
  "TypeScript": SiTypescript,
  // Node / Backend
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "Express 5": SiExpress,
  // Databases
  "PostgreSQL": SiPostgresql,
  "Supabase": SiSupabase,
  "Supabase JS": SiSupabase,
  "Supabase Storage": SiSupabase,
  // CSS / Styling
  "Tailwind CSS": SiTailwindcss,
  "Tailwind CSS v4": SiTailwindcss,
  "Framer Motion": SiFramer,
  // Build tools
  "Vite": SiVite,
  "Vite 7": SiVite,
  // Auth
  "JWT Auth": SiJsonwebtokens,
  "JWT authentication": SiJsonwebtokens,
  "Auth Context": SiJsonwebtokens,
  // HTTP
  "Axios": SiAxios,
  // Deployment
  "Vercel": SiVercel,
  "Render": SiRender,
  // Design
  "Figma": SiFigma,
};
