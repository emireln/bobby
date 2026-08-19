import { contextBridge, ipcRenderer } from 'electron'

export interface BobbyElectronApi {
  platform: string
  minimize: () => void
  maximize: () => void
  close: () => void
  isMaximized: () => Promise<boolean>
  onMaximizedChange: (callback: (maximized: boolean) => void) => () => void
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
  }
}

contextBridge.exposeInMainWorld('bobbyElectron', api)
