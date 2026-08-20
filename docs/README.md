# Bobby Technical Documentation

Welcome to the technical documentation for **Bobby** — a dynamic SVG vector avatar and animation studio.

## Overview

Bobby is an interactive vector animation engine and desktop studio built with Vue 3, TypeScript, Tailwind 4, and Electron. It features a clockless deterministic state interpolation engine, customizable avatar components, timeline montage editing, persistent vault storage, and multi-format export pipelines (SVG, PNG, animated GIF, MP4).

```
┌─────────────────────────────────────────────────────────────┐
│                          Bobby Studio                       │
├────────────────────────┬────────────────────────────────────┤
│   Renderer / UI Layer  │  Vue 3.5 Components & Composables  │
│                        │  Tailwind 4 & Dynamic Canvas Wave  │
├────────────────────────┼────────────────────────────────────┤
│   Bot Engine Layer     │  Pure deterministic sample(t)      │
│                        │  Polar silhouette interpolation    │
│                        │  Eye tracking, masks, and expressions│
├────────────────────────┼────────────────────────────────────┤
│   Desktop & Platform   │  Electron main / preload IPC       │
│                        │  In-app silent auto-updater        │
│                        │  Local storage vault & i18n        │
└────────────────────────┴────────────────────────────────────┘
```

## Documentation Guides

1. [**Core Architecture & Engine**](architecture.md) — How the deterministic state engine, radial sampling, and expression morphing work.
2. [**Desktop Application (Electron)**](electron.md) — Frameless window integration, IPC security bridge, system tray, and auto-updater.
3. [**Avatar Customization & Vault**](customizer.md) — Analytical body shapes, eye contrast rules, and avatar persistence.
4. [**Timeline & Animation Cycles**](timeline.md) — Multi-state sequencing, block duration rules, and playback control.
5. [**Export Pipelines**](export.md) — High-resolution PNG, vector SVG, animated GIF, and dynamic MP4 video rendering.
6. [**Interface & Visual Design**](interface.md) — Responsive layout grid, 64rem breakpoint, dark/light themes, and ambient particle canvas.
7. [**Internationalization (i18n)**](i18n.md) — Lightweight typed translation layer supporting English and Brazilian Portuguese.
