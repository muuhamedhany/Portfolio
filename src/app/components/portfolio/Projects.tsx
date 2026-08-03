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
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import type { IconType } from "react-icons";
import { SiExpress, SiFigma, SiFramer, SiNodedotjs, SiPostgresql, SiReact, SiSupabase, SiTailwindcss } from "react-icons/si";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "./Reveal";

interface ProjectLink {
  label: string;
  href: string;
  icon: "live" | "github" | "behance";
}

interface ProjectVideo {
  src: string;
  title: string;
  poster?: string;
  type?: string;
}

interface ProjectStackGroup {
  label: string;
  icon: ProjectStackIcon;
  items: string[];
}

type ProjectStackIcon = "mobile" | "web" | "portal" | "backend" | "deploy" | "frontend" | "design" | "publish";

type ProjectCategory = "all" | "web" | "mobile & full-stack" | "design";

interface Project {
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

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "web", label: "WEB" },
  { id: "mobile & full-stack", label: "MOBILE & FULL-STACK" },
  { id: "design", label: "DESIGN" },
];

const PROJECTS: Project[] = [
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

const LINK_ICON = { live: Globe, github: Github, behance: FigmaIcon } as const;

const STACK_GROUP_ICON: Record<ProjectStackIcon, LucideIcon> = {
  mobile: Smartphone,
  web: Monitor,
  portal: MapPin,
  backend: Server,
  deploy: Rocket,
  frontend: Code2,
  design: Palette,
  publish: Globe,
};

const TAG_ICON: Record<string, IconType> = {
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

function ProjectPreview({ project }: { project: Project }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  if (project.previewImage) {
    return (
      <div className="project-card-media project-card-media-image aspect-[16/10] w-full overflow-hidden bg-background">
        {!imageLoaded && !imageFailed && (
          <div className="project-image-skeleton h-full w-full" aria-hidden="true">
            <span className="project-image-skeleton-mark" />
            <span className="project-image-skeleton-line project-image-skeleton-line-wide" />
            <span className="project-image-skeleton-line" />
            <span className="project-image-skeleton-label">Loading preview</span>
          </div>
        )}

        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-card px-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Preview unavailable
          </div>
        ) : (
          <img
            src={project.previewImage.src}
            alt={project.previewImage.alt}
            className={`h-full w-full object-cover transition-opacity duration-150 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
    );
  }

  const previewTags = project.tags
    .map((tag) => ({ tag, Icon: TAG_ICON[tag] }))
    .filter((item): item is { tag: string; Icon: IconType } => Boolean(item.Icon))
    .slice(0, 3);

  return (
    <div className="project-card-media aspect-[16/10] w-full flex items-center justify-center bg-background" aria-label={`${project.name} technology stack`}>
      <div className="relative h-16 w-24" aria-hidden="true">
        {previewTags.map((tag, index) => {
          const Icon = tag.Icon;
          return (
            <div
              key={tag.tag}
              className="project-tech-tile absolute flex h-12 w-12 items-center justify-center border-2 border-[var(--pixel-frame)] bg-card text-[var(--accent-to)]"
              title={tag.tag}
              style={{
                left: `${index * 24}px`,
                top: `${index * 8}px`,
                zIndex: previewTags.length - index,
              }}
            >
              <Icon className="h-5 w-5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const dialogContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const dialogItemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const tagContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const tagItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function ProjectDetailDialog({ project }: { project: Project }) {
  const [activeMediaTab, setActiveMediaTab] = useState<"video" | "image">(
    project.previewVideo ? "video" : "image"
  );

  const hasVideoAndImage = Boolean(project.previewVideo && project.previewImage);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="project-detail-overlay" />
      <Dialog.Content className="project-detail-content select-none">
        {/* Header Bar */}
        <div className="project-detail-header border-b-2 border-border/60 pb-3 mb-4 flex items-center justify-between">
          <div className="min-w-0">

            <Dialog.Title className="font-display text-2xl sm:text-3xl leading-none tracking-normal text-foreground">
              {project.name}
            </Dialog.Title>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="pixel-btn inline-flex h-9 w-9 items-center justify-center border-2 border-border bg-secondary text-secondary-foreground hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors duration-150 cursor-pointer"
              aria-label={`Close ${project.name} details`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </Dialog.Close>
        </div>

        <div className="project-detail-layout">
          {/* Left Media Stage Column */}
          <div className="project-detail-media-column flex flex-col gap-3">
            {/* Interactive Media Stage Switcher Tabs (if project has both video & image) */}
            {hasVideoAndImage && (
              <div className="flex items-center gap-2  bg-card p-1">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("video")}
                  className={`flex flex-1 justify-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all cursor-pointer ${activeMediaTab === "video"
                    ? "pixel-btn border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)] font-semibold"
                    : "border-2 border-border bg-background text-muted-foreground hover:border-[var(--pixel-frame)] hover:text-foreground"
                    }`}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("image")}
                  className={`flex flex-1 justify-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all cursor-pointer ${activeMediaTab === "image"
                    ? "pixel-btn border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)] font-semibold"
                    : "border-2 border-border bg-background text-muted-foreground hover:border-[var(--pixel-frame)] hover:text-foreground"
                    }`}
                >
                  Photos
                </button>
              </div>
            )}

            {/* Media Stage Active Frame */}
            <div className="overflow-hidden border-2 border-border bg-black shadow-[3px_3px_0_var(--pixel-shadow)]">
              {activeMediaTab === "video" && project.previewVideo ? (
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 border border-emerald-500/50 bg-emerald-950/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-400 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE DEMO
                  </div>
                  <video
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    poster={project.previewVideo.poster}
                    aria-label={project.previewVideo.title}
                  >
                    <source src={project.previewVideo.src} type={project.previewVideo.type ?? "video/mp4"} />
                    Your browser does not support the video player.
                  </video>
                </div>
              ) : (
                <div className=" w-full overflow-hidden">
                  <ProjectPreview project={project} />
                </div>
              )}
            </div>
          </div>

          {/* Right Info Pane Column */}
          <motion.div
            className="project-detail-info flex flex-col gap-4"
            variants={dialogContainerVariants}
            initial="hidden"
            animate="show"
          >


            {/* Full Project Description */}
            <motion.p variants={dialogItemVariants} className="project-detail-blurb text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <h4 className="project-detail-section-title font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Description
              </h4>
              {project.blurb}
            </motion.p>

            {/* Stack Groups Section (Doppelrand Pixel Cards) */}
            <motion.div variants={dialogItemVariants} className="project-detail-section">
              <h4 className="project-detail-section-title font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Tech Stack Architecture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.stackGroups.map((group) => {
                  const StackIcon = STACK_GROUP_ICON[group.icon];

                  return (
                    <motion.section
                      key={group.label}
                      variants={dialogItemVariants}
                      className="border-2 border-border/80 bg-card p-3 shadow-[inset_1px_1px_0_var(--pixel-edge-light)]"
                      aria-label={`${project.name} ${group.label} stack`}
                    >
                      <h5 className="project-stack-label flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-to)] mb-2 font-semibold">
                        <StackIcon className="h-3.5 w-3.5" />
                        <span>{group.label}</span>
                      </h5>
                      <motion.div
                        className="flex flex-wrap gap-1.5"
                        variants={tagContainerVariants}
                        initial="hidden"
                        animate="show"
                      >
                        {group.items.map((item) => (
                          <motion.span
                            key={`${group.label}-${item}`}
                            variants={tagItemVariants}
                            className="border border-border/60 bg-background px-2 py-0.5 font-mono text-[10px] text-foreground"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </motion.div>
                    </motion.section>
                  );
                })}
              </div>
            </motion.div>

            {/* Links Section */}
            <motion.div variants={dialogItemVariants} className="project-detail-section border-t-2 border-border/40 pt-3">
              <h4 className="project-detail-section-title font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Repositories & Deployment Links
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {project.links.map((link) => {
                  const Icon = LINK_ICON[link.icon];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-detail-link pixel-btn inline-flex items-center gap-2 border-2 border-border bg-card px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors duration-150"
                      aria-label={`Open ${project.name} ${link.label}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 transform-gpu transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function ProjectCard({
  project,
  onProjectDialogOpenChange,
}: {
  project: Project;
  onProjectDialogOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog.Root onOpenChange={onProjectDialogOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="project-card project-card-trigger group relative flex h-full w-full flex-col border-2 border-border bg-card p-1.5 sm:p-2 text-left transition-all duration-200 hover:border-[var(--pixel-frame)] shadow-[3px_3px_0_var(--pixel-shadow)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_var(--pixel-shadow)]"
          aria-label={`View details for ${project.name}`}
        >
          {/* Inner Pixel Bezel Frame */}
          <div className="relative flex h-full w-full flex-1 flex-col justify-between border-2 border-border/60 bg-card p-4 sm:p-5">
            <div className="flex flex-col flex-1">


              {/* Media Preview Box (Fixed aspect-[16/10]) */}
              <div className="mb-4 overflow-hidden border-2 border-border bg-background  w-full shrink-0">
                <div className="h-full w-full transform-gpu transition-transform duration-300 group-hover:scale-[1.02]">
                  <ProjectPreview project={project} />
                </div>
              </div>

              {/* Title (Single line truncate) */}
              <h3 className="font-display items-center flex text-xl leading-none tracking-normal sm:text-2xl text-foreground group-hover:text-[var(--accent-to)] transition-colors duration-150 truncate shrink-0">
                {project.name}
                {project.featured ? (
                  <span className="inline-flex items-center ml-2 gap-1.5 border border-[var(--accent-to)]
                   bg-[var(--accent-to)]/10 px-2 py-1 font-mono text-[9px] uppercase
                    tracking-widest text-[var(--accent-to)] truncate">
                    AAST Graduation project
                  </span>
                ) : (
                  <></>
                )}

              </h3>

              {/* Description (Fixed line-clamp-2 h-10) */}
              <p className="project-card-blurb mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2 h-10 overflow-hidden shrink-0">
                {project.blurb}
              </p>

              {/* Mini Tech Icon Row (Fixed h-7) */}
              <div className="project-card-tech-row mt-4 flex h-7 items-center gap-2 shrink-0">
                {project.tags
                  .map((tag) => ({ name: tag, Icon: TAG_ICON[tag] }))
                  .filter((item): item is { name: string; Icon: IconType } => Boolean(item.Icon))
                  .slice(0, 5)
                  .map(({ name, Icon }) => (
                    <span
                      key={name}
                      title={name}
                      className="project-card-tech-icon flex h-7 w-7 items-center justify-center border-2 border-border bg-background text-[13px] text-muted-foreground transition-colors duration-150 group-hover:border-[var(--pixel-frame)] group-hover:text-foreground shrink-0"
                    >
                      <Icon />
                    </span>
                  ))}
              </div>
            </div>

            {/* Action Cue with Pixel Button Styling (Pushed to bottom edge) */}
            <div className="mt-6 flex items-center justify-between border-t-2 border-border/40 pt-3 shrink-0">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                View Project
              </span>

              <span className="project-card-cue pixel-btn inline-flex items-center gap-1.5 border-2 border-border bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-to)] group-hover:bg-[var(--pixel-active)] group-hover:text-[var(--pixel-active-foreground)] transition-colors duration-150">
                View details
                <ArrowUpRight className="h-3.5 w-3.5 transform-gpu transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </button>
      </Dialog.Trigger>

      <ProjectDetailDialog project={project} />
    </Dialog.Root>
  );
}

export function Projects({ onProjectDialogOpenChange }: { onProjectDialogOpenChange?: (open: boolean) => void }) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  return (
    <section className="relative">
      <div className="mx-auto flex  min-h-svh max-w-7xl flex-col justify-center px-5 pb-24 pt-16 sm:px-8 sm:pb-24 sm:pt-16">
        {/* Section Header with Category Filter Bar */}
        <Reveal variant="pixel" gridCols={12} gridRows={2}>
          <div className="mb-6 flex items-start justify-between flex-col lg:flex-row lg:items-center lg:justify-between  ">
            <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
              SELECTED WORK
            </h2>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 border-2 border-border bg-card p-1.5">
              {CATEGORIES.map((cat) => {
                const count =
                  cat.id === "all"
                    ? PROJECTS.length
                    : PROJECTS.filter((p) => p.category === cat.id).length;

                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-150 cursor-pointer ${isActive
                      ? "pixel-btn border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)] px-3 py-1.5 font-semibold"
                      : "border-2 border-border bg-card px-3 py-1.5 text-muted-foreground hover:border-[var(--pixel-frame)] hover:text-foreground"
                      }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Grid of Projects (Equal sizes & uniform heights) */}
        <motion.div layout className="project-grid items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col"
              >
                <Reveal variant="pixel" delay={(i % 2) * 0.08} gridCols={8} gridRows={5} className="h-full flex flex-col">
                  <ProjectCard project={project} onProjectDialogOpenChange={onProjectDialogOpenChange} />
                </Reveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
