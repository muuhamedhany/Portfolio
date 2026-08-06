import { useState } from "react";
import type { IconType } from "react-icons";
import { ArrowUpRight } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Project } from "@/sections/projects/projectsData";
import { TAG_ICON } from "@/sections/projects/projectsData";
import { ProjectDetailDialog } from "@/sections/projects/ProjectDialog";

/* ─── Project Preview (image/tech-tile fallback) ─── */
export function ProjectPreview({ project }: { project: Project }) {
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

/* ─── Project Card Trigger (no Dialog.Root — must be nested inside one) ─── */
export function ProjectCard({ project }: { project: Project }) {
  return (
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
            <div className="mb-4 overflow-hidden border-2 border-border bg-background w-full shrink-0">
              <div className="h-full w-full transform-gpu transition-transform duration-300 group-hover:scale-[1.02]">
                <ProjectPreview project={project} />
              </div>
            </div>

            {/* Title (Single line truncate) */}
            <h3 className="font-display items-center flex text-xl leading-none tracking-normal sm:text-2xl text-foreground group-hover:text-[var(--accent-to)] transition-colors duration-150 truncate shrink-0">
              {project.name}
              {project.featured ? (
                <span className="inline-flex items-center ml-2 gap-1.5 border border-[var(--accent-to)] bg-[var(--accent-to)]/10 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-[var(--accent-to)] truncate">
                  AAST Graduation project
                </span>
              ) : (
                <></>
              )}
            </h3>

            {/* Description (Fixed line-clamp-2 h-10) */}
            <p className="project-card-blurb mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2 h-10 overflow-hidden shrink-0">
              {project.shortBlurb ?? project.blurb}
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
