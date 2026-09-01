import { motion } from "motion/react";
import { Reveal } from "@/components/shared/Reveal";
import { GithubContributions } from "@/sections/about/GithubContributions";
import { TechCards } from "@/sections/about/TechCards";
import { SOCIALS } from "@/sections/about/aboutData";

export function Stack() {
  return (
    <section className="relative min-h-svh w-full flex flex-col justify-center overflow-x-hidden">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-8 sm:py-20 lg:py-24">
        
        {/* ── Section Header ── */}
        <Reveal variant="pixel" gridCols={12} gridRows={2}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              
              <h2
                className="font-display tracking-normal text-foreground leading-none"
                style={{ fontSize: "clamp(2rem, 5.5vw, 3.2rem)" }}
              >
                STACK
              </h2>
            </div>
          </div>
        </Reveal>

        {/* ── Main Layout: GitHub Contributions Heatmap on top, Curated Tech Arsenal below ── */}
        <div className="flex flex-col gap-6 sm:gap-8 w-full">
          
          {/* Top: GitHub Contribution Activity */}
          <Reveal variant="pixel" delay={0.08} gridCols={10} gridRows={4}>
            <GithubContributions />
          </Reveal>

          {/* Bottom: Curated Core Tech Stack */}
          <Reveal variant="pixel" delay={0.16} gridCols={12} gridRows={3}>
            <TechCards />
          </Reveal>

          {/* ── Compact Centered Social Links Footer Strip ── */}
          <Reveal variant="pixel" delay={0.22}>
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-border/60">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border bg-card px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] font-medium text-foreground pixel-btn hover:border-foreground/40 hover:text-[var(--accent-to)] transition-colors duration-150 shadow-[2px_2px_0_var(--pixel-shadow)]"
                    aria-label={social.label}
                    style={{
                      clipPath:
                        "polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))",
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

export const About = Stack;
