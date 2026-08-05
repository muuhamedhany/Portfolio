import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/shared/Reveal";
import { ProjectCardWithDialog } from "@/sections/projects/ProjectCard";
import { CATEGORIES, PROJECTS } from "@/sections/projects/projectsData";
import type { ProjectCategory } from "@/sections/projects/projectsData";

export function Projects({ onProjectDialogOpenChange }: { onProjectDialogOpenChange?: (open: boolean) => void }) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  return (
    <section className="relative">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 pb-24 pt-16 sm:px-8 sm:pb-24 sm:pt-16">
        {/* Section Header with Category Filter Bar */}
        <Reveal variant="pixel" gridCols={12} gridRows={2}>
          <div className="mb-6 flex items-start justify-between flex-col lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
              SELECTED WORK
            </h2>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 border-2 border-border bg-card p-1.5">
              {CATEGORIES.map((cat) => {
                const count =
                  cat.id === "all"
                    ? PROJECTS.length
                    : PROJECTS.filter((p) => p.category === cat.id).length;

                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-150 cursor-pointer ${isActive
                      ? "pixel-btn border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-[var(--pixel-active-foreground)] px-3 py-1.5 font-semibold"
                      : "border-2 border-border bg-card px-3 py-1.5 text-muted-foreground hover:border-[var(--pixel-frame)] hover:text-foreground"
                      }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Grid of Projects (Equal sizes & uniform heights) */}
        <motion.div layout className="project-grid items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col"
              >
                <Reveal variant="pixel" delay={(i % 2) * 0.08} gridCols={8} gridRows={5} className="h-full flex flex-col">
                  <ProjectCardWithDialog project={project} onProjectDialogOpenChange={onProjectDialogOpenChange} />
                </Reveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
