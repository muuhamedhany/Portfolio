import {
  ArrowUpRight,
  ChevronDown,
  Figma as FigmaIcon,
  Github,
  Globe,
  Play,
  X,
} from "lucide-react";
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

interface Project {
  index: string;
  name: string;
  blurb: string;
  tags: string[];
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
      "Egyptian automotive marketplace — a React Native mobile app, a Node/Express API with 70+ endpoints, and two React web portals. Seven user roles, AI-powered recommendations, PostgreSQL via Supabase.",
    tags: ["React Native Expo", "Render", "Supabase", "Express", "Node.js", "React", "PostgreSQL", "Gemini AI"],
    links: [
      { label: "App", href: "https://github.com/muuhamedhany/CarKitApp", icon: "github" },
      { label: "Admin Website", href: "https://github.com/muuhamedhany/CarKit-Admin-Web", icon: "github" },
      { label: "Driver Website", href: "https://github.com/muuhamedhany/CarKit-Driver-Web", icon: "github" }
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
    links: [{ label: "Live", href: "https://carrenral.vercel.app", icon: "live" }],
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
    links: [
      { label: "Live", href: "https://pure-store.vercel.app", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/E-Commerce-REACT", icon: "github" },
    ],
  },
  {
    index: "04",
    name: "Workout & Diet App",
    blurb: "A UI/UX case study — user research, flows, and a high-fidelity prototype in Figma. NTI graduation project.",
    tags: ["Figma", "User Research", "Prototyping"],
    links: [{ label: "Behance", href: "https://behance.net/gallery/234873613", icon: "behance" }],
  },
];

const LINK_ICON = { live: Globe, github: Github, behance: FigmaIcon } as const;

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
  if (project.previewImage) {
    return (
      <div className="project-card-media overflow-hidden bg-background">
        <img src={project.previewImage.src} alt={project.previewImage.alt} className="h-full w-full object-cover" loading="lazy" />
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

function ProjectVideoDialog({ project, video }: { project: Project; video: ProjectVideo }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="project-video-overlay" />
      <Dialog.Content className="project-video-content">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Dialog.Title className="font-display text-2xl leading-none tracking-normal text-foreground">
              {project.name} Video
            </Dialog.Title>
            <Dialog.Description className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Demo preview player
            </Dialog.Description>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="pixel-btn inline-flex min-h-10 min-w-10 items-center justify-center border-2 border-border bg-secondary text-secondary-foreground hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
              aria-label={`Close ${project.name} video`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </Dialog.Close>
        </div>

        <div className="project-video-frame">
          <video
            className="h-full w-full bg-black"
            controls
            preload="metadata"
            poster={video.poster}
            aria-label={video.title}
          >
            <source src={video.src} type={video.type ?? "video/mp4"} />
            Your browser does not support the video player.
          </video>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? project.tags : project.tags.slice(0, 3);
  const hiddenTagCount = Math.max(project.tags.length - 3, 0);
  const tagsId = `project-${project.index}-tags`;

  return (
    <Dialog.Root>
      <article className="project-card group relative flex h-full min-h-0 flex-col border-2 border-border bg-card transition-colors duration-150 hover:border-[var(--pixel-frame)]">
        <ProjectPreview project={project} />
        <div className="relative flex min-w-0 flex-1 flex-col justify-between px-1 pb-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--accent-to)]">{project.index}</span>

          </div>

          <div className="flex gap-2">
            <h3 className="font-display text-[1.35rem] leading-none tracking-normal sm:text-[1.5rem]" style={{ fontWeight: 600 }}>
              {project.name}
            </h3>

            {project.featured && (
              <span className="flex items-center border border-[var(--accent-to)]/40 bg-[var(--accent-to)]/10 px-2  font-mono text-[9px] uppercase tracking-widest text-[var(--accent-to)]">
                AAST Graduation project
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-5 text-muted-foreground">{project.blurb}</p>

          <div id={tagsId} className="mt-4 flex flex-wrap gap-2">
            {visibleTags.map((t) => (
              <span key={t} className="border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-foreground/80">
                {t}
              </span>
            ))}
            {hiddenTagCount > 0 && (
              <button
                type="button"
                className="inline-flex min-h-6 items-center gap-1 border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-[var(--accent-to)] transition-colors hover:border-[var(--pixel-frame)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                aria-expanded={showAllTags}
                aria-controls={tagsId}
                aria-label={`${showAllTags ? "Hide" : "Show"} ${hiddenTagCount} more technologies for ${project.name}`}
                onClick={() => setShowAllTags((value) => !value)}
              >
                {showAllTags ? "less" : `+${hiddenTagCount}`}
                <ChevronDown className={`h-3 w-3 transition-transform ${showAllTags ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {project.previewVideo && (
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex min-h-8 items-center gap-1 border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] px-2.5 py-1 text-xs font-medium text-[var(--pixel-active-foreground)] pixel-btn hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                  aria-label={`Watch ${project.name} video preview`}
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  Video
                </button>
              </Dialog.Trigger>
            )}

            {project.links.map((link) => {
              const Icon = LINK_ICON[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-8 items-center gap-1 border-2 border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground pixel-btn hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)]"
                  aria-label={`Open ${project.name} ${link.label}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </article>

      {project.previewVideo && <ProjectVideoDialog project={project} video={project.previewVideo} />}
    </Dialog.Root>
  );
}

export function Projects() {
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
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
