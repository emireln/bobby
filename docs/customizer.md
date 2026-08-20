# Avatar Customization & Vault System

The customization layer (`src/components/Customizer.vue`, `src/ui/vault.ts`, `src/bot/skins.ts`) allows users to design, style, and store custom avatars.

## 1. Customization Dimensions

- **Body Shapes**: 16 analytical silhouettes defined in `skins.ts` (e.g. `nuage`, `cercle`, `etoile`, `coeur`, `goutte`, `galet`, `capsule`, `fleur`, etc.).
- **Palette**: 30 curated tones with contrast awareness.
- **Expressions**: 24 distinct facial configurations across varying moods and gaze directions.
- **Speech Bubble**: Real-time interactive text bubble with custom messages.
- **Eye Contrast Rules**:
  - White body (`blanc`): Eyes default to black (`encre`) for optimal visibility.
  - Black body (`encre`) & dark colors: Eyes default to white (`blanc`).
  - Toggle button allows manual switching between white and black eyes.
  - Reset button resets the avatar to the default cloud silhouette and expression with high-contrast eye alignment in a single click.

## 2. Avatar Vault (`src/ui/vault.ts`)

The Avatar Vault provides full local persistence and portability for created avatars:

- **Data Schema**:
  ```ts
  export interface SavedAvatar {
    id: string
    name: string
    shape: string
    color: string
    expression: string
    eyeColor?: string
    bubble?: string
    createdAt: number
  }
  ```
- **Storage**: Automatically synced to `localStorage` under `bobby:coffre`.
- **Management Features**:
  - Reordering (move left/right).
  - In-place renaming.
  - Instant loading into active editor.
  - Updating existing presets with the current stage appearance.
- **JSON Portability**: Single avatar export or complete vault backup and restore with full JSON validation.
