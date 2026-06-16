import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "./components/portfolio/Nav";
import { Hero } from "./components/portfolio/Hero";
import { Skills } from "./components/portfolio/Skills";
import { Projects } from "./components/portfolio/Projects";
import { Contact } from "./components/portfolio/Contact";
import { Transition } from "./components/portfolio/Transition";
import { PageDots } from "./components/portfolio/PageDots";
import { CustomCursor } from "./components/portfolio/CustomCursor";
import { SECTIONS, type SectionId } from "./components/portfolio/sections";

type Theme = "dark" | "light";

const ORDER: SectionId[] = SECTIONS.map((s) => s.id);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark"; // dark is the primary experience
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [section, setSection] = useState<SectionId>("home");
  const [pending, setPending] = useState<SectionId | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const lockUntil = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  // Navigation choreography: show the announcer, swap the page underneath, lift.
  useEffect(() => {
    if (!pending) return;
    const swap = setTimeout(() => setSection(pending), 650);
    const done = setTimeout(() => setPending(null), 1350);
    return () => {
      clearTimeout(swap);
      clearTimeout(done);
    };
  }, [pending]);

  useEffect(() => {
    if (section !== "projects") setIsProjectDialogOpen(false);
  }, [section]);

  const navigate = useCallback(
    (target: SectionId) => {
      if (target === section || pending) return;
      lockUntil.current = Date.now() + 1600; // cooldown so momentum can't double-fire
      setPending(target);
    },
    [section, pending],
  );

  const navigateRelative = useCallback(
    (dir: 1 | -1) => {
      const idx = ORDER.indexOf(section);
      const next = ORDER[idx + dir];
      if (next) navigate(next);
    },
    [section, navigate],
  );

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Wheel paging: scroll within a page until its edge, then advance.
  const onWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (isProjectDialogOpen) return;
    if (pending || Date.now() < lockUntil.current) return;
    if (Math.abs(e.deltaY) < 8) return;
    const el = e.currentTarget;
    const atTop = el.scrollTop <= 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    if (e.deltaY > 0 && atBottom) navigateRelative(1);
    else if (e.deltaY < 0 && atTop) navigateRelative(-1);
  };

  // Touch swipe paging (when at the page edge).
  const touchStart = useRef<{ y: number; top: number; el: HTMLElement | null }>({ y: 0, top: 0, el: null });
  const onTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    touchStart.current = { y: e.touches[0].clientY, top: e.currentTarget.scrollTop, el: e.currentTarget };
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (isProjectDialogOpen) return;
    if (pending || Date.now() < lockUntil.current) return;
    const el = touchStart.current.el;
    if (!el) return;
    const dy = touchStart.current.y - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 60) return;
    const atTop = el.scrollTop <= 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    if (dy > 0 && atBottom) navigateRelative(1);
    else if (dy < 0 && atTop) navigateRelative(-1);
  };

  // Keyboard paging.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isProjectDialogOpen) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") navigateRelative(1);
      else if (e.key === "ArrowUp" || e.key === "PageUp") navigateRelative(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isProjectDialogOpen, navigateRelative]);

  const renderSection = (id: SectionId) => {
    switch (id) {
      case "home":
        return <Hero onNavigate={navigate} theme={theme} />;
      case "projects":
        return <Projects onProjectDialogOpenChange={setIsProjectDialogOpen} />;
      case "skills":
        return <Skills />;
      case "contact":
        return <Contact />;
    }
  };

  const pendingMeta = SECTIONS.find((s) => s.id === pending);

  return (
    <div className="pixel-canvas relative h-svh overflow-hidden text-foreground">
      <Nav theme={theme} onToggle={toggle} active={section} onNavigate={navigate} />
      <PageDots active={section} onNavigate={navigate} />

      <AnimatePresence mode="wait">
        <motion.main
          key={section}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="h-svh overflow-y-auto"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01, transition: { duration: 0.3 } }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderSection(section)}
        </motion.main>
      </AnimatePresence>

      <AnimatePresence>
        {pendingMeta && <Transition key="transition" name={pendingMeta.label} index={pendingMeta.index} />}
      </AnimatePresence>

      <CustomCursor />
    </div>
  );
}
