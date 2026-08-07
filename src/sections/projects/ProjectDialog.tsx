import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Project } from "@/sections/projects/projectsData";
import { LINK_ICON, STACK_ITEM_ICON } from "@/sections/projects/projectsData";
import { ProjectPreview } from "@/sections/projects/ProjectCard";

/* ─── Spring config ─── */
const SPRING = { type: "spring" as const, stiffness: 360, damping: 28, mass: 0.9 };

/* ─── Info pane stagger variants ─── */
const infoContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const infoItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const chipContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface TechRoleMeta {
  role: string;
  glowClass: string;
  dotColor: string;
}

function getTechRoleMeta(name: string, groupLabel: string): TechRoleMeta {
  const n = name.toLowerCase();
  const g = groupLabel.toLowerCase();

  if (n.includes("react native") || n.includes("expo")) {
    return { role: "Mobile Framework", glowClass: "glow-cyan", dotColor: "#38bdf8" };
  }
  if (n.includes("react") || n.includes("vite")) {
    return { role: "UI Library", glowClass: "glow-cyan", dotColor: "#38bdf8" };
  }
  if (n.includes("tailwind") || n.includes("figma") || g.includes("design")) {
    return { role: "UI Styling", glowClass: "glow-pink", dotColor: "#f472b6" };
  }
  if (n.includes("typescript") || n.includes("js") || n.includes("javascript")) {
    return { role: "Language", glowClass: "glow-blue", dotColor: "#60a5fa" };
  }
  if (n.includes("express") || n.includes("router")) {
    return { role: "Web Framework", glowClass: "glow-amber", dotColor: "#fbbf24" };
  }
  if (n.includes("node")) {
    return { role: "Runtime Environment", glowClass: "glow-green", dotColor: "#4ade80" };
  }
  if (n.includes("postgres") || n.includes("sql") || n.includes("supabase")) {
    return { role: "Database", glowClass: "glow-purple", dotColor: "#c084fc" };
  }
  if (n.includes("jwt") || n.includes("auth")) {
    return { role: "Security & Auth", glowClass: "glow-amber", dotColor: "#f59e0b" };
  }
  if (n.includes("render") || n.includes("vercel") || g.includes("deploy") || g.includes("infra")) {
    return { role: "Deployment", glowClass: "glow-mint", dotColor: "#34d399" };
  }
  if (n.includes("framer") || n.includes("motion")) {
    return { role: "Animation Engine", glowClass: "glow-pink", dotColor: "#ec4899" };
  }

  // Fallbacks by group label
  if (g.includes("mobile")) return { role: "Mobile Stack", glowClass: "glow-cyan", dotColor: "#38bdf8" };
  if (g.includes("backend")) return { role: "Backend Server", glowClass: "glow-green", dotColor: "#4ade80" };
  if (g.includes("deploy") || g.includes("infra")) return { role: "Infrastructure", glowClass: "glow-mint", dotColor: "#34d399" };

  return { role: "Core Module", glowClass: "glow-cyan", dotColor: "#38bdf8" };
}

