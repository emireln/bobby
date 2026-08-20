import { contextBridge, ipcRenderer } from 'electron'

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

const api: BobbyElectronApi = {
  platform: process.platform,
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  onMaximizedChange: (callback) => {
    const handler = (_event: unknown, maximized: boolean) => callback(maximized)
    ipcRenderer.on('window:maximized-change', handler)
    return () => {
      ipcRenderer.removeListener('window:maximized-change', handler)
    }
  },
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  checkForUpdates: () => ipcRenderer.invoke('app:check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('app:download-update'),
  quitAndInstall: () => ipcRenderer.send('app:quit-and-install'),
  onUpdateStatus: (callback) => {
    const handler = (_event: unknown, data: UpdateStatusData) => callback(data)
    ipcRenderer.on('app:update-status', handler)
    return () => {
      ipcRenderer.removeListener('app:update-status', handler)
    }
  }
}

contextBridge.exposeInMainWorld('bobbyElectron', api)
