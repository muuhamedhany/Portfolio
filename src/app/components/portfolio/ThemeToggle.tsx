import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Icon } from "@iconify/react";
import moonIcon from "@iconify-icons/pixelarticons/moon";
import sunIcon from "@iconify-icons/pixelarticons/sun";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const distanceX = e.clientX - (left + width / 2);
    const distanceY = e.clientY - (top + height / 2);

    x.set(Math.max(-4, Math.min(4, distanceX * 0.2)));
    y.set(Math.max(-4, Math.min(4, distanceY * 0.2)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            onClick={onToggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="pixel-nav-control relative grid h-11 w-11 place-items-center text-muted-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -120, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="grid place-items-center"
            >
              <Icon
                icon={theme === "dark" ? sunIcon : moonIcon}
                className="pixel-nav-icon h-5 w-5"
                aria-hidden="true"
              />
            </motion.span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={10}
          className="pixel-tooltip px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] [&>svg]:hidden"
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}

