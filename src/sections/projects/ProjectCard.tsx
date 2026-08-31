import { useState, useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Project } from "@/sections/projects/projectsData";
import { LINK_ICON, TAG_ICON } from "@/sections/projects/projectsData";
import { ProjectDetailDialog } from "@/sections/projects/ProjectDialog";
import { useAdminAuth } from "@/lib/context/AdminAuthContext";
import { useProjects } from "@/lib/context/ProjectsContext";

/* ─── Project Preview (image/tech-tile fallback) ─── */
export function ProjectPreview({
  project,
  isHovered,
}: {
  project: Project;
  isHovered: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Gallery cycling state — only active when there are multiple images
  const allImages: { src: string; alt: string }[] = [];
  if (project.previewImage) allImages.push(project.previewImage);
  if (project.galleryImages) {
    project.galleryImages.slice(0, 5).forEach((gi) => {
      if (!allImages.some((img) => img.src === gi.src)) {
        allImages.push({ src: gi.src, alt: gi.alt });
      }
    });
  }
  const hasMultiple = allImages.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [fadingIn, setFadingIn] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hasMultiple) return;

    if (isHovered) {
      intervalRef.current = setInterval(() => {
        setFadingIn(false);
        setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % allImages.length);
          setFadingIn(true);
        }, 200); // crossfade out duration
      }, 1400);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Reset to first image with a brief fade
      setFadingIn(false);
      setTimeout(() => {
        setActiveIndex(0);
        setFadingIn(true);
      }, 200);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, hasMultiple]);

  if (project.previewImage) {
    const activeImage = allImages[activeIndex] ?? project.previewImage;
    const isDocument = (project.galleryImages?.length ?? 0) > 5 || project.name === "CarKit";
    const imageFitClass = isDocument ? "object-contain bg-black/30" : "object-cover";

    return (
      <div className="project-card-media project-card-media-image aspect-[16/10] w-full overflow-hidden bg-background relative">
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
          <>
            <img
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              className={`h-full w-full ${imageFitClass} transition-opacity duration-200 ${
                imageLoaded && fadingIn ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
            />
            {/* Image counter dots — only shown when multiple images exist */}
            {hasMultiple && imageLoaded && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
                {allImages.map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "w-4 bg-[var(--accent-to)]"
                        : "w-1 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
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

/* ─── Project Card Trigger (no Dialog.Root — must be nested inside one) ─── */
export function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isAdmin } = useAdminAuth();
  const { openEditDrawer, deleteProject } = useProjects();

  return (
    <Dialog.Trigger asChild>
      <div
        role="button"
        tabIndex={0}
        className="project-card project-card-trigger group relative flex h-full w-full flex-col border-2 border-border bg-card p-1.5 sm:p-2 text-left transition-all duration-200 hover:border-[var(--pixel-frame)] shadow-[3px_3px_0_var(--pixel-shadow)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_var(--pixel-shadow)] cursor-pointer"
        aria-label={`View details for ${project.name}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Inner Pixel Bezel Frame */}
        <div className="relative flex h-full w-full flex-1 flex-col border-2 border-border/60 bg-card p-4 sm:p-5">
          <div className="flex flex-col mb-2">

            {/* Media Preview Box (Fixed aspect-[16/10]) */}
            <div className="relative mb-4 overflow-hidden border-2 border-border bg-background w-full shrink-0">
              {/* Admin Quick Action Controls Overlay */}
              {isAdmin && (
                <div
                  className="absolute top-2 right-2 z-20 flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      openEditDrawer(project);
                    }}
                    className="flex h-7 items-center gap-1 border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] px-2 font-mono text-[10px] font-bold uppercase text-white shadow-[2px_2px_0_var(--pixel-shadow)] hover:brightness-110 cursor-pointer"
                    title="Edit project in Neon CMS"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>EDIT</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (window.confirm(`Delete project "${project.name}" from Neon database?`)) {
                        deleteProject(project.id || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="flex h-7 w-7 items-center justify-center border-2 border-red-500/80 bg-red-950 px-1 font-mono text-[10px] font-bold uppercase text-red-400 shadow-[2px_2px_0_var(--pixel-shadow)] hover:bg-red-900 cursor-pointer"
                    title="Delete project from Neon CMS"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="h-full w-full transform-gpu transition-transform duration-300 group-hover:scale-[1.02]">
                <ProjectPreview project={project} isHovered={isHovered} />
              </div>
            </div>

            {/* Title (Single line truncate) */}
            <h3 className="font-display items-center flex text-2xl leading-none tracking-normal sm:text-3xl text-foreground group-hover:text-[var(--accent-to)] transition-colors duration-150 truncate shrink-0">
              {project.name}
              {project.featured ? (
                <span className="inline-flex items-center ml-2 gap-1.5 border border-[var(--accent-to)] bg-[var(--accent-to)]/10 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-[var(--accent-to)] truncate">
                  AAST Graduation project
                </span>
              ) : (
                <></>
              )}
            </h3>

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

          {/* Action Cue with Pixel Button Styling & Outer Project Links */}
          <div className="mt-auto flex flex-col gap-3 border-t-2 border-border/40 pt-3 shrink-0">
            {/* Direct External Links Row (Fixed min-height across cards to keep gap uniform) */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap items-start content-start gap-1.5">
                {project.links.map((link) => {
                  const Icon = LINK_ICON[link.icon];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="pixel-btn inline-flex items-center gap-1 border-2 border-border bg-background px-2 py-1 font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground hover:border-[var(--pixel-frame)] hover:bg-[var(--pixel-active)] hover:text-[var(--pixel-active-foreground)] transition-colors duration-150"
                      title={`Open ${link.label}`}
                      aria-label={`Open ${project.name} ${link.label}`}
                    >
                      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-60" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* View Details Footer Bar */}
            <div className="flex items-center justify-between border-t border-border/20 pt-2.5">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                Project Details
              </span>

              <span className="project-card-cue pixel-btn inline-flex items-center gap-1.5 border-2 border-border bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-to)] group-hover:bg-[var(--pixel-active)] group-hover:text-[var(--pixel-active-foreground)] transition-colors duration-150">
                View details
                <ArrowUpRight className="h-3.5 w-3.5 transform-gpu transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Dialog.Trigger>
  );
}

/* ─── Full Card + Dialog composition ─── */
export function ProjectCardWithDialog({
  project,
  onProjectDialogOpenChange,
}: {
  project: Project;
  onProjectDialogOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog.Root onOpenChange={onProjectDialogOpenChange}>
      <ProjectCard project={project} />
      <ProjectDetailDialog project={project} />
    </Dialog.Root>
  );
}

