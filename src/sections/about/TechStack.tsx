import { type CSSProperties } from "react";
import { TECH_STACK, TECH_ICONS } from "@/sections/about/aboutData";

export function TechStack() {
  const row = [...TECH_STACK, ...TECH_STACK];

  return (
    <aside aria-labelledby="about-tech-heading" className="about-tech-stack order-1">
      <h3 id="about-tech-heading" className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Tech Stack
      </h3>
      <div className="about-tech-marquee mt-5" aria-label="Technology stack">
        <div className="about-tech-marquee-track">
          {row.map((tech, i) => {
            const { Icon, color } = TECH_ICONS[tech];
            const isDuplicate = i >= TECH_STACK.length;

            return (
              <span
                key={`${tech}-${i}`}
                className="about-tech-chip"
                style={{ "--skill-color": color } as CSSProperties}
                tabIndex={isDuplicate ? -1 : 0}
                role={isDuplicate ? undefined : "img"}
                aria-hidden={isDuplicate ? "true" : undefined}
                aria-label={isDuplicate ? undefined : tech}
              >
                <Icon className="about-tech-glyph" aria-hidden="true" />
                <span className="about-tech-label" aria-hidden="true">
                  {tech}
                </span>
              </span>
            );
          })}
        </div>
        <div className="about-tech-fade about-tech-fade-start pointer-events-none" />
        <div className="about-tech-fade about-tech-fade-end pointer-events-none" />
      </div>
    </aside>
  );
}
