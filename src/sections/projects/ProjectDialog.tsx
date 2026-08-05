import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/sections/projects/projectsData";
import { LINK_ICON, STACK_GROUP_ICON } from "@/sections/projects/projectsData";
import { ProjectPreview } from "@/sections/projects/ProjectCard";

/* ─── Motion variants ─── */
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

/* ─── Detail Dialog Content ─── */
export function ProjectDetailDialog({ project }: { project: Project }) {
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
              <div className="flex items-center gap-2 bg-card p-1">
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
                <div className="w-full overflow-hidden">
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
