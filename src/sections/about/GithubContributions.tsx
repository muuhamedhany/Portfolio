import { useEffect, useState, useRef } from "react";
import { Activity, ChevronLeft, ChevronRight, Github, Sparkles } from "lucide-react";
import type { GitHubContributionsResponse, ContributionDay } from "../../../server/github";
import { generateFallbackContributions } from "../../../server/github";

const USERNAME = "muuhamedhany";
const AVAILABLE_YEARS = [2026, 2025, 2024];

export function GithubContributions() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [data, setData] = useState<GitHubContributionsResponse>(() =>
    generateFallbackContributions(USERNAME, 2026)
  );
  const [loading, setLoading] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch GitHub contribution data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/github/contributions?username=${USERNAME}&year=${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((json: GitHubContributionsResponse) => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((_err) => {
        if (isMounted) {
          setData(generateFallbackContributions(USERNAME, selectedYear));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Scroll to recent months on initial load
  useEffect(() => {
    if (scrollRef.current) {
      const isCurrentYear = selectedYear === new Date().getFullYear();
      if (isCurrentYear) {
        const targetScroll = Math.max(0, scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
        scrollRef.current.scrollTo({ left: targetScroll * 0.7, behavior: "smooth" });
      } else {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  }, [selectedYear]);

  const changeYear = (delta: number) => {
    const currentIndex = AVAILABLE_YEARS.indexOf(selectedYear);
    const newIndex = currentIndex - delta;
    if (newIndex >= 0 && newIndex < AVAILABLE_YEARS.length) {
      setSelectedYear(AVAILABLE_YEARS[newIndex]);
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
            disabled={!hasPrev}
            aria-label="Previous year"
            className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.14em] text-foreground min-w-[3.5rem] text-center">
            {selectedYear}
          </span>
          <button
            type="button"
            onClick={() => changeYear(-1)}
            disabled={!hasNext}
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
      <div className="relative mt-2">
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto pt-6 pb-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
        >
          <div className="min-w-[760px] px-12 flex flex-col gap-1.5">
            
            {/* Month labels */}
            <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] text-[10px] font-mono text-muted-foreground uppercase tracking-widest pl-0.5 select-none mb-1">
              {data.months.map((m, idx) => (
                <div
                  key={`${m.name}-${idx}`}
                  style={{ gridColumnStart: m.weekIndex + 1 }}
                  className="truncate text-left"
                >
                  {m.name}
                </div>
              ))}
            </div>

            {/* 7-Row Grid of Weeks (Zero border-radius, hard pixel borders & bevels) */}
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
                        className={`aspect-square w-full cursor-pointer rounded-none relative transition-transform duration-75 ease-out ${cellColorClass} ${
                          isHovered
                            ? "scale-[1.3] z-40 !border-2 !border-white !shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_rgba(0,0,0,0.8),0_0_16px_#38bdf8] ring-1 ring-cyan-400"
                            : "hover:scale-110 hover:z-10"
                        }`}
                      >
                        {/* ── Direct Cell-Anchored Floating Tooltip (100% Perfectly Centered on this Cell) ── */}
                        {isHovered && (
                          <div
                            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none ${
                              isTopHalf ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
                            }`}
                          >
                            {/* Upward notch pointer (when tooltip is below cell) */}
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

                            {/* Downward notch pointer (when tooltip is above cell) */}
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
