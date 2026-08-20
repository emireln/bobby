# Core Architecture & Engine Design

The core animation engine of Bobby resides in `src/bot/` and is completely decoupled from any UI framework or system clock.

## 1. Deterministic Time Sampling (`sample(t)`)

The animation state is a pure mathematical function of time `t`:

$$\text{Frame} = \text{engine}.\text{sample}(t)$$

- **No framework imports**: `src/bot/` contains no Vue dependencies, DOM APIs, or `Date.now()` calls.
- **Pure and Replayable**: Calling `sample(t)` multiple times with the same timestamp produces byte-identical output without side effects or cache mutations.
- **Instant Previews**: Enables the `frozenAt` prop on `<BobbyBot>` to render arbitrary static frames instantly without running a playback loop.

## 2. Polar Silhouette Representation

All avatar silhouettes share a uniform 64-point angular sampling grid (`PROFILE_SAMPLES = 64`):

- Every shape is represented by a 64-element radial array `radii[64]`, where each radius corresponds to an angle $\theta_i = \frac{2\pi \cdot i}{64}$.
- Shape morphing reduces to a linear interpolation of radii arrays:
  $$r_{\text{interpolated}}(\theta_i) = (1 - \alpha) \cdot r_A(\theta_i) + \alpha \cdot r_B(\theta_i)$$
- Non-circular analytical shapes are converted into radial profiles via polygon rasterization or polar projection.

## 3. Eye Masking and Clipping

- Eyes are rendered as holes inside an SVG `<mask />` layer, not as white shapes layered on top.
- This ensures natural clipping of eyes along the silhouette boundary regardless of avatar shape or rotation.
- `radiusAtAngle` dynamically clamps eye positioning so that eyes respect the silhouette boundary of non-circular shapes.
- An isometric lookup table (`eyefit.ts`) applies boundary-aware translation offsets during morph transitions without per-frame jitter.

## 4. State Transitions & Blending

- Smooth state changes employ exponential ease-outs.
- When a state transition occurs during an active fade, the engine captures a frozen snapshot of the composite pose to blend continuously without visual jumps.
- Animated states (such as `orbit`, `bounce`, `wave`, `comet`, `burst`, `pulse`) compute vector paths, eye matrices, and secondary element offsets directly per frame.
