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

/* ─── Tech Chip — icon + short label ─── */
function TechChip({ name, shortName }: { name: string; shortName?: string }) {
  const Icon = STACK_ITEM_ICON[name] ?? STACK_ITEM_ICON[shortName ?? ""];
  const label = shortName ?? name;

  return (
    <motion.span
      variants={chipVariants}
      className="tech-chip"
      title={name !== label ? name : undefined}
    >
      {Icon && <Icon className="tech-chip-icon" aria-hidden="true" />}
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
      {/* Overlay — CSS keyframes handle enter/exit (Radix controls unmount) */}
      <Dialog.Overlay className="project-detail-overlay" />

      {/* Content */}
      <Dialog.Content className="project-detail-content select-none" aria-label={`${project.name} project details`}>
        {/* ── Header ── */}
        <div className="project-detail-header">
          <div className="min-w-0 flex-1">
            {/* Index kicker */}
            <span className="project-detail-index" aria-hidden="true">
              {project.index} / 05
            </span>

            <Dialog.Title className="font-display text-2xl sm:text-3xl leading-none tracking-normal text-foreground">
              {project.name}
            </Dialog.Title>

            {project.featured && (
              <span className="project-detail-badge mt-2 inline-flex">
                AAST Graduation Project
              </span>
            )}
          </div>

          {/* Close */}
          <Dialog.Close asChild>
            <motion.button
              type="button"
              className="project-detail-close pixel-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
              aria-label={`Close ${project.name} details`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </Dialog.Close>
        </div>

        {/* ── Body Layout ── */}
        <div className="project-detail-layout">

          {/* Left — Media Stage */}
          <div className="project-detail-media-column flex flex-col gap-3">
            {/* Tab switcher */}
            {hasVideoAndImage && (
              <div className="flex items-center gap-2 bg-card p-1">
                {(["video", "image"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveMediaTab(tab)}
                    className={`flex flex-1 justify-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-all cursor-pointer ${
                      activeMediaTab === tab
                        ? "pixel-btn border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)] font-semibold"
                        : "border-2 border-border bg-background text-muted-foreground hover:border-[var(--pixel-frame)] hover:text-foreground"
                    }`}
                  >
                    {tab === "video" ? "Video" : "Photos"}
                  </button>
                ))}
              </div>
            )}

            {/* Media frame */}
            <div className="overflow-hidden border-2 border-border bg-black shadow-[3px_3px_0_var(--pixel-shadow)]">
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

            {/* Category kicker */}
            <span className="project-detail-kicker capitalize">{project.category}</span>
          </div>

          {/* Right — Info Pane (spring entrance + stagger) */}
          <motion.div
            className="project-detail-info flex flex-col gap-5"
            variants={infoContainerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Overview */}
            <motion.div variants={infoItemVariants} className="project-detail-section">
              <h4 className="project-detail-section-title">Overview</h4>
              <p className="project-detail-blurb">{project.blurb}</p>
            </motion.div>

            {/* Tech Stack */}
            <motion.div variants={infoItemVariants} className="project-detail-section">
              <h4 className="project-detail-section-title">Tech Stack</h4>
              <div className="project-stack-groups">
                {project.stackGroups.map((group) => {
                  const StackIcon = STACK_GROUP_ICON[group.icon];

                  return (
                    <motion.section
                      key={group.label}
                      variants={infoItemVariants}
                      className="project-stack-group"
                      aria-label={`${group.label} stack`}
                    >
                      <h5 className="project-stack-label">
                        <span className="project-stack-icon">
                          <StackIcon aria-hidden="true" />
                        </span>
                        {group.label}
                      </h5>

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
                      className="project-detail-link pixel-btn"
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 1, scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                      aria-label={`Open ${project.name} ${link.label}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-50" aria-hidden="true" />
                    </motion.a>
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

/* ─── keep the spring ref available for optional external use ─── */
export { SPRING };
