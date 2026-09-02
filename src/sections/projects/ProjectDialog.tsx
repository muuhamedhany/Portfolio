import * as Dialog from "@radix-ui/react-dialog";
import { useState, useRef, useEffect } from "react";
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Project } from "@/sections/projects/projectsData";
import { LINK_ICON, STACK_ITEM_ICON } from "@/sections/projects/projectsData";
import { ProjectPreview } from "@/sections/projects/ProjectCard";
import { PixelVideoPlayer } from "@/components/ui/PixelVideoPlayer";

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
  if (n.includes("three") || n.includes("r3f") || n.includes("ogl")) {
    return { role: "3D & WebGL Engine", glowClass: "glow-purple", dotColor: "#c084fc" };
  }
  if (n.includes("cart") || n.includes("wishlist") || n.includes("guard")) {
    return { role: "State Engine", glowClass: "glow-amber", dotColor: "#fbbf24" };
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

/* ─── Swipe Config ─── */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

/* ─── High-End Image Gallery Component ─── */
function HighEndGalleryCarousel({ images }: { images: { src: string; alt: string; title?: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, isFullscreen]);

  const current = images[currentIndex];
  const isDocument = images.length > 5;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "20%" : "-20%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "20%" : "-20%",
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col w-full h-full bg-background group select-none overflow-hidden">
      {/* ── Main Viewport ── */}
      <div
        className={`relative w-full overflow-hidden ${isDocument
          ? "h-[540px] sm:h-[640px] max-h-[72vh] flex items-center justify-center bg-black/40"
          : "aspect-[16/10] bg-background"
          }`}
      >
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.img
            key={currentIndex}
            src={current.src}
            alt={current.alt}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full w-full cursor-zoom-in ${isDocument ? "object-contain bg-transparent p-1" : "object-cover"
              }`}
            onClick={() => setIsFullscreen(true)}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                nextImage();
              } else if (swipe > swipeConfidenceThreshold) {
                prevImage();
              }
            }}
          />
        </AnimatePresence>

        {/* Prev / Next Arrows (Overlay) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-[var(--pixel-frame)] bg-background/90 text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-[var(--pixel-frame)] bg-background/90 text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {/* Title & Navigation Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white truncate max-w-[65%] shadow-sm">
            {current.title ?? current.alt}
          </span>

          {isDocument ? (
            <span className="font-mono text-[11px] font-medium text-white/90 bg-black/50 px-2 py-0.5 rounded border border-white/10">
              {currentIndex + 1} / {images.length}
            </span>
          ) : (
            images.length > 1 && (
              <div className="flex items-center gap-1.5 pointer-events-auto">
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 transition-all cursor-pointer ${idx === currentIndex
                      ? "w-5 bg-[var(--accent-to)] shadow-[0_0_8px_var(--accent-to)]"
                      : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Fullscreen Portal Overlay */}
      <Dialog.Root open={isFullscreen} onOpenChange={setIsFullscreen}>
        <AnimatePresence>
          {isFullscreen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 outline-none"
                  aria-describedby={undefined}
                  onClick={() => setIsFullscreen(false)}
                >
                  <Dialog.Title className="sr-only">Fullscreen Image</Dialog.Title>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreen(false);
                    }}
                    className="absolute top-4 right-4 z-[999] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border border-[var(--pixel-frame)] bg-background/90 text-foreground shadow-[2px_2px_0_var(--pixel-shadow)] sm:shadow-[4px_4px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors cursor-pointer"
                    aria-label="Close fullscreen"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>

                  {/* Prev/Next Arrows for Fullscreen (Desktop Only) */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                        className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-[999] h-12 w-12 items-center justify-center border border-[var(--pixel-frame)] bg-background/90 text-foreground shadow-[4px_4px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-8 w-8" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                        className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-[999] h-12 w-12 items-center justify-center border border-[var(--pixel-frame)] bg-background/90 text-foreground shadow-[4px_4px_0_var(--pixel-shadow)] hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-8 w-8" />
                      </button>
                    </>
                  )}

                  {/* Fullscreen Image */}
                  <motion.img
                    key={currentIndex}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    src={current.src}
                    alt={current.alt}
                    className="max-h-full max-w-full object-contain cursor-zoom-out shadow-2xl relative z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreen(false);
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.8}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        nextImage();
                      } else if (swipe > swipeConfidenceThreshold) {
                        prevImage();
                      }
                    }}
                  />

                  {/* Bottom Navigation Pill (Counter always, Arrows Mobile Only) */}
                  <div className="absolute bottom-2 sm:bottom-2 left-1/2 -translate-x-1/2
                   flex items-center bg-background/90 z-[999] border border-[var(--pixel-frame)]
                    shadow-[4px_4px_0_var(--pixel-shadow)] pointer-events-auto">
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                        className="flex sm:hidden h-10 w-10 items-center justify-center border-r border-[var(--pixel-frame)] text-foreground hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                    )}

                    <span className="text-xs sm:text-sm text-foreground px-4 py-2
                     min-w-[4.5rem] sm:min-w-[5rem] text-center select-none
                     pointer-events-none tracking-widest font-bold">
                      {currentIndex + 1} / {images.length}
                    </span>

                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                        className="flex sm:hidden h-10 w-10 items-center justify-center border-l border-[var(--pixel-frame)] text-foreground hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
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
                      {tab === "video" ? "Video" : "PROJECT MANUAL"}
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
                    className="relative w-full overflow-hidden bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <PixelVideoPlayer
                      src={project.previewVideo.src}
                      title={project.previewVideo.title || `${project.name} DEMO`}
                      poster={project.previewVideo.poster || project.previewImage?.src}
                      loop
                      embedded
                    />
                  </motion.div>
                ) : project.galleryImages && project.galleryImages.length > 0 ? (
                  <motion.div
                    key="gallery"
                    className="w-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <HighEndGalleryCarousel images={project.galleryImages} />
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
