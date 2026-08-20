export interface UpdateStatusData {
  status: 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error' | 'dev'
  version?: string
  currentVersion: string
  releaseDate?: string
  releaseNotes?: string
  percent?: number
  transferred?: number
  total?: number
  bytesPerSecond?: number
  error?: string
}

export interface BobbyElectronApi {
  platform: string
  minimize: () => void
  maximize: () => void
  close: () => void
  isMaximized: () => Promise<boolean>
  onMaximizedChange: (callback: (maximized: boolean) => void) => () => void
  getVersion: () => Promise<string>
  checkForUpdates: () => Promise<{ success: boolean; updateInfo?: unknown; error?: string; status?: string }>
  downloadUpdate: () => Promise<{ success: boolean; error?: string }>
  quitAndInstall: () => void
  onUpdateStatus: (callback: (data: UpdateStatusData) => void) => () => void
}

declare global {
  const __APP_VERSION__: string
  interface Window {
    bobbyElectron?: BobbyElectronApi
  }
}
