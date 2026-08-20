import { computed, reactive, ref } from 'vue'
import type { UpdateStatusData } from '@/electron'

const initialVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.1.36'

export const isElectron = computed(() => typeof window !== 'undefined' && !!window.bobbyElectron)
export const appVersion = ref(initialVersion)

export const updateState = reactive<UpdateStatusData>({
  status: 'idle',
  currentVersion: initialVersion,
  percent: 0
})

let listenerInitialized = false

export function initUpdater() {
  if (typeof window === 'undefined' || !window.bobbyElectron || listenerInitialized) return
  listenerInitialized = true

  window.bobbyElectron.getVersion().then((v) => {
    if (v) {
      appVersion.value = v
      updateState.currentVersion = v
    }
  }).catch(() => {})

  window.bobbyElectron.onUpdateStatus((data) => {
    Object.assign(updateState, data)
  })
}

export async function checkForUpdates() {
  if (isElectron.value && window.bobbyElectron) {
    updateState.status = 'checking'
    updateState.error = undefined
    try {
      const res = await window.bobbyElectron.checkForUpdates()
      if (!res.success && res.error) {
        updateState.status = 'error'
        updateState.error = res.error
      }
    } catch (err: unknown) {
      updateState.status = 'error'
      updateState.error = err instanceof Error ? err.message : String(err)
    }
    return
  }

  // Web fallback: query latest tag from GitHub
  updateState.status = 'checking'
  updateState.error = undefined
  try {
    const res = await fetch('https://api.github.com/repos/emireln/bobby/releases/latest', {
      headers: { Accept: 'application/vnd.github.v3+json' }
    })
    if (!res.ok) {
      updateState.status = 'not-available'
      return
    }
    const data = await res.json()
    const latestTag = (data.tag_name || '').replace(/^v/, '')
    if (latestTag && latestTag !== appVersion.value) {
      updateState.status = 'available'
      updateState.version = latestTag
      updateState.releaseNotes = data.body
      updateState.releaseDate = data.published_at
    } else {
      updateState.status = 'not-available'
      updateState.version = appVersion.value
    }
  } catch {
    updateState.status = 'not-available'
  }
}

export async function downloadUpdate() {
  if (isElectron.value && window.bobbyElectron) {
    updateState.status = 'downloading'
    await window.bobbyElectron.downloadUpdate()
  } else {
    window.open('https://github.com/emireln/bobby/releases/latest', '_blank')
  }
}

export function quitAndInstall() {
  if (isElectron.value && window.bobbyElectron) {
    window.bobbyElectron.quitAndInstall()
  }
}
