import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { SECTIONS, type SectionId } from "./sections";

interface NavProps {
  theme: "dark" | "light";
  onToggle: () => void;
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function Nav({ theme, onToggle, active, onNavigate }: NavProps) {
  const links = SECTIONS.filter((s) => s.id !== "home");

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-mono text-sm tracking-tight"
        >
          <span className="font-display inline-flex h-7 w-7 items-center justify-center rounded-none border border-border bg-card text-[13px] pixel-shadow-sm">
            <span className="text-foreground">m</span>
            <span className="text-gradient">u</span>
          </span>
          <span className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline">
            helmy.dev
          </span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="mr-1 flex items-center gap-0.5">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <button
                    onClick={() => onNavigate(l.id)}
                    className={`relative rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors sm:text-xs ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
      </nav>
    </motion.header>
  );
}
