export interface BobbyElectronApi {
  platform: string
  minimize: () => void
  maximize: () => void
  close: () => void
  isMaximized: () => Promise<boolean>
  onMaximizedChange: (callback: (maximized: boolean) => void) => () => void
}

declare global {
  interface Window {
    bobbyElectron?: BobbyElectronApi
  }
}
