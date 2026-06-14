import { motion } from "motion/react";
import { Reveal } from "./Reveal";

const GROUPS = [
  { label: "Front-End", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "React Native", "Tailwind"] },
  { label: "Back-End", items: ["Node.js", "Express.js", "PHP"] },
  { label: "Database", items: ["PostgreSQL", "MySQL", "Supabase"] },
  { label: "Tools", items: ["Git", "Figma", "Framer Motion"] },
];

const TICKER = GROUPS.flatMap((g) => g.items);

function Marquee() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="relative overflow-hidden border-y border-border py-4">
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap font-display text-2xl tracking-normal sm:text-3xl"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8 text-muted-foreground">
            {item}
            <span className="text-[var(--accent-to)]">✦</span>
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export function Skills() {
  return (
    <section className="relative">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pb-16 pt-24 sm:px-8">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display tracking-normal" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 600 }}>
            Skills
          </h2>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">02 / Stack</span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Marquee />
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((group, gi) => (
          <Reveal key={group.label} delay={gi * 0.08}>
            <div className="group h-full rounded-none border-2 border-border bg-card p-5 pixel-shadow-sm transition-colors hover:border-[var(--accent-to)]">
              <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-[var(--accent-to)]">{String(gi + 1).padStart(2, "0")}</span>
                {group.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-none border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground/90 transition-colors group-hover:border-border"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
