import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Clock, Activity, MapPin } from "lucide-react";
import type { SectionId } from "./sections";

interface HeroStatusCapsuleProps {
  onNavigate?: (id: SectionId) => void;
}

export function HeroStatusCapsule({ onNavigate }: HeroStatusCapsuleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [cairoTime, setCairoTime] = useState<string>("");

  useEffect(() => {
    const updateCairoTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Africa/Cairo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setCairoTime(formatter.format(new Date()));
      } catch {
        // Fallback to local time if timezone string fails
        const now = new Date();
        setCairoTime(now.toLocaleTimeString());
      }
    };

    updateCairoTime();
    const interval = setInterval(updateCairoTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mb-4 sm:mb-6 flex justify-center w-full max-w-[calc(100vw-1.5rem)] sm:max-w-max mx-auto z-30"
    >
      <motion.div
        layout
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsHovered((prev) => !prev);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isHovered}
        aria-label="Status indicator. Click or hover for local time and details."
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="group relative inline-flex items-center cursor-pointer select-none rounded-full border border-primary/25 bg-card/85 p-1 sm:p-1.5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.18)] hover:border-primary/50 hover:bg-card/95 transition-colors duration-200 max-w-full"
      >
        {/* Ambient status neon glow backdrop */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-primary/20 to-emerald-500/20 opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />

        {/* Primary status badge content */}
        <motion.div layout className="relative flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-foreground shrink-0">
          {/* Radar Pulsing Dot */}
          <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 items-center justify-center shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
          </span>

          <span className="font-semibold text-foreground whitespace-nowrap">Available for Work</span>

          {/* Expand Indicator Chevron / Pulse tag */}
          <motion.span
            layout
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-muted-foreground/60 group-hover:text-primary transition-colors shrink-0"
          >
            <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.span>
        </motion.div>

        {/* Expanded Drawer Info */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, width: 0, scale: 0.95 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="overflow-hidden flex items-center shrink-0 max-w-full"
            >
              {/* Divider */}
              <span className="h-3.5 sm:h-4 w-[1px] bg-border/80 mx-1 sm:mx-1.5 shrink-0" />

              <div className="flex items-center gap-2 sm:gap-3.5 pr-1.5 sm:pr-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                {/* Live Cairo Clock */}
                <span className="flex items-center gap-1 sm:gap-1.5 text-foreground/90 font-medium">
                  <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-primary shrink-0" />
                  <span>{cairoTime || "CAIRO"}</span>
                </span>

                {/* Location Badge */}
                <span className="hidden sm:flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Cairo (UTC+3)</span>
                </span>

                {/* Quick Hire Me CTA */}
                {onNavigate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("contact");
                    }}
                    className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-primary/20 px-2 sm:px-2.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 shrink-0"
                  >
                    <span>Get in Touche</span>
                    <ArrowUpRight className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
