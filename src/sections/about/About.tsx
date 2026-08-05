import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { TechStack } from "@/sections/about/TechStack";
import { HERO_ROLES, SOCIALS } from "@/sections/about/aboutData";

function useTypewriter(words: string[]) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const currentWord = words[wordIndex];
    let delay = 72;
    if (phase === "holding") delay = 1150;
    if (phase === "deleting") delay = 42;
    if (phase === "deleting" && visibleCount === 0) delay = 220;

    const timeout = window.setTimeout(() => {
      if (phase === "typing") {
        if (visibleCount < currentWord.length) {
          setVisibleCount((count) => count + 1);
        } else {
          setPhase("holding");
        }
        return;
      }

      if (phase === "holding") {
        setPhase("deleting");
        return;
      }

      if (visibleCount > 0) {
        setVisibleCount((count) => count - 1);
      } else {
        setWordIndex((index) => (index + 1) % words.length);
        setPhase("typing");
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [phase, prefersReducedMotion, visibleCount, wordIndex, words]);

  return useMemo(() => {
    if (prefersReducedMotion) {
      return { text: words.join(" / "), prefersReducedMotion };
    }

    return { text: words[wordIndex].slice(0, visibleCount), prefersReducedMotion };
  }, [prefersReducedMotion, visibleCount, wordIndex, words]);
}

function HeroRoleLine() {
  const { text, prefersReducedMotion } = useTypewriter(HERO_ROLES);

  return (
    <p className="about-hero-line max-w-3xl text-balance font-display leading-[0.95] tracking-normal" style={{ fontSize: "clamp(2.3rem, 7vw, 5rem)" }}>
      <span className="sr-only">Frontend developer and UI/UX designer based in Egypt.</span>
      <span aria-hidden="true">
        <span className="about-role-wrap">
          <span className="text-gradient">{text || "\u00a0"}</span>
          {!prefersReducedMotion && <span className="about-type-caret" aria-hidden="true" />}
        </span>{" "}
        based in Egypt.
      </span>
    </p>
  );
}

function SocialLinks() {
  return (
    <aside aria-label="Social links" className="about-social-stack order-3">
      {SOCIALS.map((social, i) => {
        const Icon = social.icon;

        return (
          <Reveal key={social.label} delay={0.18 + i * 0.05}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="about-social-link"
              aria-label={social.label}
            >
              <Icon className="about-social-icon" aria-hidden="true" />
              <span className="about-social-label" aria-hidden="true">
                {social.label}
              </span>
            </a>
          </Reveal>
        );
      })}
    </aside>
  );
}

export function About() {
  return (
    <section className="relative">
      <div className="about-layout mx-auto grid min-h-svh max-w-7xl content-center gap-10 px-5 pb-28 pt-24 sm:px-8 sm:pb-24 lg:grid-cols-[82px_minmax(0,1fr)_82px] lg:gap-12">
        <TechStack />

        <div className="about-content order-2 min-w-0">
          <Reveal>
            <div className="about-title-row mb-8 flex items-end justify-between gap-4">
              <h2 className="font-display tracking-normal text-balance" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
                About
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">02 / About</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <HeroRoleLine />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="about-copy mt-8 max-w-3xl text-base leading-8 text-muted-foreground text-pretty sm:text-lg">
              I graduated from AASTMT with a Bachelor's in Information Systems and spent the last few years building full-stack web and mobile applications. Before code, I spent years doing digital illustration - that design instinct still drives how I build interfaces today. I care about the details most developers skip. Currently open to new opportunities.
            </p>
          </Reveal>
        </div>

        <SocialLinks />
      </div>
    </section>
  );
}
