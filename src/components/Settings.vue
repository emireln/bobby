<script setup lang="ts">
import { computed } from 'vue'
import { langue, LANGUES, t } from '@/i18n'
import { theme, THEMES } from '@/ui/theme'
import { appVersion, checkForUpdates, downloadUpdate, isElectron, quitAndInstall, updateState } from '@/ui/updater'

/** Comptes de l'auteur. */
const AUTHOR_URL = 'https://github.com/emireln'
const GITHUB = 'https://github.com/emireln/bobby'
const SUPPORT_URL = 'https://buymeacoffee.com/emireln'

const credits = computed(() => {
  const [avant = '', apres = ''] = t('settings.credits').split('{name}')
  return { avant, apres }
})

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function auClavier(event: KeyboardEvent, index: number) {
  const pas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
  if (!pas) return
  event.preventDefault()
  const cible = LANGUES[(index + pas + LANGUES.length) % LANGUES.length]!
  langue.value = cible.id
  const boutons = (event.currentTarget as HTMLElement).parentElement?.children
  const suivant = boutons?.[LANGUES.indexOf(cible)]
  if (suivant instanceof HTMLElement) suivant.focus()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Language -->
    <div>
      <h2 class="text-sm font-semibold text-[var(--ink)]">{{ t('settings.language') }}</h2>
      <div class="mt-2.5 flex flex-col gap-1.5" role="radiogroup" :aria-label="t('settings.language')">
        <button
          v-for="(l, i) in LANGUES"
          :key="l.id"
          type="button"
          role="radio"
          :aria-checked="l.id === langue"
          :aria-label="l.nom"
          :lang="l.tag"
          :tabindex="l.id === langue ? 0 : -1"
          @keydown="auClavier($event, i)"
          class="flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left text-sm transition-all"
          :class="
            l.id === langue
              ? 'border-transparent bg-[var(--ink)] font-medium shadow-xs text-[var(--paper)]'
              : 'border-[var(--line)] bg-[var(--paper)]/85 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]'
          "
          @click="langue = l.id"
        >
          <!-- Flag icons -->
          <svg
            v-if="l.id === 'en'"
            width="22"
            height="15"
            viewBox="0 0 640 480"
            class="shrink-0 overflow-hidden rounded-[3px] shadow-xs"
            aria-hidden="true"
          >
            <g fill-rule="evenodd">
              <path fill="#bd3d44" d="M0 0h640v480H0z" />
              <path stroke="#fff" stroke-width="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640" />
              <path fill="#192f5d" d="M0 0h260v258.5H0z" />
              <g fill="#fff" transform="translate(10, 10) scale(0.95)">
                <circle cx="20" cy="20" r="10" /><circle cx="60" cy="20" r="10" /><circle cx="100" cy="20" r="10" /><circle cx="140" cy="20" r="10" /><circle cx="180" cy="20" r="10" /><circle cx="220" cy="20" r="10" />
                <circle cx="40" cy="55" r="10" /><circle cx="80" cy="55" r="10" /><circle cx="120" cy="55" r="10" /><circle cx="160" cy="55" r="10" /><circle cx="200" cy="55" r="10" />
                <circle cx="20" cy="90" r="10" /><circle cx="60" cy="90" r="10" /><circle cx="100" cy="90" r="10" /><circle cx="140" cy="90" r="10" /><circle cx="180" cy="90" r="10" /><circle cx="220" cy="90" r="10" />
                <circle cx="40" cy="125" r="10" /><circle cx="80" cy="125" r="10" /><circle cx="120" cy="125" r="10" /><circle cx="160" cy="125" r="10" /><circle cx="200" cy="125" r="10" />
                <circle cx="20" cy="160" r="10" /><circle cx="60" cy="160" r="10" /><circle cx="100" cy="160" r="10" /><circle cx="140" cy="160" r="10" /><circle cx="180" cy="160" r="10" /><circle cx="220" cy="160" r="10" />
                <circle cx="40" cy="195" r="10" /><circle cx="80" cy="195" r="10" /><circle cx="120" cy="195" r="10" /><circle cx="160" cy="195" r="10" /><circle cx="200" cy="195" r="10" />
                <circle cx="20" cy="230" r="10" /><circle cx="60" cy="230" r="10" /><circle cx="100" cy="230" r="10" /><circle cx="140" cy="230" r="10" /><circle cx="180" cy="230" r="10" /><circle cx="220" cy="230" r="10" />
              </g>
            </g>
          </svg>
          <svg
            v-else-if="l.id === 'pt-br'"
            width="22"
            height="15"
            viewBox="0 0 640 480"
            class="shrink-0 overflow-hidden rounded-[3px] shadow-xs"
            aria-hidden="true"
          >
            <g fill-rule="evenodd">
              <path fill="#009c3b" d="M0 0h640v480H0z" />
              <path fill="#ffdf00" d="M320 40L600 240L320 440L40 240Z" />
              <circle cx="320" cy="240" r="115" fill="#002776" />
              <path fill="#fff" d="M210 245 C 240 205, 390 205, 430 250 C 390 220, 240 220, 210 245 Z" />
            </g>
          </svg>
          <span class="flex-1">{{ l.nom }}</span>
          <svg
            v-if="l.id === langue"
            width="14"
            height="14"
            viewBox="0 0 12 12"
            aria-hidden="true"
            class="shrink-0 text-current"
          >
            <path
              d="M2.5 6.4 4.8 8.7 9.5 3.6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Theme -->
    <div>
      <h2 class="text-sm font-semibold text-[var(--ink)]">{{ t('settings.theme') }}</h2>
      <div class="mt-2.5 flex gap-1 rounded-2xl border border-[var(--line)] p-1 bg-[var(--paper)]/85 backdrop-blur-md" role="radiogroup" :aria-label="t('settings.theme')">
        <button
          v-for="th in THEMES"
          :key="th.id"
          type="button"
          role="radio"
          :aria-checked="th.id === theme"
          class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-semibold transition"
          :class="
            th.id === theme
              ? 'bg-[var(--ink)] text-[var(--paper)] shadow-xs'
              : 'text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]'
          "
          @click="theme = th.id"
        >
          <span>{{ t(`settings.${th.nom}`) }}</span>
        </button>
      </div>
    </div>

    <!-- Updates -->
    <div v-if="isElectron">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-[var(--ink)]">{{ t('settings.updates') }}</h2>
        <span class="rounded-full bg-[var(--line)] px-2 py-0.5 text-xs font-mono text-[var(--muted)]">v{{ appVersion }}</span>
      </div>

      <div class="mt-2.5 rounded-2xl border border-[var(--line)] bg-[var(--paper)]/85 p-3.5 shadow-xs space-y-3">
        <!-- Status Row -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span
              class="h-2 w-2 rounded-full shrink-0"
              :class="{
                'bg-green-500 animate-pulse': updateState.status === 'downloaded',
                'bg-blue-500 animate-spin': updateState.status === 'checking' || updateState.status === 'downloading',
                'bg-amber-500': updateState.status === 'available',
                'bg-emerald-500': updateState.status === 'not-available',
                'bg-red-500': updateState.status === 'error',
                'bg-zinc-400': updateState.status === 'idle' || updateState.status === 'dev'
              }"
            />
            <span class="text-xs text-[var(--ink)] font-medium">
              <template v-if="updateState.status === 'checking'">{{ t('settings.checking_updates') }}</template>
              <template v-else-if="updateState.status === 'available'">{{ t('settings.update_available', { version: updateState.version ?? '' }) }}</template>
              <template v-else-if="updateState.status === 'downloading'">{{ t('settings.downloading_update') }}</template>
              <template v-else-if="updateState.status === 'downloaded'">{{ t('settings.update_ready') }}</template>
              <template v-else-if="updateState.status === 'not-available'">{{ t('settings.up_to_date') }}</template>
              <template v-else-if="updateState.status === 'error'">{{ t('settings.update_error') }}</template>
              <template v-else>{{ t('settings.version') }}: v{{ appVersion }}</template>
            </span>
          </div>

          <!-- Check Action Button -->
          <button
            v-if="updateState.status === 'idle' || updateState.status === 'not-available' || updateState.status === 'dev'"
            type="button"
            class="flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-medium text-[var(--ink)] hover:bg-[var(--line)] transition cursor-pointer"
            @click="checkForUpdates"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>{{ t('settings.check_updates') }}</span>
          </button>
        </div>

        <!-- Download Progress Bar -->
        <div v-if="updateState.status === 'downloading'" class="space-y-1.5">
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
            <div
              class="h-full rounded-full bg-[var(--ink)] transition-all duration-300"
              :style="{ width: `${updateState.percent ?? 0}%` }"
            />
          </div>
          <div class="flex items-center justify-between text-[10px] text-[var(--muted)] tabular-nums">
            <span>{{ updateState.percent ?? 0 }}%</span>
            <span v-if="updateState.total">{{ formatBytes(updateState.transferred ?? 0) }} / {{ formatBytes(updateState.total) }}</span>
          </div>
        </div>

        <!-- Action: Download or Install or Retry -->
        <div v-if="updateState.status === 'available'" class="pt-1 flex items-center justify-between gap-2">
          <p v-if="updateState.releaseNotes" class="text-xs text-[var(--muted)] line-clamp-2">{{ updateState.releaseNotes }}</p>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-xl bg-[var(--ink)] px-3.5 py-1.5 text-xs font-semibold text-[var(--paper)] hover:opacity-90 active:scale-95 transition cursor-pointer ml-auto"
            @click="downloadUpdate"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>{{ t('settings.download_update') }}</span>
          </button>
        </div>

        <div v-else-if="updateState.status === 'downloaded'" class="pt-1 flex items-center justify-end">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-xl bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700 active:scale-95 transition cursor-pointer shadow-xs"
            @click="quitAndInstall"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{{ t('settings.restart_and_install') }}</span>
          </button>
        </div>

        <div v-else-if="updateState.status === 'error'" class="pt-1 flex items-center justify-between gap-2">
          <p class="text-xs text-[var(--danger)] line-clamp-1">{{ updateState.error || t('settings.update_error') }}</p>
          <button
            type="button"
            class="shrink-0 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs font-medium text-[var(--ink)] hover:bg-[var(--line)] transition cursor-pointer"
            @click="checkForUpdates"
          >
            {{ t('settings.update_retry') }}
          </button>
        </div>
      </div>
    </div>

    <!-- About -->
    <div>
      <h2 class="text-sm font-semibold text-[var(--ink)]">{{ t('settings.about') }}</h2>
      <div class="mt-2.5 flex flex-col gap-2">
        <a
          class="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)]/85 px-3.5 py-2.5 text-sm text-[var(--ink)] transition hover:bg-[var(--line)] shadow-xs"
          :href="GITHUB"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('settings.githubAria')"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" class="shrink-0">
            <path
              d="M8 .5a7.5 7.5 0 0 0-2.37 14.62c.37.07.5-.16.5-.36v-1.3c-2.09.46-2.53-.99-2.53-.99-.34-.87-.83-1.1-.83-1.1-.68-.47.05-.46.05-.46.75.06 1.15.78 1.15.78.67 1.15 1.76.82 2.19.63.07-.49.26-.83.48-1.02-1.67-.19-3.42-.83-3.42-3.72 0-.82.29-1.5.78-2.02-.08-.19-.34-.96.07-1.99 0 0 .63-.2 2.06.77a7.1 7.1 0 0 1 3.75 0c1.43-.97 2.06-.77 2.06-.77.41 1.03.15 1.8.07 1.99.49.52.78 1.2.78 2.02 0 2.9-1.76 3.53-3.44 3.71.27.23.51.69.51 1.39v2.06c0 .2.13.44.51.36A7.5 7.5 0 0 0 8 .5z"
              fill="currentColor"
            />
          </svg>
          <span class="flex-1 font-medium">{{ t('settings.github') }}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
            class="shrink-0 text-[var(--muted)]"
          >
            <path
              d="M4 2h6v6M10 2 3 9"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>

        <a
          class="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)]/85 px-3.5 py-2.5 text-sm text-[var(--ink)] transition hover:bg-[var(--line)] shadow-xs"
          :href="SUPPORT_URL"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('settings.support')"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="shrink-0 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12"
            aria-hidden="true"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
          <span class="flex-1 font-medium">{{ t('settings.support') }}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
            class="shrink-0 text-[var(--muted)]"
          >
            <path
              d="M4 2h6v6M10 2 3 9"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- Author credits -->
    <p class="text-xs text-[var(--muted)] pt-1">
      {{ credits.avant
      }}<a
        class="font-medium text-[var(--ink)] underline decoration-[var(--line)] underline-offset-2 transition hover:decoration-[var(--ink)]"
        :href="AUTHOR_URL"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t('settings.creditsAria')"
        >Emir Lima Neto</a
      >{{ credits.apres }}
    </p>
  </div>
</template>
