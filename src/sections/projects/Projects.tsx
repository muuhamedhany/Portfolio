import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, ChevronDown, Check, X } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { ProjectCardWithDialog } from "@/sections/projects/ProjectCard";
import { CATEGORIES, PROJECTS } from "@/sections/projects/projectsData";
import type { ProjectCategory } from "@/sections/projects/projectsData";

export function Projects({ onProjectDialogOpenChange }: { onProjectDialogOpenChange?: (open: boolean) => void }) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  const activeCatObj = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];
  const activeCount =
    activeCategory === "all"
      ? PROJECTS.length
      : PROJECTS.filter((p) => p.category === activeCategory).length;

  return (
    <section className="relative">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 pb-24 pt-16 sm:px-8 sm:pb-24 sm:pt-16">
        {/* Section Header with Category Filter Bar */}
        <Reveal variant="pixel" gridCols={12} gridRows={2}>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
              SELECTED WORK
            </h2>

            {/* Desktop Category Filter Bar */}
            <div className="hidden sm:flex items-center gap-2 border-2 border-border bg-card p-1.5 shadow-[3px_3px_0_var(--pixel-shadow)]">
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
                    className={`relative font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-150 cursor-pointer px-3.5 py-1.5 ${
                      isActive
                        ? "text-[var(--pixel-active-foreground)] font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] shadow-[1px_1px_0_var(--pixel-shadow)]"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      {cat.label} ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Trigger Pill */}
            <div className="sm:hidden flex items-center w-full">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex w-full items-center justify-between gap-2 border-2 border-[var(--pixel-frame)] bg-card px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground shadow-[3px_3px_0_var(--pixel-shadow)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-[var(--accent-to)]" />
                  <span className="truncate">
                    FILTER: <span className="text-[var(--accent-to)]">{activeCatObj.label}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground font-semibold">({activeCount})</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Mobile Pixel Bottom Sheet Drawer */}
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm sm:hidden"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl border-t-2 border-x-2 border-[var(--pixel-frame)] bg-card p-5 shadow-[0_-8px_32px_rgba(0,0,0,0.8)] select-none sm:hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-to)]">
                    <SlidersHorizontal className="h-4 w-4" />
                    SELECT CATEGORY
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex h-7 w-7 items-center justify-center border border-[var(--pixel-frame)] bg-background text-foreground hover:bg-[var(--pixel-active)] hover:text-white transition-colors cursor-pointer"
                    aria-label="Close filter options"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Options List */}
                <div className="flex flex-col gap-2.5">
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
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setIsDrawerOpen(false);
                        }}
                        className={`flex items-center justify-between border-2 p-3.5 font-mono text-xs uppercase tracking-[0.16em] transition-all cursor-pointer ${
                          isActive
                            ? "border-[var(--pixel-frame)] bg-[var(--pixel-active)] text-white font-bold shadow-[2px_2px_0_var(--pixel-shadow)]"
                            : "border-border bg-background text-muted-foreground hover:border-[var(--pixel-frame)] hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                              isActive
                                ? "border-white bg-white/20 text-white"
                                : "border-border bg-transparent"
                            }`}
                          >
                            {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                          </span>
                          <span>{cat.label}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] font-bold ${
                            isActive ? "bg-white/20 text-white" : "bg-card text-muted-foreground border border-border"
                          }`}
                        >
                          {count} {count === 1 ? "PROJECT" : "PROJECTS"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
