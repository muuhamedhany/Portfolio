import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Project } from "@/sections/projects/projectsData";
import { LINK_ICON, STACK_GROUP_ICON, STACK_ITEM_ICON } from "@/sections/projects/projectsData";
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

/* ─── System Prefix Helper ─── */
function getSystemPrefix(icon: string, label: string): string {
  const i = icon.toLowerCase();
  const l = label.toLowerCase();
  if (i.includes("mobile") || l.includes("mobile") || l.includes("app")) return "[SYS_MOBILE]";
  if (i.includes("backend") || l.includes("backend") || l.includes("server")) return "[SYS_SERVER]";
  if (i.includes("deploy") || l.includes("infra") || l.includes("cloud")) return "[SYS_INFRA]";
  if (i.includes("design") || l.includes("design") || l.includes("ui")) return "[SYS_DESIGN]";
  return "[SYS_WEB]";
}

/* ─── Tech Chip — icon + short label + hover physics ─── */
function TechChip({ name, shortName }: { name: string; shortName?: string }) {
  const Icon = STACK_ITEM_ICON[name] ?? STACK_ITEM_ICON[shortName ?? ""];
  const label = shortName ?? name;

  return (
    <motion.span
      variants={chipVariants}
      className="tech-chip"
      whileHover={{ y: -2, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.12 }}
      title={name !== label ? name : undefined}
    >
      {Icon && (
        <span className="tech-chip-icon-wrap">
          <Icon className="tech-chip-icon" aria-hidden="true" />
        </span>
      )}
      <span className="tech-chip-label">{label}</span>
    </motion.span>
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

            {/* Tech Stack — Terminal Architecture Nodes */}
            <motion.div variants={infoItemVariants} className="project-detail-section">
              <h4 className="project-detail-section-title">System Stack Architecture</h4>
              <div className="project-stack-groups">
                {project.stackGroups.map((group) => {
                  const StackIcon = STACK_GROUP_ICON[group.icon];
                  const sysPrefix = getSystemPrefix(group.icon, group.label);

                  return (
                    <motion.section
                      key={group.label}
                      variants={infoItemVariants}
                      className="project-stack-group"
                      aria-label={`${group.label} stack node`}
                    >
                      {/* Terminal Node Header */}
                      <div className="terminal-node-header">
                        <h5 className="project-stack-label">
                          {group.label}
                        </h5>
                        <span className="terminal-node-count">
                          <span className="terminal-node-dot" />
                          {group.items.length}
                        </span>
                      </div>

                      {/* Tech Chips */}
                      <motion.div
                        className="tech-chips"
                        variants={chipContainerVariants}
                        initial="hidden"
                        animate="show"
                      >
                        {group.items.map((item) => (
                          <TechChip
                            key={item.name}
                            name={item.name}
                            shortName={item.shortName}
                          />
                        ))}
                      </motion.div>
                    </motion.section>
                  );
                })}
              </div>
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
                      preload="metadata"
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
