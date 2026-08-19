<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isElectron = ref(typeof window !== 'undefined' && 'bobbyElectron' in window)
const isMaximized = ref(false)
let cleanupMaximized: (() => void) | null = null

onMounted(async () => {
  if (isElectron.value && window.bobbyElectron) {
    isMaximized.value = await window.bobbyElectron.isMaximized()
    cleanupMaximized = window.bobbyElectron.onMaximizedChange((val) => {
      isMaximized.value = val
    })
  }
})

onUnmounted(() => {
  cleanupMaximized?.()
})

function minimize() {
  window.bobbyElectron?.minimize()
}

function maximize() {
  window.bobbyElectron?.maximize()
}

function close() {
  window.bobbyElectron?.close()
}
</script>

<template>
  <div
    v-if="isElectron"
    class="titlebar select-none flex h-8 w-full items-center justify-between border-b border-[var(--line)] bg-[var(--paper)] px-3 text-[var(--ink)] transition-colors z-50 fixed top-0 left-0 right-0"
    style="-webkit-app-region: drag;"
  >
    <!-- Logo & Titre -->
    <div class="flex items-center gap-2" style="-webkit-app-region: drag;">
      <svg class="h-4 w-4" viewBox="-110 -110 220 220" fill="currentColor">
        <path d="M91.68 0.26C92.98 3.26 94 6.44 94.69 9.63C95.39 12.81 95.77 16.13 95.83 19.4C95.89 22.66 95.62 25.99 95.05 29.2C94.47 32.42 93.56 35.63 92.37 38.67C91.18 41.7 89.66 44.68 87.91 47.42C86.15 50.17 84.08 52.79 81.82 55.13C79.57 57.48 77.03 59.64 74.36 61.5C71.69 63.36 68.78 64.98 65.8 66.28C62.82 67.58 59.65 68.6 56.48 69.29C53.3 69.97 49.39 69.22 46.74 70.4C44.09 71.58 42.78 74.52 40.58 76.36C38.39 78.21 36.03 79.93 33.57 81.46C31.12 82.98 28.51 84.36 25.84 85.51C23.17 86.67 20.37 87.65 17.55 88.41C14.73 89.17 11.81 89.73 8.9 90.06C6 90.39 3.03 90.51 0.1 90.42C-2.82 90.32 -5.77 90 -8.64 89.47C-11.51 88.95 -14.37 88.2 -17.12 87.27C-19.87 86.33 -22.57 85.18 -25.14 83.86C-27.7 82.55 -30.16 80.98 -32.51 79.37C-34.86 77.77 -36.49 75.09 -39.24 74.23C-42 73.36 -45.79 74.48 -49.04 74.16C-52.28 73.84 -55.57 73.21 -58.73 72.29C-61.88 71.37 -65.01 70.14 -67.96 68.65C-70.91 67.17 -73.77 65.37 -76.41 63.35C-79.04 61.34 -81.53 59.04 -83.75 56.56C-85.97 54.09 -88 51.36 -89.73 48.51C-91.46 45.67 -92.96 42.61 -94.13 39.49C-95.31 36.37 -96.21 33.08 -96.79 29.8C-97.38 26.52 -97.66 23.13 -97.63 19.8C-97.6 16.47 -97.25 13.09 -96.61 9.84C-95.97 6.58 -95.02 3.33 -93.8 0.26C-92.58 -2.81 -91.06 -5.8 -89.31 -8.58C-87.57 -11.36 -85.53 -14.01 -83.33 -16.41C-81.13 -18.81 -78.05 -20.76 -76.11 -22.97C-74.17 -25.17 -72.55 -27.13 -71.7 -29.62C-70.85 -32.11 -71.48 -35.19 -71.01 -37.93C-70.54 -40.67 -69.83 -43.42 -68.88 -46.05C-67.94 -48.68 -66.75 -51.28 -65.36 -53.72C-63.97 -56.15 -62.34 -58.51 -60.54 -60.67C-58.74 -62.83 -56.72 -64.86 -54.57 -66.67C-52.42 -68.48 -50.07 -70.13 -47.64 -71.53C-45.21 -72.93 -42.61 -74.13 -39.98 -75.08C-37.34 -76.03 -34.59 -76.75 -31.84 -77.22C-29.09 -77.69 -26.26 -77.91 -23.49 -77.9C-20.72 -77.88 -17.92 -77.61 -15.21 -77.11C-12.51 -76.62 -9.82 -75.87 -7.27 -74.92C-4.71 -73.98 -2.22 -72.8 0.1 -71.45C2.43 -70.11 4.55 -68.04 6.68 -66.86C8.81 -65.68 10.62 -64.39 12.9 -64.38C15.18 -64.37 17.8 -66.21 20.35 -66.79C22.89 -67.37 25.55 -67.73 28.18 -67.84C30.81 -67.95 33.5 -67.82 36.12 -67.45C38.74 -67.08 41.38 -66.46 43.91 -65.61C46.43 -64.76 48.92 -63.67 51.26 -62.37C53.59 -61.07 55.85 -59.53 57.91 -57.82C59.97 -56.12 61.92 -54.18 63.63 -52.13C65.35 -50.07 66.91 -47.81 68.23 -45.47C69.54 -43.13 70.66 -40.63 71.52 -38.1C72.39 -35.56 73.03 -32.9 73.43 -30.25C73.82 -27.61 72.69 -24.63 73.87 -22.22C75.06 -19.81 78.37 -18.13 80.54 -15.81C82.71 -13.5 85.04 -11 86.9 -8.32C88.75 -5.65 90.38 -2.73 91.68 0.26Z" />
      </svg>
      <span class="text-xs font-semibold tracking-tight">bobby</span>
    </div>

    <!-- Boutons de controle -->
    <div class="flex items-center" style="-webkit-app-region: no-drag;">
      <!-- Reduire -->
      <button
        type="button"
        class="flex h-8 w-10 items-center justify-center text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
        title="Minimize"
        aria-label="Minimize"
        @click="minimize"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <!-- Agrandir / Restaurer -->
      <button
        type="button"
        class="flex h-8 w-10 items-center justify-center text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
        :title="isMaximized ? 'Restore' : 'Maximize'"
        :aria-label="isMaximized ? 'Restore' : 'Maximize'"
        @click="maximize"
      >
        <svg v-if="!isMaximized" class="h-3 w-3" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>
        <svg v-else class="h-3 w-3" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>

      <!-- Fermer -->
      <button
        type="button"
        class="flex h-8 w-10 items-center justify-center text-[var(--muted)] hover:bg-red-500 hover:text-white transition cursor-pointer"
        title="Close"
        aria-label="Close"
        @click="close"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </div>
</template>
