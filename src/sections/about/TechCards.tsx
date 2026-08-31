import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { Terminal, Layers } from "lucide-react";
import { CORE_TECH_STACK, type CoreTech } from "@/sections/about/aboutData";

export function TechCards() {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* ── Section Subheader ── */}
      <div className="mb-4 flex items-center justify-between pb-2 border-b border-border/70">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-foreground">
          <Layers className="h-3.5 w-3.5 text-[var(--accent-to)]" />
          <span>CORE TECHNICAL ARSENAL</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Terminal className="h-3 w-3" />
          <span>Frontend & Design Ecosystem</span>
        </div>
      </div>

      {/* ── 6-Card Grid (2 columns on mobile, 3 columns on tablet/desktop) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {CORE_TECH_STACK.map((tech: CoreTech, idx: number) => {
          const Icon = tech.Icon;
          const isActive = activeTech === tech.id;

          return (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.05 * idx,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setActiveTech(tech.id)}
              onMouseLeave={() => setActiveTech(null)}
              className="group relative flex flex-col justify-between border-2 border-border bg-card p-3 sm:p-4 text-card-foreground shadow-[3px_3px_0_var(--pixel-shadow)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--pixel-shadow)] hover:border-[var(--skill-color)]"
              style={
                {
                  "--skill-color": tech.color,
                  clipPath:
                    "polygon(0 5px, 5px 5px, 5px 0, calc(100% - 5px) 0, calc(100% - 5px) 5px, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 5px calc(100% - 5px), 0 calc(100% - 5px))",
                } as CSSProperties
              }
            >
              {/* Inner bevel overlay */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_1px_1px_0_var(--pixel-edge-light),inset_-1px_-1px_0_var(--pixel-edge-dark)]" />

              {/* Top Row: Category tag + Level indicator */}
              <div className="flex items-center justify-between gap-1 relative z-10">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground px-1.5 py-0.5 border border-border/80 bg-[var(--pixel-field)] group-hover:border-[var(--skill-color)]/50 group-hover:text-foreground transition-colors">
                  {tech.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-none bg-muted-foreground/40 group-hover:bg-[var(--skill-color)] group-hover:shadow-[0_0_6px_var(--skill-color)] transition-all" />
              </div>

              {/* Center: Large Brand Icon & Name */}
              <div className="my-3 sm:my-4 flex flex-col items-center text-center relative z-10">
                <div className="relative mb-2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center border border-border/80 bg-background/80 p-2 shadow-[2px_2px_0_var(--pixel-shadow)] transition-transform duration-200 group-hover:scale-110 group-hover:border-[var(--skill-color)]">
                  <Icon
                    className="h-7 w-7 sm:h-8 sm:w-8 text-foreground/75 transition-all duration-200 group-hover:text-[var(--skill-color)] group-hover:drop-shadow-[0_0_8px_var(--skill-color)]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-display text-lg sm:text-xl tracking-normal text-foreground group-hover:text-[var(--accent-to)] transition-colors">
                  {tech.name}
                </h3>
              </div>

              {/* Bottom: Description & Meta */}
              <div className="relative z-10 border-t border-border/60 pt-2 text-center">
                <p className="font-mono text-[9px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {tech.description}
                </p>
                <div className="mt-1.5 font-mono text-[8.5px] uppercase tracking-wider text-[var(--accent-to)] font-semibold">
                  {tech.level}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
