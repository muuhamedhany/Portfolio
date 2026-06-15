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
      className="pixel-nav-control relative grid h-11 w-11 place-items-center text-muted-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.12, ease: "linear" }}
        className="grid place-items-center"
      >
        {theme === "dark" ? <Sun className="h-[18px] w-[18px]" strokeWidth={2.5} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={2.5} />}
      </motion.span>
    </button>
  );
}
