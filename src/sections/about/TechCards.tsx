import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { CORE_TECH_STACK, type CoreTech } from "@/sections/about/aboutData";

export function TechCards() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full select-none">
      {/* ── Subheader Bar ── */}
      <div className="mb-4 flex items-center justify-between pb-2 border-b border-border/70 text-muted-foreground">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-foreground">
          <Layers className="h-3.5 w-3.5 text-[var(--accent-to)]" />
          <span>CORE TECHNICAL ARSENAL</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
          [ 06 PRIMARY DISCIPLINES ]
        </div>
      </div>

      {/* ── 6-Column Minimalist Editorial Monogram Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {CORE_TECH_STACK.map((tech: CoreTech, idx: number) => {
          const Icon = tech.Icon;
          const isHovered = hoveredId === tech.id;

          return (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.04 * idx,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHoveredId(tech.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative flex flex-col justify-between overflow-hidden border-2 border-border bg-card p-4 sm:p-5 text-card-foreground shadow-[3px_3px_0_var(--pixel-shadow)] transition-all duration-150 cursor-pointer hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--pixel-shadow)] hover:border-[var(--skill-color)]"
              style={
                {
                  "--skill-color": tech.color,
                  clipPath:
                    "polygon(0 5px, 5px 5px, 5px 0, calc(100% - 5px) 0, calc(100% - 5px) 5px, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 5px calc(100% - 5px), 0 calc(100% - 5px))",
                } as CSSProperties
              }
            >
              {/* Inner bevel overlay */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_1px_1px_0_var(--pixel-edge-light),inset_-1px_-1px_0_var(--pixel-edge-dark)] z-20" />

              {/* Background ambient watermark glyph on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -bottom-4 opacity-0 scale-75 transition-all duration-300 ease-out group-hover:opacity-[0.08] group-hover:scale-125 z-0"
              >
                <Icon className="h-32 w-32 text-foreground" />
              </div>

              {/* Top Row: Corner Accent Tile */}
              <div className="flex items-center justify-end relative z-10">
                <span className="w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-[var(--skill-color)] group-hover:shadow-[0_0_8px_var(--skill-color)] transition-all" />
              </div>

              {/* Center: Hero Monogram Brand Glyph */}
              <div className="my-6 sm:my-8 flex items-center justify-center relative z-10">
                <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center border border-border/70 bg-background/60 p-3 shadow-[2px_2px_0_var(--pixel-shadow)] transition-all duration-200 group-hover:scale-110 group-hover:border-[var(--skill-color)] group-hover:bg-[var(--pixel-field)]">
                  <Icon
                    className="h-8 w-8 sm:h-9 sm:w-9 text-foreground/80 transition-all duration-200 group-hover:text-[var(--skill-color)] group-hover:drop-shadow-[0_0_12px_var(--skill-color)]"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Bottom Row: High-Fashion Display Name */}
              <div className="relative z-10 text-center border-t border-border/50 pt-2.5">
                <h3 className="font-display text-xl sm:text-2xl tracking-normal text-foreground group-hover:text-[var(--accent-to)] transition-colors">
                  {tech.name}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
