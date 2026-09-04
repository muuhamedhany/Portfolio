import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Icon } from "@iconify/react";
import codeIcon from "@iconify-icons/pixelarticons/code";
import folderIcon from "@iconify-icons/pixelarticons/folder";
import homeIcon from "@iconify-icons/pixelarticons/home";
import mailIcon from "@iconify-icons/pixelarticons/mail";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SECTIONS } from "@/lib/constants/sections";
import type { SectionId } from "@/lib/constants/sections";
import { KeyRound, ShieldCheck, FileText } from "lucide-react";
import { useAdminAuth } from "@/lib/context/AdminAuthContext";

interface NavProps {
  theme: "dark" | "light";
  onToggle: (e?: React.MouseEvent) => void;
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  onOpenCvModal?: () => void;
}

type PixelNavIcon = typeof homeIcon;

const SECTION_ICONS: Record<SectionId, PixelNavIcon> = {
  home: homeIcon,
  projects: folderIcon,
  stack: codeIcon,
  contact: mailIcon,
};

interface NavItemProps {
  section: (typeof SECTIONS)[number];
  isActive: boolean;
  isHint: boolean;
  onNavigate: (id: SectionId) => void;
}

function NavItem({ section, isActive, isHint, onNavigate }: NavItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const icon = SECTION_ICONS[section.id];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const distanceX = e.clientX - (left + width / 2);
    const distanceY = e.clientY - (top + height / 2);

    x.set(Math.max(-5, Math.min(5, distanceX * 0.22)));
    y.set(Math.max(-5, Math.min(5, distanceY * 0.22)));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const isTooltipOpen = !isActive && (isHovered || isHint);

  const buttonContent = (
    <motion.button
      type="button"
      layout
      onClick={() => onNavigate(section.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      aria-label={`Go to ${section.label}`}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      className={`pixel-nav-control relative flex h-10 sm:h-11 items-center justify-center overflow-hidden focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer transition-all duration-200 ${isActive ? "px-2.5 sm:px-3.5 gap-2 sm:gap-2.5 text-white" : "w-10 sm:w-11 text-muted-foreground"
        }`}
    >
      {/* Animated active background pill using layoutId */}
      {isActive && (
        <motion.div
          layoutId="activeNavPill"
          className="pixel-nav-active-bg absolute inset-0 z-0"
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        />
      )}

      {/* Icon with hover bounce & random hint pulse */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        whileHover={{ y: -2, scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        animate={isHint ? { y: [-2, 0, -2, 0], scale: [1.1, 1, 1.1, 1] } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
      >
        <Icon icon={icon} className="pixel-nav-icon h-5 w-5 shrink-0" aria-hidden="true" />
      </motion.div>

      {/* Expandable text label for active item */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="hidden sm:block relative z-10 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            {section.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  return (
    <motion.li
      ref={ref}
      layout
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {isActive ? (
        buttonContent
      ) : (
        <Tooltip open={isTooltipOpen}>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={10}
            className="pixel-tooltip px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] [&>svg]:hidden"
          >
            {section.label}
          </TooltipContent>
        </Tooltip>
      )}
    </motion.li>
  );
}

export function Nav({ theme, onToggle, active, onNavigate, onOpenCvModal }: NavProps) {
  const [hintSectionId, setHintSectionId] = useState<SectionId | null>(null);
  const [isDockHovered, setIsDockHovered] = useState(false);
  const { isAdmin, setIsLoginModalOpen } = useAdminAuth();

  useEffect(() => {
    if (isDockHovered) {
      setHintSectionId(null);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const scheduleNextHint = (delayMs: number) => {
      timer = setTimeout(() => {
        const inactiveSections = SECTIONS.filter((s) => s.id !== active);
        if (inactiveSections.length === 0) return;

        // Pick a random inactive section
        const randomIndex = Math.floor(Math.random() * inactiveSections.length);
        const chosenSection = inactiveSections[randomIndex];

        setHintSectionId(chosenSection.id);

        // Keep visible for exactly 3 seconds
        hideTimer = setTimeout(() => {
          setHintSectionId(null);
          // Schedule next hint after random interval (3s to 5.5s)
          const nextDelay = 3000 + Math.random() * 2500;
          scheduleNextHint(nextDelay);
        }, 3000);
      }, delayMs);
    };

    // Initial hint triggers 2.5 seconds after dock is idle
    scheduleNextHint(2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isDockHovered, active]);

  return (
    <motion.nav
      aria-label="Primary navigation"
      initial={{ y: 24, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      className="fixed left-1/2 z-50"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div
        className="pixel-dock"
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => setIsDockHovered(false)}
      >
        <div className="pixel-dock-surface flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5">
          <ul className="flex items-center gap-1 sm:gap-1.5">
            {SECTIONS.map((section) => (
              <NavItem
                key={section.id}
                section={section}
                isActive={active === section.id}
                isHint={hintSectionId === section.id}
                onNavigate={onNavigate}
              />
            ))}
          </ul>

          <span aria-hidden="true" className="mx-0.5 h-6 sm:h-8 w-0.5 bg-[var(--pixel-frame)] opacity-60 shrink-0" />
          <ThemeToggle theme={theme} onToggle={onToggle} />

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                onClick={onOpenCvModal}
                aria-label="Fast Report"
                className="pixel-nav-control relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center overflow-hidden transition-all duration-200 cursor-pointer text-muted-foreground hover:text-foreground"
                whileHover={{ y: -2, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <FileText className="h-4 w-4" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={10}
              className="pixel-tooltip px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] [&>svg]:hidden"
            >
              FAST REPORT
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                aria-label={isAdmin ? "Admin Console Active" : "Admin Login"}
                className={`pixel-nav-control relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center overflow-hidden transition-all duration-200 cursor-pointer ${
                  isAdmin ? "text-emerald-400 border-emerald-500/50" : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ y: -2, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                {isAdmin ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={10}
              className="pixel-tooltip px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] [&>svg]:hidden"
            >
              {isAdmin ? "ADMIN ACTIVE" : "ADMIN ACCESS"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.nav>
  );
}
