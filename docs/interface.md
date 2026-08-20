# Interface Architecture & Visual Design

The UI layout of Bobby is designed to feel responsive, tactile, and visually cohesive across desktop windows and mobile viewports.

## 1. The 64rem Layout Split

The app defines a single responsive breakpoint at `64rem` (1024px) separating two layouts:

- **Desktop ( $\ge 64\text{rem}$ )**:
  - Three-column grid layout (`[left panel] [avatar stage] [right panel]`).
  - Page scroll is clipped (`overflow: clip`).
  - Panels scroll independently with custom slim scrollbars.
  - Floating side rail and ambient wordmark in fixed baseline positions.
- **Mobile / Compact ( $< 64\text{rem}$ )**:
  - Single vertical stacked flex layout with native page scrolling.
  - Navigation rail docks as a top pill bar.
  - Montage timeline and wordmark reflow into standard document flow.

## 2. Dynamic Ambient Canvas Wave

- Fullscreen background particle grid (`src/components/ParticleWaveCanvas.vue`) rendered via `<canvas>`.
- Smooth harmonic organic waves with cursor-following fluid repulsion.
- Dynamically glides its center coordinates across view transitions (e.g. shifts gracefully to the right when opening settings).

## 3. Theme System & Colors

- **Tailwind 4 + Vanilla CSS Tokens**:
  - `--paper`: background surface (`#f9f9f9` in light, `#09090b` in dark).
  - `--ink`: high-contrast text and UI accents (`#0a0a0c` in light, `#f4f4f5` in dark).
  - `--line`: border accents (`#e4e4e7` in light, `#27272a` in dark).
- Supports System, Light, and Dark modes with automatic media query listening.
