import { motion } from "motion/react";
import { SECTIONS, type SectionId } from "./sections";

interface PageDotsProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function PageDots({ active, onNavigate }: PageDotsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35, duration: 0.2, ease: "linear" }}
      className="pixel-side-rail fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 sm:block"
    >
      <div className="pixel-side-rail-surface flex flex-col items-center gap-2 p-2">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onNavigate(s.id)}
              aria-label={`Go to ${s.label}`}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive}
              title={s.label}
              className="group grid h-7 w-7 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span
                aria-hidden="true"
                className={`pixel-progress-dot border ${
                  isActive
                    ? "h-4 w-4 border-[var(--pixel-active)] bg-[var(--pixel-active)]"
                    : "h-2.5 w-2.5 border-border bg-muted-foreground/30 group-hover:bg-muted-foreground/55"
                }`}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
