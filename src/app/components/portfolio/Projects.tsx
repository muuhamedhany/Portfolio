import { ArrowUpRight, Github, Globe, Figma as FigmaIcon, Lock } from "lucide-react";
import { Reveal } from "./Reveal";

interface ProjectLink {
  label: string;
  href: string;
  icon: "live" | "github" | "behance";
}

interface Project {
  index: string;
  name: string;
  blurb: string;
  tags: string[];
  links: ProjectLink[];
  featured?: boolean;
  note?: string;
}

const PROJECTS: Project[] = [
  {
    index: "01",
    name: "CarKit",
    blurb:
      "Egyptian automotive marketplace — a React Native mobile app, a Node/Express API with 70+ endpoints, and two React web portals. Seven user roles, AI-powered recommendations, PostgreSQL via Supabase.",
    tags: ["React Native", "Node.js", "Express", "PostgreSQL", "Supabase", "AI"],
    links: [],
    note: "Graduation project · Team of 4 · Private",
    featured: true,
  },
  {
    index: "02",
    name: "Car Rental Landing Page",
    blurb: "A motion-rich rental landing page with scroll choreography and crisp section reveals.",
    tags: ["React", "Tailwind", "Framer Motion"],
    links: [{ label: "Live", href: "https://carrenral.vercel.app", icon: "live" }],
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-none border-2 border-border bg-card pixel-shadow-sm transition-colors duration-200 hover:border-[var(--accent-to)] sm:p-8 p-6 ${
        project.featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* accent corner glow on hover */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent-mid)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.25em] text-[var(--accent-to)]">{project.index}</span>
          {project.featured && (
            <span className="rounded-none border border-[var(--accent-to)]/40 bg-[var(--accent-to)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent-to)]">
              Featured
            </span>
          )}
        </div>

        <h3
          className="font-display tracking-normal"
          style={{ fontSize: project.featured ? "clamp(1.75rem, 4vw, 2.5rem)" : "1.5rem", fontWeight: 600 }}
        >
          {project.name}
        </h3>

        <p className={`mt-3 text-muted-foreground ${project.featured ? "max-w-2xl" : ""}`}>{project.blurb}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-none border border-border px-2.5 py-1 font-mono text-xs text-foreground/80">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
        {project.links.map((link) => {
          const Icon = LINK_ICON[link.icon];
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border-2 border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground pixel-btn hover:bg-gradient-accent hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          );
        })}
        {project.note && (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            {project.note}
          </span>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section className="relative">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pb-28 pt-24 sm:px-8 sm:pb-24">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 600 }}>
            Selected Work
          </h2>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">01 / Projects</span>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.name} delay={(i % 2) * 0.08} className={project.featured ? "lg:col-span-2" : ""}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
