# Portfolio — Design Concept & System

> A living reference for every visual and interaction decision made in this project.
> Keep this in sync whenever you change a token, add a new pattern, or introduce a new component.

---

## Table of Contents

1. [Design Concept](#1-design-concept)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Grid](#4-spacing--grid)
5. [The Pixel Language](#5-the-pixel-language)
6. [Animation & Motion](#6-animation--motion)
7. [Component Catalog](#7-component-catalog)
8. [Page Architecture](#8-page-architecture)
9. [Accessibility](#9-accessibility)
10. [Tech Stack](#10-tech-stack)

---

## 1. Design Concept

### Core Idea — "Digital Craftsperson"

The portfolio sits at the intersection of **two worlds**:

| World | Symbol | Meaning |
|---|---|---|
| Design | ✎ Pencil | Craft, precision, tactile feel |
| Development | `>` Chevron | Logic, code, forward motion |

Both symbols appear together in the 3-D hero emblem and as the caption beneath it (`✎ design / > code`), and they inform every micro-decision in the interface.

### Aesthetic Direction — Pixel-Art Meets Premium Dark UI

The interface deliberately uses a **pixel/voxel aesthetic** — hard corners, 0 border-radius, notched clip-paths, step-function transitions, and blocky drop-shadows — while still feeling *premium*, not retro-gimmicky. The tension between the pixel language and smooth modern typography creates a distinctive, memorable character.

Key reference points:
- **Minecraft UI / JRPG HUD** → structural motifs (notched corners, inset bevels, pixel-step shadows)
- **Figma / Linear** → calm, data-dense layouts with strong typographic hierarchy
- **Terminal/IDE aesthetics** → monospaced labels, `UPPERCASE TRACKING`, index numbers

### Dark-first, Light-polished

`dark` is the **primary experience**. The app defaults to dark mode and the dark palette is the most fully designed. Light mode is a thoughtful, clean alternative — the accent purple simply shifts to a richer, deeper value and backgrounds go to warm off-white.

---

## 2. Color System

All tokens live in `src/styles/theme.css` as CSS custom properties on `:root` (light) and `.dark`.

### Core Semantic Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `#f7f6f9` | `#09080d` | Page background |
| `--foreground` | `#15131c` | `#ededf2` | Primary text |
| `--card` | `#ffffff` | `#100e16` | Elevated surfaces |
| `--muted` | `#efecf4` | `#16131d` | Subtle fills |
| `--muted-foreground` | `#6a6479` | `#9b94a8` | Secondary text |
| `--border` | `rgba(20,18,30,.10)` | `rgba(255,255,255,.09)` | Dividers & outlines |
| `--primary` | `#6558c7` | `#8b80df` | Interactive primary |
| `--ring` | `#6558c7` | `#8b80df` | Focus outline |
| `--destructive` | `#d4183d` | `#7f1d1d` | Error states |

### Accent / Brand Scale

A single-hue purple gradient that runs from deep indigo to a lighter violet. Used for gradient text, CTA buttons, active states, and the ambient glow orbs.

```
--accent-from:  #5146a8  (dark: #7064cb)   <- deep anchor
--accent-mid:   #5d52b4  (dark: #8276d9)   <- midpoint
--accent-to:    #695ebf  (dark: #978ce5)   <- highlight
```

Gradient direction: `115deg` — slightly diagonal for energy.

```css
--accent-gradient: linear-gradient(115deg, var(--accent-from) 0%, var(--accent-mid) 52%, var(--accent-to) 100%);
```

### Pixel-Specific Tokens

These tokens exist solely to support the pixel/bevel language:

| Token | Purpose |
|---|---|
| `--pixel-frame` | Border color for outer pixel frames (dark chrome) |
| `--pixel-edge-light` | Top/left inset highlight for bevel |
| `--pixel-edge-dark` | Bottom/right inset shadow for bevel |
| `--pixel-active` | Fill for active/selected pixel controls |
| `--pixel-active-foreground` | Text on active pixel controls |
| `--pixel-shadow` | Offset hard-shadow color (not box-shadow blur) |
| `--pixel-field` | Background of the emblem/canvas panels |
| `--pixel-field-strong` | Stronger variant for corner accent tiles |
| `--grid-line` | Subtle grid overlay lines |

### Transition-Specific Tokens

Used *only* during the page transition animation:

| Token | Role |
|---|---|
| `--transition-base` | Strip fill during the wipe |
| `--transition-panel` | Progress-bar block fill |
| `--transition-accent` | Highlighted center block |
| `--transition-line` | Subtle grid overlay on the wipe screen |

### Selection Color

```css
::selection {
  background: var(--accent-to);
  color: #fff;
}
```

---

## 3. Typography

Three typefaces — each assigned to a distinct semantic role:

| Variable | Typeface | Role |
|---|---|---|
| `--font-display` | **Jersey 15** | Hero names, section titles, transition headings — the "character" voice |
| `--font-sans` | **Manrope** | Body copy, paragraphs, UI labels — readable, modern |
| `--font-mono` | **JetBrains Mono** | Tags, badges, kickers, tooltips, captions — technical/terminal voice |

### Usage Rules

- **Jersey 15** only for large display text (>= 2rem). Never use it at small sizes.
- **Manrope** everywhere `font-sans` is the default. Use `font-weight: 400` for body, `500` for labels and buttons.
- **JetBrains Mono** for anything that reads like metadata: section indices (`00`, `01`...), tech stack tags, status labels, monospaced captions. Pair it with `uppercase` + wide `letter-spacing` (0.16–0.28em).

### Scale

No rigid scale — sizing is done with `clamp()` for fluid responsiveness:

```css
/* Hero name */
font-size: clamp(3rem, 9vw, 7rem);

/* Section title (About) */
font-size: clamp(1.95rem, 8.9vw, 2.45rem);

/* Transition heading */
font-size: clamp(2rem, 7vw, 4.5rem);
```

Base: `16px` (`--font-size`).

---

## 4. Spacing & Grid

### Base Unit: **44px**

Everything aligns to a 44 px grid — the same unit used for:
- The repeating background grid (`background-size: 44px 44px`)
- The pixel-canvas corner accent tiles (`176px = 4x44`, `88px = 2x44`)
- Navigation button size (`h-11 w-11 = 44px`)

### Layout

The app is a **single-viewport, full-screen paged layout**. Each section fills `h-svh` and the user navigates between them via:
- Mouse wheel (edge detection)
- Touch swipe (>= 60px delta)
- Keyboard (`Up` / `Down`, `PageUp` / `PageDown`)
- Bottom nav bar

### Nav Bar

Fixed at the bottom center (`bottom: 1rem + env(safe-area-inset-bottom)`). A floating pixel dock with icon buttons.

### Hero Section

Two-column grid at `lg` breakpoint (`1.6fr / 1fr`). Stack vertically on smaller screens.

Max content width: `max-w-6xl` with `px-5 sm:px-8` gutters.

---

## 5. The Pixel Language

This is the core visual identity of the UI. Every "container" element speaks this language.

### Notched Corners (clip-path)

Instead of `border-radius`, elements use a 12-point polygon clip to create chamfered/notched corners — giving the appearance of a retro game UI panel.

**Standard notch formula** (parametric, based on notch depth `N`):

```css
clip-path: polygon(
  0 Npx, Npx Npx, Npx 0,
  calc(100% - Npx) 0, calc(100% - Npx) Npx, 100% Npx,
  100% calc(100% - Npx), calc(100% - Npx) calc(100% - Npx), calc(100% - Npx) 100%,
  Npx 100%, Npx calc(100% - Npx), 0 calc(100% - Npx)
);
```

| Component | Notch depth |
|---|---|
| Nav dock (outer) | 7px |
| Nav dock (surface) | 5px |
| Hero emblem outer | 8px |
| Hero emblem inner | 6px |
| Pixel button | 5px |
| Stat chip, tech chip | 4px |
| Tooltip | 4px |
| Status chip | 5px |
| Side rail | 6px |
| Project detail modal | 7px |

### Bevel Inset Shadow

All pixel panels use **inset box-shadows** to simulate a raised bevel — light top-left, dark bottom-right:

```css
box-shadow:
  inset 2px 2px 0 var(--pixel-edge-light),
  inset -2px -2px 0 var(--pixel-edge-dark);
```

This is the single most important rule for the pixel aesthetic.

### Hard Offset Shadow

Floating elements use a **hard, zero-blur drop shadow** offset diagonally — mimicking an isometric pixel shadow:

```css
/* box-shadow version (won't work with clip-path) */
box-shadow: 4px 4px 0 0 var(--pixel-shadow);

/* drop-shadow version (survives clip-path) */
filter: drop-shadow(4px 4px 0 var(--pixel-shadow));
```

> **Rule:** Always use `filter: drop-shadow(...)` on elements that have a `clip-path`, because `box-shadow` is clipped away.

### Press / Active Physics

All interactive pixel elements translate themselves *into* their shadow on press — simulating a physical button:

```css
/* Hover: shift 1-2px right+down */
transform: translate(1px, 1px);
filter: drop-shadow(2px 2px 0 var(--pixel-shadow));

/* Active/pressed: fully "bottoms out" — shadow collapses to 0 */
transform: translate(3px, 3px);
filter: drop-shadow(0 0 0 var(--pixel-shadow));
```

### Step-function Transitions

Motion within the pixel system uses `steps()` timing functions to make movement feel "quantized" and digital rather than smooth and organic:

```css
transition: transform 80ms steps(2, end);
transition: transform 150ms steps(3, end);
transition: transform 160ms steps(4, end);
```

Smooth easing (`linear`, `cubic-bezier`) is reserved for **color and opacity** changes only.

### Scanlines Overlay

The hero section has a subtle CRT scanline texture via a `::before` pseudo-element:

```css
background: repeating-linear-gradient(
  to bottom,
  rgba(255, 255, 255, 0.025) 0px 1px,
  transparent 1px 3px
);
```

### Background Grid

Applied to the root canvas (`pixel-canvas`). A 44px repeating grid for depth, plus decorative corner tile accents (stronger fills at the page corners to frame the content).

---

## 6. Animation & Motion

### Philosophy

> **Purposeful, quantized, never gratuitous.**

Animation in this project falls into three tiers:

| Tier | Purpose | Easing |
|---|---|---|
| **Entry/reveal** | Introduce content on page load | Spring `[0.16, 1, 0.3, 1]` |
| **Interactive** | Respond to hover, click, drag | `steps()` or `linear` |
| **Ambient** | Create life without demanding attention | `ease-in-out`, `infinite` |

### Entry Animations (Framer Motion)

The hero section orchestrates a staggered reveal:

1. Status chip fades up — delay: 0.3s
2. Name lines slide up from clipped overflow (stagger 0.09s, start 0.5s) — uses `overflow: hidden` on the parent to create a "curtain" reveal
3. Role ticker fades in — delay: 0.95s
4. Bio fades up — delay: 1.05s
5. CTA buttons fade up — delay: 1.2s
6. Stat badges stagger in — start 1.35s, stagger 0.08s
7. 3D emblem slides in from right — delay: 1.3s
8. Scroll hint appears + begins bobbing — delay: 1.6s

Spring used: `ease: [0.16, 1, 0.3, 1]` — aggressive initial deceleration, overshoot-free.

### Page Transition — Pixel Shutters

When navigating between sections, 14 vertical strips animate in/out to cover and reveal the new page. Alternating strips animate from the top and bottom (`transformOrigin: top | bottom` based on odd/even index). Each strip is offset by `0.016s` for a cascading wipe effect.

While covered, the destination section name (in Jersey 15 display font) + a progress-track indicator are revealed.

### Ambient Animations

| Effect | Location | Duration |
|---|---|---|
| Orb drift (primary) | Hero background | 22s alternate |
| Orb drift (secondary) | Hero background | 28s alternate |
| Status pulse ring | Hero status chip | 2.4s infinite |
| Typewriter cursor blink | Role ticker, About | 760ms steps(2) |
| Tech marquee scroll | About section | 28s linear |
| Scroll hint bob | Hero bottom | 2s ease-in-out |
| 3D emblem float | Hero right column | sine wave per-frame |

### Reduced Motion

All ambient and entry animations are disabled/simplified for `prefers-reduced-motion: reduce`. The typewriter shows all role titles as a static list. Page transitions collapse to near-instant. Tech chip hover/transform states are stripped.

---

## 7. Component Catalog

### `pixel-dock` + `pixel-dock-surface`

The floating bottom navigation bar. Outer frame uses `--pixel-frame` color with a 7px notch clip and a hard drop-shadow. Inner surface has a bevel.

### `pixel-nav-control`

Individual navigation icon button (44x44px). States:
- **Default:** background + bevel shadow
- **Hover:** shifts 1px diagonally (steps), darkens border
- **Active/pressed:** shifts 2px, shadow inverts
- **data-active="true":** fills with `--pixel-active` purple, white dot indicator at bottom-right, inverted bevel

### `pixel-tooltip`

Notched 4px clip-path tooltip in inverted colors (foreground bg, background text). Hard drop-shadow.

### `pixel-status-chip`

Two-part inline component: a dim "Status" label segment, and a live segment with a pulsing pixel dot and "Available for work" text.

### `hero-stat-chip`

Small mono-spaced info pill with an icon, a dim label, and a bright value. Has a 4px notch clip and small bevel shadow.

### `hero-emblem-outer` + `hero-emblem-inner`

Double-bezel frame for the 3D scene. Outer uses 8px notch, inner uses 6px. Includes an ambient `drop-shadow` glow in the accent color, plus 4 `hero-emblem-corner` accent marks (L-shaped brackets in `--accent-to`).

### `pixel-btn`

Standard CTA button. 5px notch clip, `filter: drop-shadow` hard shadow (not box-shadow). Translates into shadow on hover, collapses on active.

Primary variant uses `bg-gradient-accent` fill with `hero-cta-arrow-wrap` (a smaller notched arrow badge nested inside).

### `about-tech-chip` + `about-social-link`

68x68px square icon tiles with bevel + hard shadow + 5px notch. On hover: translate (-2,-2)px, border goes to the item's `--skill-color`, glyph desaturates out, a pixel tooltip label slides in from the side.

### `project-card`

Full-width card with 14px padding, bevel shadow. On hover (desktop only): lifts -3px/-3px, shadow expands to 6px, media border tints to `--accent-to`, cue arrow shifts right.

### `project-detail-content`

Fixed modal (z-51) with 7px notch clip, thick bevel, and 6px hard shadow. Entry: slides up 10px from slightly transparent. Exit: reverses. Backdrop uses a scanline overlay.

---

## 8. Page Architecture

```
App (pixel-canvas root)
  Nav (fixed bottom center)
  PageDots (fixed right side)
  AnimatePresence
    motion.main  [key = current section]
      Hero | Projects | About | Contact
  AnimatePresence
    Transition (pixel-shutter wipe, shown when navigation is pending)
```

### Section IDs & Indices

| Index | ID | Label |
|---|---|---|
| `00` | `home` | HOME |
| `01` | `projects` | PROJECTS |
| `02` | `about` | ABOUT |
| `03` | `contact` | CONTACT |

### Hero Section Layout

```
section.scanlines
  AmbientGlow              (absolute, z-0, two drifting orbs)
  div.max-w-6xl.grid
    div  (left column)
      status chip
      h1 name — staggered line reveal
      role ticker — typewriter
      bio paragraph
      CTA buttons (View Projects + Download CV)
      stat badges (Since / Based in)
    motion.div  (right column, hidden below lg)
      EmblemFrame (double-bezel)
        Hero3D (lazy Three.js canvas)
      caption ("design / code")
  scroll-hint button  (absolute bottom center)
```

### 3D Emblem (Hero3D)

Built with vanilla Three.js (not react-three-fiber) for total control. Pixel ratio locked to `1` and `antialias: false` to preserve the pixelated look. `imageRendering: pixelated` on the canvas.

Scene contains:
- **Chevron `>`** — a 7x5 pixel matrix of `BoxGeometry` cubes (0.26 unit each, slight gap for pixel readability)
- **Pencil** — a set of stacked boxes making a stylized pixel pencil (barrel, band, nib steps, ferrule, eraser, clip)

Both objects sit inside an `emblem` group. The group rotates continuously on Y, floats on a sine wave, and responds to pointer drag with inertial momentum.

---

## 9. Accessibility

| Concern | Implementation |
|---|---|
| Keyboard navigation | Arrow keys / PageUp/Down navigate between sections |
| Focus management | `focus-visible` outlines using `--ring` on all interactive elements |
| Screen reader labels | `aria-label` on nav buttons, `aria-current="page"` on active item, `sr-only` spans for role ticker |
| Reduced motion | Full `prefers-reduced-motion` block in theme.css; `useReducedMotion()` hook in Transition |
| Touch paging | 60px swipe threshold to avoid accidental triggers |
| Color contrast | Muted foreground values chosen to meet WCAG AA at common sizes |
| Scrollbar | Hidden until hover to reduce visual noise, but still accessible |

---

## 10. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React 18 + TypeScript | Component model, type safety |
| Build | Vite 6 | Fast HMR, ESM-native |
| Styling | Tailwind CSS v4 + custom utilities | Token system via CSS variables; pixel utilities in theme.css |
| Animation | Motion (Framer Motion v12) | Orchestrated entry, page transitions, scroll hints |
| 3D | Three.js (vanilla) | Full control over pixel ratio, no abstraction overhead |
| Icons | `@iconify-icons/pixelarticons` + Lucide React | Pixel-art icons for nav; Lucide for fine-detail UI icons |
| UI Primitives | Radix UI | Accessible dialog, tooltip, and other headless components |
| Fonts | Jersey 15, Manrope, JetBrains Mono | Via Google Fonts |

---

## Quick Reference — The 5 Rules

1. **No border-radius.** Use notched `clip-path` polygons instead. `--radius: 0px`.
2. **Shadows are hard.** Always `N px N px 0 var(--pixel-shadow)` — never blurred. Use `filter: drop-shadow` when `clip-path` is present.
3. **Motion is quantized.** Transforms use `steps()`. Only opacity and color use smooth easing.
4. **Type has a role.** Jersey 15 = display. Manrope = body. JetBrains Mono = metadata/terminal.
5. **Respect reduced motion.** Every animation must have a `prefers-reduced-motion` fallback.
