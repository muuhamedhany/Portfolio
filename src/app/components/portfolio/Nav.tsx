import { motion } from "motion/react";
import { Code2, FolderKanban, Home, Mail, type LucideIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SECTIONS, type SectionId } from "./sections";

interface NavProps {
  theme: "dark" | "light";
  onToggle: () => void;
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  home: Home,
  projects: FolderKanban,
  skills: Code2,
  contact: Mail,
};

export function Nav({ theme, onToggle, active, onNavigate }: NavProps) {
  return (
    <motion.nav
      aria-label="Primary navigation"
      initial={{ y: 64, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-1/2 z-50"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-1 border-2 border-border bg-card p-1.5 pixel-shadow">
        <ul className="flex items-center gap-1">
          {SECTIONS.map((section) => {
            const Icon = SECTION_ICONS[section.id];
            const isActive = active === section.id;

            return (
              <li key={section.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onNavigate(section.id)}
                      aria-label={`Go to ${section.label}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative grid h-11 w-11 place-items-center overflow-hidden border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                        isActive
                          ? "text-white"
                          : "text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 bg-gradient-accent"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <Icon className="relative h-5 w-5" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={10}
                    className="rounded-none border border-border bg-card font-mono text-[10px] uppercase tracking-[0.18em] text-foreground pixel-shadow-sm [&>svg]:bg-card [&>svg]:fill-card"
                  >
                    {section.label}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>

        <span aria-hidden="true" className="mx-0.5 h-7 w-px bg-border" />
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>
    </motion.nav>
  );
}
