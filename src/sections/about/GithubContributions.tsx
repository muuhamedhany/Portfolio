import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ChevronLeft, ChevronRight, Github, Loader2 } from "lucide-react";
import type { GitHubContributionsResponse, ContributionDay } from "../../../server/github";
import { generateFallbackContributions } from "../../../server/github";

const USERNAME = "muuhamedhany";
const AVAILABLE_YEARS = [2026, 2025, 2024];

export function GithubContributions() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Client-side cache to make year switching instantaneous
  const clientCache = useRef<Record<number, GitHubContributionsResponse>>({
    2026: generateFallbackContributions(USERNAME, 2026),
    2025: generateFallbackContributions(USERNAME, 2025),
    2024: generateFallbackContributions(USERNAME, 2024),
  });

  const [data, setData] = useState<GitHubContributionsResponse>(
    () => clientCache.current[2026]
  );
  const [isFetching, setIsFetching] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch live contribution data from server
  const fetchContributions = useCallback(async (year: number) => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/github/contributions?username=${USERNAME}&year=${year}`);
      if (!res.ok) throw new Error("Failed");
      const json: GitHubContributionsResponse = await res.json();
      clientCache.current[year] = json;
      setData(json);
    } catch (_err) {
      // Fallback
      if (!clientCache.current[year]) {
        clientCache.current[year] = generateFallbackContributions(USERNAME, year);
      }
      setData(clientCache.current[year]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    // If year data is already in client cache, show it immediately
    if (clientCache.current[selectedYear]) {
      setData(clientCache.current[selectedYear]);
    }
    fetchContributions(selectedYear);
  }, [selectedYear, fetchContributions]);

  // Adjust scroll position on year change
  useEffect(() => {
    if (scrollRef.current) {
      const isCurrentYear = selectedYear === new Date().getFullYear();
      if (isCurrentYear) {
        const targetScroll = Math.max(0, scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
        scrollRef.current.scrollTo({ left: targetScroll * 0.75, behavior: "smooth" });
      } else {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  }, [selectedYear]);

  const changeYear = (delta: number) => {
    if (isFetching) return;
    const currentIndex = AVAILABLE_YEARS.indexOf(selectedYear);
    const newIndex = currentIndex - delta;
    if (newIndex >= 0 && newIndex < AVAILABLE_YEARS.length) {
      const targetYear = AVAILABLE_YEARS[newIndex];
      setSelectedYear(targetYear);
      if (clientCache.current[targetYear]) {
        setData(clientCache.current[targetYear]);
      }
    }
  };

  const hasPrev = selectedYear < AVAILABLE_YEARS[0];
  const hasNext = selectedYear > AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1];

  // Helper for pixelated voxel cell color classes with crisp bevel edges & 0px radius
  const getCellColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return "bg-[#0b0d13] dark:bg-[#07080d] border border-[#1e1c29]/60 shadow-[inset_1px_1px_0_rgba(255,255,255,0.03),inset_-1px_-1px_0_rgba(0,0,0,0.65)]";
      case 1:
        return "bg-[#122b4d] border border-[#1f4273] shadow-[inset_1px_1px_0_rgba(255,255,255,0.22),inset_-1px_-1px_0_rgba(0,0,0,0.5)]";
      case 2:
        return "bg-[#1a4b87] border border-[#2b6fc4] shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),inset_-1px_-1px_0_rgba(0,0,0,0.45)]";
      case 3:
        return "bg-[#2563eb] border border-[#60a5fa] shadow-[inset_1px_1px_0_rgba(255,255,255,0.5),inset_-1px_-1px_0_rgba(0,0,0,0.4),0_0_8px_rgba(37,99,235,0.4)]";
      case 4:
        return "bg-[#38bdf8] border border-[#bae6fd] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#0284c7,0_0_12px_rgba(56,189,248,0.7)] text-white";
    }
  };

  // Format date helper (e.g. "AUG 15, 2026")
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  };

  const totalWeeks = data.weeks.length;

  return (
    <div
      className="relative w-full border-2 border-[var(--pixel-frame)] bg-card p-4 sm:p-6 shadow-[4px_4px_0_var(--pixel-shadow)] select-none"
      style={{
        clipPath:
          "polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))",
      }}
    >
      {/* ── Subheader: Contributions summary, Year Selector, and Username ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-1">
        {/* Total Contributions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center border border-[var(--pixel-frame)] bg-[var(--pixel-field)] text-foreground shadow-[2px_2px_0_var(--pixel-shadow)]">
            <Github className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-sm sm:text-base font-bold text-foreground tracking-tight">
              {data.totalContributions.toLocaleString()}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-widest">
              contributions
            </span>
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2 border border-[var(--pixel-frame)] bg-background px-2.5 py-1 shadow-[2px_2px_0_var(--pixel-shadow)]">
          <button
            type="button"
            onClick={() => changeYear(1)}
            disabled={!hasPrev || isFetching}
            aria-label="Previous year"
            className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center justify-center min-w-[3.5rem] gap-1 font-mono text-xs sm:text-sm font-bold tracking-[0.14em] text-foreground">
            {isFetching && <Loader2 className="h-3 w-3 animate-spin text-[var(--accent-to)]" />}
            <span>{selectedYear}</span>
          </div>

          <button
            type="button"
            onClick={() => changeYear(-1)}
            disabled={!hasNext || isFetching}
            aria-label="Next year"
            className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Username link */}
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs sm:text-sm font-bold tracking-[0.15em] text-[var(--accent-to)] hover:text-foreground hover:underline transition-colors flex items-center gap-1.5"
        >
          <span>@{USERNAME.toUpperCase()}</span>
          <span className="text-[10px] opacity-70">↗</span>
        </a>
      </div>

      {/* ── Heatmap Matrix Area with horizontal scroll on small screens ── */}
      <div className="relative mt-2 min-h-[175px] flex flex-col justify-center">
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto pt-5 pb-7 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
        >
          <div className="min-w-[760px] px-12 flex flex-col gap-1.5">

            {/* Animated Grid Container for Smooth Year Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`year-grid-${selectedYear}`}
                initial={{ opacity: 0.4, scale: 0.995 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4, scale: 0.995 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-col gap-1.5"
              >
                {/* Month labels aligned dynamically with total weeks in that year */}
                <div
                  className="grid text-[10.5px] font-mono text-muted-foreground uppercase tracking-wider pl-20 select-none mb-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))`,
                  }}
                >
                  {data.months.map((m, idx) => (
                    <div
                      key={`${m.name}-${idx}`}
                      style={{ gridColumn: `${m.weekIndex + 1} / span 4` }}
                      className="text-left whitespace-nowrap overflow-visible font-semibold"
                    >
                      {m.name.slice(0, 3).toUpperCase()}
                    </div>
                  ))}
                </div>

                {/* 7-Row Grid of Weeks */}
                <div className="flex gap-[3px]">
                  {data.weeks.map((week, weekIdx) => (
                    <div key={`week-${weekIdx}`} className="flex flex-col gap-[3px] flex-1">
                      {week.days.map((day, dayIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={`empty-${weekIdx}-${dayIdx}`}
                              className="aspect-square w-full opacity-0 pointer-events-none rounded-none"
                            />
                          );
                        }

                        const isHovered = hoveredDate === day.date;
                        const isTopHalf = day.weekday <= 2;
                        const cellColorClass = getCellColor(day.level);

                        return (
                          <div
                            key={day.date}
                            onMouseEnter={() => setHoveredDate(day.date)}
                            onMouseLeave={() => setHoveredDate(null)}
                            className={`aspect-square w-full cursor-pointer rounded-none relative transition-transform duration-75 ease-out ${cellColorClass} ${isHovered
                              ? "scale-[1.3] z-40 !border-2 !border-white !shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_rgba(0,0,0,0.8),0_0_16px_#38bdf8] ring-1 ring-cyan-400"
                              : "hover:scale-110 hover:z-10"
                              }`}
                          >
                            {/* Direct Cell-Anchored Floating Tooltip */}
                            {isHovered && (
                              <div
                                className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none ${isTopHalf ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
                                  }`}
                              >
                                {/* Upward notch pointer */}
                                {isTopHalf && (
                                  <div className="w-2.5 h-2.5 bg-[var(--foreground)] rotate-45 mb-[-5px] shadow-[0_-1px_0_var(--pixel-frame)] z-10" />
                                )}

                                {/* Tooltip Badge */}
                                <div
                                  className="border-2 border-[var(--pixel-frame)] bg-[var(--foreground)] px-3 py-1.5 text-[var(--background)] shadow-[3px_3px_0_var(--pixel-shadow)] whitespace-nowrap text-center font-mono text-[10.5px] tracking-wider uppercase font-bold flex items-center gap-1.5"
                                  style={{
                                    clipPath:
                                      "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
                                  }}
                                >
                                  <span className="text-[var(--accent-to)] font-extrabold">
                                    {day.count === 0 ? "NO" : day.count}{" "}
                                    {day.count === 1 ? "CONTRIBUTION" : "CONTRIBUTIONS"}
                                  </span>
                                  <span className="opacity-40 font-normal">|</span>
                                  <span className="font-semibold text-[var(--background)]">
                                    {formatDate(day.date)}
                                  </span>
                                </div>

                                {/* Downward notch pointer */}
                                {!isTopHalf && (
                                  <div className="w-2.5 h-2.5 bg-[var(--foreground)] rotate-45 mt-[-5px] shadow-[1px_1px_0_var(--pixel-shadow)] z-10" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* ── Footer Row: Pixelated Legend (Less -> More) & Status ── */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/80">

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className={`w-3.5 h-3.5 rounded-none ${getCellColor(0)}`} />
            <span className={`w-3.5 h-3.5 rounded-none ${getCellColor(1)}`} />
            <span className={`w-3.5 h-3.5 rounded-none ${getCellColor(2)}`} />
            <span className={`w-3.5 h-3.5 rounded-none ${getCellColor(3)}`} />
            <span className={`w-3.5 h-3.5 rounded-none ${getCellColor(4)}`} />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