/* ─── Equipped RPG Inventory Tech Stack Component ─── */
function EquippedInventory({ project }: { project: Project }) {
  // Collect all unique equipped items from stack groups
  const itemsMap = new Map<string, { name: string; shortName?: string; groupLabel: string }>();

  project.stackGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (!itemsMap.has(item.name)) {
        itemsMap.set(item.name, {
          name: item.name,
          shortName: item.shortName,
          groupLabel: group.label,
        });
      }
    });
  });

  const equippedItems = Array.from(itemsMap.values());

  return (
    <div className="rpg-inventory-box">
      {/* Header */}
      <div className="rpg-inventory-header">
        <div className="rpg-inventory-title">
          <span className="rpg-inventory-title-dot" />
          TECH USED
        </div>
      </div>

      {/* Grid of Equipped Items */}
      <motion.div
        className="rpg-inventory-grid"
        variants={chipContainerVariants}
        initial="hidden"
        animate="show"
      >
        {equippedItems.map((item) => {
          const Icon = STACK_ITEM_ICON[item.name] ?? STACK_ITEM_ICON[item.shortName ?? ""];
          const meta = getTechRoleMeta(item.name, item.groupLabel);

          return (
            <motion.div
              key={item.name}
              variants={chipVariants}
              className="rpg-inventory-slot group cursor-pointer"
            >
              <div className="rpg-inventory-left">
                {/* Icon Frame */}
                <div className={`rpg-inventory-icon-frame ${meta.glowClass}`}>
                  {Icon ? (
                    <Icon className="rpg-inventory-icon text-foreground" aria-hidden="true" />
                  ) : (
                    <span className="font-mono text-[10px] font-bold text-foreground">
                      {item.shortName?.slice(0, 2) ?? item.name.slice(0, 2)}
                    </span>
                  )}
                </div>

                {/* Name + Subtitle */}
                <div className="rpg-inventory-meta">
                  <span className="rpg-inventory-item-name">{item.name}</span>
                  <span className="rpg-inventory-item-role">{meta.role}</span>
                </div>
              </div>

            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─── Detail Dialog Content ─── */
export function ProjectDetailDialog({ project }: { project: Project }) {
  const [activeMediaTab, setActiveMediaTab] = useState<"video" | "image">(
    project.previewVideo ? "video" : "image"
  );

  const hasVideoAndImage = Boolean(project.previewVideo && project.previewImage);

  return (
    <Dialog.Portal>
      {/* Overlay — CSS keyframes handle enter/exit */}
      <Dialog.Overlay className="project-detail-overlay" />

      {/* Content */}
      <Dialog.Content className="project-detail-content select-none" aria-label={`${project.name} project details`}>
        {/* ── Header ── */}
        <div className="project-detail-header">
          <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-3 gap-y-1">


            <Dialog.Title className="font-display text-2xl sm:text-3xl leading-none tracking-normal text-foreground">
              {project.name}
            </Dialog.Title>

            {project.featured && (
              <span className="project-detail-badge">
                AAST Graduation Project
              </span>
            )}
          </div>

          {/* Close */}
          <Dialog.Close asChild>
            <motion.button
              type="button"
              className="project-detail-close"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              aria-label={`Close ${project.name} details`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </Dialog.Close>
        </div>

        {/* ── Body Layout (40% Left Dossier / 60% Right Media Stage) ── */}
        <div className="project-detail-layout">

          {/* Left Column — Dossier (Overview, Tech Stack, Links) */}
          <motion.div
            className="project-detail-dossier"
            variants={infoContainerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Overview */}
            <motion.div variants={infoItemVariants} className="project-detail-section">
              <h4 className="project-detail-section-title">Overview</h4>
              <p className="project-detail-blurb">{project.blurb}</p>
            </motion.div>

            {/* Tech Stack — RPG Equipped Components Inventory */}
            <motion.div variants={infoItemVariants} className="project-detail-section">
              <EquippedInventory project={project} />
            </motion.div>

            {/* Links */}
            <motion.div variants={infoItemVariants} className="project-detail-section project-detail-links-section">
              <h4 className="project-detail-section-title">Links</h4>
              <div className="project-detail-links">
                {project.links.map((link) => {
                  const Icon = LINK_ICON[link.icon];
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-detail-link"
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ y: 1, scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                      aria-label={`Open ${project.name} ${link.label}`}
                    >
                      <Icon className="h-3.5 w-3.5 text-[var(--accent-to)]" aria-hidden="true" />
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-60" aria-hidden="true" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column — Media Stage */}
          <div className="project-detail-stage">
            {/* Stage header bar: Tab switcher + Live Demo badge */}
            <div className="project-detail-stage-header">
              {hasVideoAndImage ? (
                <div className="flex items-center gap-1.5 border border-border bg-background p-1 shadow-[inset_1px_1px_0_var(--pixel-edge-light)]">
                  {(["video", "image"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveMediaTab(tab)}
                      className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-all cursor-pointer ${activeMediaTab === tab
                        ? "border border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)] font-semibold shadow-[1px_1px_0_var(--pixel-shadow)]"
                        : "border border-transparent bg-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {tab === "video" ? "Video" : "Photos"}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="project-detail-kicker uppercase tracking-widest text-[10px]">
                  Project Media
                </span>
              )}

              <div className="flex items-center gap-2">
                {activeMediaTab === "video" && project.previewVideo && (
                  <span className="flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE DEMO
                  </span>
                )}
              </div>
            </div>

            {/* Media frame */}
            <div className="project-detail-stage-frame">
              <AnimatePresence mode="wait" initial={false}>
                {activeMediaTab === "video" && project.previewVideo ? (
                  <motion.div
                    key="video"
                    className="relative aspect-video w-full overflow-hidden bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <video
                      className="h-full w-full object-cover"
                      controls
                      muted
                      loop
                      poster={project.previewVideo.poster}
                      aria-label={project.previewVideo.title}
                    >
                      <source src={project.previewVideo.src} type={project.previewVideo.type ?? "video/mp4"} />
                      Your browser does not support the video player.
                    </video>
                  </motion.div>
                ) : (
                  <motion.div
                    key="image"
                    className="w-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ProjectPreview project={project} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

/* ─── keep the spring ref available for optional external use ─── */
export { SPRING };
