# Export Pipelines & Encoders

Bobby includes export pipelines (`src/ui/capture.ts`, `src/ui/export.ts`, `src/ui/video.ts`) to render avatars and montages into multiple industry-standard formats.

## 1. Supported Export Formats

| Format | Type | Description |
| :--- | :--- | :--- |
| **Static SVG** | Vector | Standalone vector graphic with pure path outlines and inline styling. |
| **Animated SVG** | Vector | Embedded CSS keyframe animations for morphing and eye movements. |
| **Static PNG** | Raster | Crisp 2x/3x rasterized image rendered via offscreen canvas. |
| **Animated GIF** | Raster Animation | GIF89a stream generated frame-by-frame through in-house LZW encoder (`anime.ts`). |
| **MP4 Video** | Video H.264 | Hardware-accelerated video rendered via `mediabunny`. |

## 2. Dynamic Bundle Optimization

- **Zero Heavy Core Footprint**: `mediabunny` is loaded exclusively via dynamic `import()` when a video export is triggered. This preserves an ultra-compact initial app bundle (~77 kB gzip).
- **Off-Screen Rendering**: Export captures run on dedicated offscreen SVG rendering hosts to prevent UI stalls and window resize interference during background export rendering.
