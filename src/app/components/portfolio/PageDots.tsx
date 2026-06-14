import { motion } from "motion/react";
import { SECTIONS, type SectionId } from "./sections";

interface PageDotsProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function PageDots({ active, onNavigate }: PageDotsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 sm:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            aria-label={`Go to ${s.label}`}
            className="group flex items-center gap-2"
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive ? "text-foreground opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <span className="relative grid place-items-center">
              <span
                className={`h-2 w-2 rounded-none transition-colors ${
                  isActive ? "bg-transparent" : "bg-muted-foreground/50 group-hover:bg-foreground"
                }`}
              />
              {isActive && (
                <motion.span
                  layoutId="dot-active"
                  className="absolute h-3 w-3 rounded-none bg-gradient-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
