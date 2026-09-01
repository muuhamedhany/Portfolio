import { useState, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Layers } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import {
  CORE_TECH_STACK,
  TECH_CATEGORIES,
  type CoreTech,
  type TechCategory,
} from "@/sections/about/aboutData";

export function TechCards() {
  const [activeCategory, setActiveCategory] = useState<TechCategory>("frontend");
  const [hoveredTech, setHoveredTech] = useState<CoreTech | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse coordinates relative to the TechCards container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid 60fps cursor following
  const smoothX = useSpring(mouseX, { stiffness: 450, damping: 28 });
  const smoothY = useSpring(mouseY, { stiffness: 450, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setHoveredTech(null);
  };

  const filteredStack = CORE_TECH_STACK.filter((t) => t.category === activeCategory);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full select-none"
    >
      {/* ── Subheader Bar with Category Filter Dock ── */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/70 text-muted-foreground">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-foreground">
          <Layers className="h-3.5 w-3.5 text-[var(--accent-to)]" />
          <span>TECH STACK</span>
        </div>

        {/* Category Filter Dock matching Projects section */}
        <div className="flex items-center gap-1 border-2 border-border bg-card p-1 shadow-[3px_3px_0_var(--pixel-shadow)] w-fit">
          {TECH_CATEGORIES.map((cat) => {
            const count = CORE_TECH_STACK.filter((t) => t.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setHoveredTech(null);
                  setActiveCategory(cat.id);
                }}
                className={`relative font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] transition-all duration-150 cursor-pointer px-2.5 sm:px-3 py-1 ${isActive
                  ? "text-[var(--pixel-active-foreground)] font-bold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTechTabPill"
                    className="absolute inset-0 border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] shadow-[1px_1px_0_var(--pixel-shadow)]"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {cat.label} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filtered Icon Grid (Responsive: 2 cols on mobile, 3 on tablet, 5-6 on desktop) ── */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {filteredStack.map((tech: CoreTech, idx: number) => {
            const Icon = tech.Icon;

            return (
              <motion.div
                key={`${activeCategory}-${tech.id}`}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.25,
                  delay: 0.02 * idx,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full flex flex-col"
              >
                <Reveal
                  variant="pixel"
                  immediate
                  delay={idx * 0.03}
                  gridCols={4}
                  gridRows={3}
                  className="h-full flex flex-col"
                >
                  <div
                    onMouseEnter={() => setHoveredTech(tech)}
                    onMouseLeave={() => setHoveredTech(null)}
                    className="group relative flex h-28 sm:h-32 lg:h-36 w-full flex-col items-center justify-center overflow-hidden border-2 border-border bg-card p-3 sm:p-4 text-card-foreground shadow-[3px_3px_0_var(--pixel-shadow)] transition-all duration-150 cursor-pointer hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--pixel-shadow)] hover:border-[var(--skill-color)]"
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

                    {/* Ambient background watermark glyph on hover */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-3 -bottom-3 opacity-0 scale-75 transition-all duration-300 ease-out group-hover:opacity-[0.08] group-hover:scale-125 z-0"
                    >
                      <Icon className="h-28 w-28 text-foreground" />
                    </div>

                    {/* Top Right: Pixel Corner Accent Marker */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="block w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-[var(--skill-color)] transition-all" />
                    </div>

                    {/* Center: Large Official Brand Icon */}
                    <div className="relative z-10 flex items-center justify-center">
                      <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center border border-border/70 bg-background/60 p-3 shadow-[2px_2px_0_var(--pixel-shadow)] transition-all duration-200 group-hover:scale-110 group-hover:border-[var(--skill-color)] group-hover:bg-[var(--pixel-field)]">
                        <Icon
                          className="h-8 w-8 sm:h-9 sm:w-9 text-foreground/80 transition-all duration-200 group-hover:text-[var(--skill-color)]"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ── Unclipped Global Sticky Cursor Tooltip (Floats smoothly above mouse outside cards) ── */}
      <AnimatePresence>
        {hoveredTech && (
          <motion.div
            key="cursor-tooltip"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.08, ease: "easeOut" }}
            style={{
              left: smoothX,
              top: smoothY,
            }}
            className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full -mt-2.5 select-none whitespace-nowrap"
          >
            {/* Tooltip Content Box */}
            <div
              className="border-2 border-[var(--pixel-frame)] bg-[var(--foreground)] px-3 py-1.5 text-[var(--background)] shadow-[4px_4px_0_var(--pixel-shadow)] font-display text-base sm:text-lg tracking-wider uppercase font-bold flex items-center gap-2"
              style={{
                clipPath:
                  "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
              }}
            >
              <span
                className="w-2 h-2 rounded-none"
                style={{
                  backgroundColor:
                    hoveredTech.color === "var(--foreground)"
                      ? "var(--background)"
                      : hoveredTech.color,
                }}
              />
              <span
                style={{
                  color:
                    hoveredTech.color === "var(--foreground)"
                      ? "var(--background)"
                      : hoveredTech.color,
                }}
              >
                {hoveredTech.name}
              </span>
            </div>

            {/* Downward notch pointer pointing directly at mouse tip */}
            <div className="mx-auto w-2 h-2 bg-[var(--foreground)] rotate-45 -mt-1 shadow-[1px_1px_0_var(--pixel-shadow)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
