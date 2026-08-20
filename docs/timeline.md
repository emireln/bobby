# Timeline & Animation Cycles

The Timeline view (`src/components/Timeline.vue`, `src/bot/cycles.ts`) provides a non-linear montage editor for sequencing avatar animation states.

## 1. Cycle & Block Model

Animations are organized into **Cycles**, which consist of an ordered sequence of **Blocks**:

```ts
export interface Block {
  state: StateId
  duration: number
}

export interface Cycle {
  id: string
  name: string
  blocks: Block[]
}
```

## 2. Timing Constraints & Rules

- **No Time Scaling**: The engine never scales time arbitrarily. Looping states perform complete rotations or cycles, and non-looping states hold their resting poses.
- **Minimum Block Duration (`MIN_BLOCK = 0.6s`)**: Enforces minimum readability for cards on the timeline track and provides ample window for smooth cross-fades.
- **State Duration Bounds (`minDuration`)**: Each state specifies its minimum required duration in `StateDef` to prevent premature cutoffs of narrative keyframes.
- **Scrubbing & Playback**: Users can scrub the playhead across the total duration, toggle loop playback, or preview individual state tiles.
