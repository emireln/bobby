import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'node:path'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Configure autoUpdater
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.allowPrerelease = false
autoUpdater.allowDowngrade = false

function sendUpdateStatus(status: string, extra: Record<string, unknown> = {}) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('app:update-status', {
      status,
      currentVersion: app.getVersion(),
      ...extra
    })
  }
}

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    sendUpdateStatus('checking')
  })

  autoUpdater.on('update-available', (info) => {
    sendUpdateStatus('available', {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: typeof info.releaseNotes === 'string' ? info.releaseNotes : undefined
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    sendUpdateStatus('not-available', {
      version: info?.version
    })
  })

  autoUpdater.on('error', (err) => {
    sendUpdateStatus('error', {
      error: err?.message || 'Error checking for updates'
    })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    sendUpdateStatus('downloading', {
      percent: Math.round(progressObj.percent),
      transferred: progressObj.transferred,
      total: progressObj.total,
      bytesPerSecond: progressObj.bytesPerSecond
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendUpdateStatus('downloaded', {
      version: info.version
    })
  })
}

function createWindow() {
  const iconPath =
    process.platform === 'win32'
      ? path.join(__dirname, '../build/icon.ico')
      : path.join(__dirname, '../build/icon.png')

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 860,
    minHeight: 640,
    frame: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    backgroundColor: '#09090b',
    icon: iconPath,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    // Check for updates automatically in packaged app on launch
    if (!isDev) {
      setTimeout(() => {
        autoUpdater.checkForUpdates().catch(() => {
          // Silent catch on launch
        })
      }, 3000)
    }
  })

  // Window state events
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximized-change', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximized-change', false)
  })

  // IPC handlers for custom window controls
  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    mainWindow?.close()
  })

  ipcMain.handle('window:is-maximized', () => {
    return mainWindow?.isMaximized() ?? false
  })

  // IPC handlers for auto-updates
  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })

  ipcMain.handle('app:check-for-updates', async () => {
    if (isDev) {
      sendUpdateStatus('not-available', { version: app.getVersion() })
      return {
        success: true,
        status: 'dev',
        currentVersion: app.getVersion()
      }
    }
    try {
      const result = await autoUpdater.checkForUpdates()
      return {
        success: true,
        updateInfo: result?.updateInfo
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      sendUpdateStatus('error', { error: msg })
      return {
        success: false,
        error: msg
      }
    }
  })

  ipcMain.handle('app:download-update', async () => {
    if (isDev) return { success: true }
    try {
      await autoUpdater.downloadUpdate()
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      sendUpdateStatus('error', { error: msg })
      return { success: false, error: msg }
    }
  })

  ipcMain.on('app:quit-and-install', () => {
    autoUpdater.quitAndInstall(false, true)
  })

  // Load URL or build
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else if (isDev) {
    mainWindow.loadURL('http://localhost:5190')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // System Tray setup
  createTray(iconPath)
}

function createTray(iconPath: string) {
  try {
    const trayIcon = nativeImage.createFromPath(iconPath)
    tray = new Tray(trayIcon)
    tray.setToolTip('Bobby - SVG Animated Avatar')

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Bobby',
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
            mainWindow.focus()
          }
        }
      },
      {
        label: 'Check for Updates...',
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
            mainWindow.focus()
          }
          if (!isDev) {
            autoUpdater.checkForUpdates().catch(() => {})
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit()
        }
      }
    ])

    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
      }
    })
  } catch (err) {
    console.error('Failed to initialize tray:', err)
  }
}

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    setupAutoUpdater()
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
