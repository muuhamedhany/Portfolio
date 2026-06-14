# Hero 3D element + cleaner pixel font

## Context

The portfolio currently uses **Pixelify Sans** for display headings, which the user finds too noisy at large sizes, and the hero's right column is a static "editorial meta" text block (`// based in / focus / currently`). The user wants (1) a cleaner, more readable pixel font and (2) the right column replaced with an **interactive WebGL 3D** piece expressing the dual identity: a **pen** (UI/UX) and a **`>`** chevron (dev), drag-spinnable with depth/lighting. Decisions confirmed with the user: font = **Jersey 15**; 3D = **real WebGL** via `@react-three/fiber` + `@react-three/drei`.

## Changes

### 1. Font swap → Jersey 15 (clean pixel)

- `src/styles/fonts.css`: replace the `@import` URL. Drop `Pixelify Sans` + `Press Start 2P`; add `Jersey 15`. Keep `Manrope` (body) and `JetBrains Mono` (mono).
  - New: `family=Jersey+15&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700`
- `src/styles/theme.css`: set `--font-display: 'Jersey 15', sans-serif;` (line ~34). Jersey 15 ships a single weight; existing inline `fontWeight` on headings is harmless. Keep the `.font-display { letter-spacing: 0.01em }` utility (Jersey 15 is tall/even and reads well as-is).
- No other component edits needed — all headings already use `font-display` / the `--font-display` token.

### 2. Install 3D deps (pnpm, let it resolve versions)

- `pnpm add three @react-three/fiber @react-three/drei` (+ `pnpm add -D @types/three`).
- Note: pick versions compatible with the project's React major (r3f v9/drei latest for React 19; v8 for React 18). Let pnpm resolve; verify the app's React version in `package.json` first.

### 3. New component: `src/app/components/portfolio/Hero3D.tsx`

A self-contained `<Canvas>` scene — no external HDRI/font assets (keep it offline-safe):

- **Canvas**: `dpr={[1, 2]}`, `camera={{ position: [0,0,6], fov: 38 }}`, transparent background, `className` filling the column.
- **Interaction**: wrap models in drei `<PresentationControls>` (drag to rotate, spring snap-back, polar/azimuth limits) + `<Float>` for idle bob/rotation. This gives "drag-spin" without OrbitControls hijacking page scroll.
- **Pen (UI/UX)**: build procedurally from primitives — a long hex/cylinder barrel (`cylinderGeometry`), a `coneGeometry` nib tip, a small metallic band, and a clip. Barrel material = purple accent (`meshStandardMaterial` color `#7a2eb0`→ uses brand gradient endpoints), nib = metallic (`metalness` high, `roughness` low). Tilt it diagonally.
- **`>` chevron (dev)**: extruded geometry from a `THREE.Shape` describing a chevron/greater-than stroke (two angled arms with thickness), via `<extrudeGeometry>` with small `bevel`. Emissive purple so it "glows" slightly in dark mode. Position it interlocking with / orbiting the pen so the two read as one emblem.
- **Lighting**: `ambientLight` + a key `directionalLight` + a rim `pointLight` in accent color; optional `<ContactShadows>` under the group for grounding. Avoid `<Environment preset>` (network HDRI).
- **Theme-awareness**: accept a `theme` prop (or read the `.dark` class) to nudge emissive intensity / light levels so it looks good in both light and dark.
- Guard for context-loss/perf: cap `dpr`, `frameloop="always"` (needed for Float/drag); keep poly counts low.

### 4. Wire into Hero — `src/app/components/portfolio/Hero.tsx`

- Replace the entire "Editorial side meta block" `motion.div` (the `// based in / focus / currently` block) with `<Hero3D />` inside a `motion.div` that keeps the entrance animation (`opacity/x`) and the `hidden lg:block` responsive rule (3D stays desktop-only; mobile keeps the clean single-column hero — matches current behavior and avoids mobile WebGL cost).
- Remove the now-unused `MapPin` import if nothing else uses it; keep the parent grid `lg:grid-cols-[1.6fr_1fr]`.
- Pass `theme` down if needed (Hero doesn't currently receive it — either read `document.documentElement.classList` inside Hero3D via a small effect, or thread `theme` from `App` → `Hero` → `Hero3D`; prefer threading the prop for correctness with the existing toggle in `App.tsx`).

## Critical files

- `src/styles/fonts.css`, `src/styles/theme.css` — font swap
- `src/app/components/portfolio/Hero3D.tsx` — NEW WebGL scene
- `src/app/components/portfolio/Hero.tsx` — swap right column, prop threading
- `package.json` — new 3D deps
- (maybe) `src/app/App.tsx` / `Hero` props — thread `theme` for light/dark-aware lighting

## Verification

- Dev server is already running; open the preview (not localhost).
- Hero: confirm headings render in Jersey 15 and read cleanly at large sizes; check the name, section titles, marquee, and transition announcer.
- 3D: on a desktop-width viewport, the pen + `>` render with lighting/depth; **drag rotates** them and they spring back / idle-float; no interference with wheel paging between sections.
- Toggle light/dark — scene stays legible in both; accent purple reads correctly.
- Narrow viewport (<1024px): 3D is hidden, hero layout stays intact, no console WebGL errors.
- Check the browser console for r3f/three warnings or context-loss errors.