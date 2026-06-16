import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import moonIcon from "@iconify-icons/pixelarticons/moon";
import sunIcon from "@iconify-icons/pixelarticons/sun";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="pixel-nav-control relative grid h-11 w-11 place-items-center text-muted-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.12, ease: "linear" }}
        className="grid place-items-center"
      >
        <Icon icon={theme === "dark" ? sunIcon : moonIcon} className="pixel-nav-icon h-5 w-5" aria-hidden="true" />
      </motion.span>
    </button>
  );
}
