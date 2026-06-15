import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

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
      className="relative grid h-11 w-11 place-items-center rounded-none border border-transparent bg-card text-foreground transition-colors pixel-press hover:border-[var(--accent-to)] hover:text-[var(--accent-to)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="grid place-items-center"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.span>
    </button>
  );
}
