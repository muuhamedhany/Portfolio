import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import folderIcon from "@iconify-icons/pixelarticons/folder";
import homeIcon from "@iconify-icons/pixelarticons/home";
import mailIcon from "@iconify-icons/pixelarticons/mail";
import userIcon from "@iconify-icons/pixelarticons/user";
import { ThemeToggle } from "./ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SECTIONS, type SectionId } from "./sections";

interface NavProps {
  theme: "dark" | "light";
  onToggle: () => void;
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

type PixelNavIcon = typeof homeIcon;

const SECTION_ICONS: Record<SectionId, PixelNavIcon> = {
  home: homeIcon,
  projects: folderIcon,
  about: userIcon,
  contact: mailIcon,
};

export function Nav({ theme, onToggle, active, onNavigate }: NavProps) {
  return (
    <motion.nav
      aria-label="Primary navigation"
      initial={{ y: 16, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 0.22, ease: "linear" }}
      className="fixed left-1/2 z-50"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="pixel-dock">
        <div className="pixel-dock-surface flex items-center gap-1 p-1.5">
          <ul className="flex items-center gap-1">
            {SECTIONS.map((section) => {
              const icon = SECTION_ICONS[section.id];
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
                        data-active={isActive}
                        className="pixel-nav-control relative grid h-11 w-11 place-items-center overflow-hidden text-muted-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {isActive && (
                          <span aria-hidden="true" className="absolute bottom-1 right-1 h-1.5 w-1.5 bg-white/70" />
                        )}
                        <Icon icon={icon} className="pixel-nav-icon relative h-5 w-5" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={10}
                      className="pixel-tooltip px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] [&>svg]:hidden"
                    >
                      {section.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>

          <span aria-hidden="true" className="mx-0.5 h-8 w-0.5 bg-[var(--pixel-frame)] opacity-60" />
          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
      </div>
    </motion.nav>
  );
}
