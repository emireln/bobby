# Electron Desktop Architecture

`bobby` includes a production-ready Electron desktop client alongside its web application.

## Process Architecture

- **Main Process (`electron/main.ts`)**:
  - Creates the frameless window (`frame: false`, custom title bar).
  - Handles window control IPC (`minimize`, `maximize`, `close`, `isMaximized`).
  - Sets up the System Tray with quick actions (`Show Bobby`, `Check for Updates...`, `Quit`).
  - Configures `autoUpdater` (from `electron-updater`) with progress and update events.
  - Ensures a single instance lock.
- **Preload Script (`electron/preload.ts`)**:
  - Securely exposes `window.bobbyElectron` to the renderer using `contextBridge`.
  - Exposes typed methods for window controls, version query, and updater listeners.
- **Renderer Process (`src/`)**:
  - Detects Electron environment via `window.bobbyElectron`.
  - Mounts `<TitleBar />` at the top of the app.
  - Dynamically sets `--titlebar-height: 32px` on `:root` / `#app` to ensure clean layout adaptation.
  - In-app update notifications with zero OS popups and in-place download progress.

## Build and Scripts

- `npm run electron:dev`: Compiles electron scripts with `esbuild` and starts Electron connected to Vite dev server.
- `npm run electron:build`: Runs `scripts/build-electron.ts` to package the app for production and builds the NSIS Windows installer via `electron-builder`.
