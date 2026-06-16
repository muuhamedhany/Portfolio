import { useEffect, useRef, useState, type CSSProperties } from "react";

type CursorKind = "default" | "pointer" | "text" | "disabled" | "grab" | "grabbing";

const CURSORS: Record<CursorKind, { src: string; x: number; y: number; label: string }> = {
  default: { src: "/cursors/pointer_a.png", x: 3, y: 3, label: "Default cursor" },
  pointer: { src: "/cursors/hand_point.png", x: 8, y: 4, label: "Pointer cursor" },
  text: { src: "/cursors/line_vertical.png", x: 12, y: 12, label: "Text cursor" },
  disabled: { src: "/cursors/cursor_disabled.png", x: 12, y: 12, label: "Disabled cursor" },
  grab: { src: "/cursors/hand_open.png", x: 11, y: 8, label: "Grab cursor" },
  grabbing: { src: "/cursors/hand_closed.png", x: 11, y: 8, label: "Grabbing cursor" },
};

const disabledSelector = "button:disabled, input:disabled, textarea:disabled, select:disabled, [aria-disabled='true']";
const textSelector = "input:not([type='button']):not([type='submit']):not([type='reset']), textarea, [contenteditable='true']";
const pointerSelector = "a, button, [role='button'], summary, select, label[for]";

function getCursorKind(target: EventTarget | null, pressed: boolean): CursorKind {
  if (!(target instanceof Element)) return "default";
  if (target.closest(disabledSelector)) return "disabled";
  const dragTarget = target.closest("[data-cursor='grab'], [data-cursor='grabbing']");
  if (dragTarget) {
    return pressed || dragTarget.getAttribute("data-cursor") === "grabbing" ? "grabbing" : "grab";
  }
  if (target.closest(textSelector)) return "text";
  if (target.closest(pointerSelector)) return "pointer";
  return "default";
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<EventTarget | null>(null);
  const pressedRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [kind, setKind] = useState<CursorKind>("default");

  useEffect(() => {
    const canUseCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncEnabled = () => setEnabled(canUseCustomCursor.matches);

    syncEnabled();
    canUseCustomCursor.addEventListener("change", syncEnabled);
    return () => canUseCustomCursor.removeEventListener("change", syncEnabled);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor-enabled", enabled);
    return () => document.documentElement.classList.remove("custom-cursor-enabled");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const move = (event: PointerEvent) => {
      targetRef.current = event.target;
      cursorRef.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursorRef.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
      setKind(getCursorKind(event.target, pressedRef.current));
    };

    const over = (event: PointerEvent) => {
      targetRef.current = event.target;
      setKind(getCursorKind(event.target, pressedRef.current));
    };

    const down = (event: PointerEvent) => {
      pressedRef.current = true;
      targetRef.current = event.target;
      setKind(getCursorKind(event.target, true));
    };

    const up = (event: PointerEvent) => {
      pressedRef.current = false;
      targetRef.current = event.target;
      setKind(getCursorKind(event.target, false));
    };

    const leave = () => cursorRef.current?.setAttribute("data-visible", "false");
    const enter = () => cursorRef.current?.setAttribute("data-visible", "true");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null;

  const cursor = CURSORS[kind];

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pixel-custom-cursor"
      data-kind={kind}
      data-visible="true"
      style={
        {
          "--cursor-hot-x": `${cursor.x}px`,
          "--cursor-hot-y": `${cursor.y}px`,
        } as CSSProperties
      }
    >
      <img key={kind} src={cursor.src} alt={cursor.label} draggable={false} />
    </div>
  );
}
