# Desktop Application Architecture (Electron)

Bobby includes a production-grade native desktop application powered by Electron.

## 1. Process Separation & Security

- **Main Process (`electron/main.ts`)**:
  - Manages BrowserWindow lifecycle (`frame: false` for custom styled titlebar).
  - Listens to IPC events for window controls (`minimize`, `maximize`, `close`, `isMaximized`).
  - Configures background auto-updates via `electron-updater`.
  - Instantiates the system tray icon with quick desktop actions.
  - Enforces single application instance (`app.requestSingleInstanceLock`).
- **Preload Bridge (`electron/preload.ts`)**:
  - Context isolation enabled (`contextIsolation: true`, `nodeIntegration: false`).
  - Exposes typed `window.bobbyElectron` API via `contextBridge.exposeInMainWorld`.
- **Renderer (`src/`)**:
  - Detects desktop environment and mounts `<TitleBar />`.
  - Sets CSS variable `--titlebar-height: 32px` on root to adapt window padding automatically.

## 2. In-App Silent Auto-Updater

- Updates run silently in the background with zero disruptive OS dialogs.
- Custom updater state machine (`idle` -> `checking` -> `available` -> `downloading` -> `downloaded` -> `error`).
- Real-time download progress bar displaying transfer percentage and byte rates.
- In-app toast banner allows one-click restart and installation (`quitAndInstall`).
- Web version disables desktop updater APIs and relies strictly on web builds.

## 3. Packaging & Distribution

- `npm run electron:dev`: Builds TypeScript main/preload scripts via `esbuild` and starts Electron connected to the Vite dev server.
- `npm run electron:build`: Compiles the web production bundle and invokes `electron-builder` to produce the standalone installer (`Bobby Setup.exe`) and portable executables.
