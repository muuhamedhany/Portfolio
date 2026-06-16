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

interface Project {
  index: string;
  name: string;
  blurb: string;
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

const PROJECTS: Project[] = [
  {
    index: "01",
    name: "CarKit",
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

const TAG_ICON: Partial<Record<string, IconType>> = {
  "React Native": SiReact,
  React: SiReact,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  PostgreSQL: SiPostgresql,
  Supabase: SiSupabase,
  Tailwind: SiTailwindcss,
  "Framer Motion": SiFramer,
  Figma: SiFigma,
};

function ProjectPreview({ project }: { project: Project }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  if (project.previewImage) {
    return (
      <div className="project-card-media project-card-media-image overflow-hidden bg-background">
        {!imageLoaded && !imageFailed && (
          <div className="project-image-skeleton" aria-hidden="true">
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
    <div className="project-card-media flex items-center justify-center bg-background" aria-label={`${project.name} technology stack`}>
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

function ProjectDetailDialog({ project }: { project: Project }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="project-detail-overlay" />
      <Dialog.Content className="project-detail-content">
        <div className="project-detail-header">
          <div className="min-w-0">
            <span className="project-detail-index">{project.index}</span>
            <Dialog.Title className="font-display text-3xl leading-none tracking-normal text-foreground">
              {project.name}
            </Dialog.Title>
            <Dialog.Description className="project-detail-kicker">
              Project details
            </Dialog.Description>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="pixel-btn inline-flex min-h-10 min-w-10 items-center justify-center border-2 border-border bg-secondary text-secondary-foreground hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              aria-label={`Close ${project.name} details`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </Dialog.Close>
        </div>

        <div className="project-detail-layout">
          <div className="project-detail-media-column">
            <ProjectPreview project={project} />

            {project.previewVideo && (
              <div className="project-detail-video-frame">
                <video
                  className="h-full w-full bg-black"
                  controls
                  preload="metadata"
                  poster={project.previewVideo.poster}
                  aria-label={project.previewVideo.title}
                >
                  <source src={project.previewVideo.src} type={project.previewVideo.type ?? "video/mp4"} />
                  Your browser does not support the video player.
                </video>
              </div>
            )}
          </div>

          <div className="project-detail-info">
            {project.featured && (
              <span className="project-detail-badge">
                AAST Graduation project
              </span>
            )}

            <p className="project-detail-blurb">{project.blurb}</p>

            <div className="project-detail-section">
              <h4 className="project-detail-section-title">Stack</h4>
              <div className="project-stack-groups">
                {project.stackGroups.map((group) => {
                  const StackIcon = STACK_GROUP_ICON[group.icon];

                  return (
                    <section key={group.label} className="project-stack-group" aria-label={`${project.name} ${group.label} stack`}>
                      <h5 className="project-stack-label">
                        <span className="project-stack-icon" aria-hidden="true">
                          <StackIcon className="h-3.5 w-3.5" />
                        </span>
                        <span>{group.label}</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span key={`${group.label}-${item}`} className="project-stack-tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>

            <div className="project-detail-section">
              <h4 className="project-detail-section-title">Links</h4>
              <div className="project-detail-links">
                {project.links.map((link) => {
                  const Icon = LINK_ICON[link.icon];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-detail-link pixel-btn"
                      aria-label={`Open ${project.name} ${link.label}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
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
          className="project-card project-card-trigger group relative flex h-full min-h-0 flex-col border-2 border-border bg-card transition-colors duration-150 hover:border-[var(--pixel-frame)]"
          aria-label={`View details for ${project.name}`}
        >
          <ProjectPreview project={project} />
          <div className="relative flex min-w-0 flex-1 flex-col justify-between px-1 pb-1">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="font-mono text-xs tracking-[0.25em] text-[var(--accent-to)]">{project.index}</span>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="font-display text-[1.35rem] leading-none tracking-normal sm:text-[1.5rem]" style={{ fontWeight: 600 }}>
                  {project.name}
                </h3>

                {project.featured && (
                  <span className="flex items-center border border-[var(--accent-to)]/40 bg-[var(--accent-to)]/10 px-2 font-mono text-[9px] uppercase tracking-widest text-[var(--accent-to)]">
                    AAST Graduation project
                  </span>
                )}
              </div>

              <p className="project-card-blurb mt-2 text-sm leading-5 text-muted-foreground">{project.blurb}</p>
            </div>

            <span className="project-card-cue mt-4 inline-flex w-max border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-to)]">
              View details
            </span>
          </div>
        </button>
      </Dialog.Trigger>

      <ProjectDetailDialog project={project} />
    </Dialog.Root>
  );
}

export function Projects({ onProjectDialogOpenChange }: { onProjectDialogOpenChange?: (open: boolean) => void }) {
  return (
    <section className="relative">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 pb-24 pt-16 sm:px-8 sm:pb-24 sm:pt-16">
        <Reveal>
          <div className="mb-6 flex items-end justify-between gap-4 sm:mb-7">
            <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 600 }}>
              Selected Work
            </h2>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">01 / Projects</span>
          </div>
        </Reveal>

        <div className="project-grid">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.name} delay={(i % 2) * 0.08}>
              <ProjectCard project={project} onProjectDialogOpenChange={onProjectDialogOpenChange} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
