<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '@/i18n'

export type ViewId = 'animations' | 'personnaliser' | 'reglages'

const view = defineModel<ViewId>({ default: 'personnaliser' })

const ITEMS = computed<Array<{ id: ViewId; label: string }>>(() => [
  { id: 'personnaliser', label: t('rail.customize') },
  { id: 'animations', label: t('rail.animations') },
  { id: 'reglages', label: t('rail.settings') }
])

const muted = ref<ViewId | null>(null)
</script>

<template>
  <nav
    class="fixed top-3 left-1/2 z-20 -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-white/85 p-1.5 shadow-sm backdrop-blur lg:top-1/2 lg:left-4 lg:translate-x-0 lg:-translate-y-1/2"
    :aria-label="t('rail.nav')"
  >
    <ul class="flex gap-1 lg:flex-col">
      <li
        v-for="item in ITEMS"
        :key="item.id"
        class="group relative"
        @pointerleave="muted = null"
      >
        <button
          type="button"
          class="nav-btn peer flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all duration-200"
          :class="
            view === item.id
              ? 'bg-[var(--ink)] text-[var(--paper)]'
              : 'text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)]'
          "
          :aria-label="item.label"
          :aria-current="view === item.id ? 'page' : undefined"
          @pointerdown="muted = item.id"
          @click="view = item.id"
        >
          <!-- Lucide Animated: Clapperboard (Animations) -->
          <svg
            v-if="item.id === 'animations'"
            class="lucide-icon icon-clapperboard h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <!-- Clapperboard bottom body -->
            <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4z" />
            <!-- Play triangle inside -->
            <polygon points="10 14 15 16.5 10 19 10 14" fill="currentColor" stroke="none" />
            <!-- Clapperboard top moving arm -->
            <g class="clapper-top origin-bottom-left transition-transform duration-300 ease-out">
              <path d="M4 11h16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4z" />
              <path d="m7 5 3 6" />
              <path d="m14 5 3 6" />
            </g>
          </svg>

          <!-- Lucide Animated: Settings Gear (Settings) -->
          <svg
            v-else-if="item.id === 'reglages'"
            class="lucide-icon icon-settings h-5 w-5 transition-transform duration-500 ease-out"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>

          <!-- Lucide Animated: Palette (Customize) -->
          <svg
            v-else
            class="lucide-icon icon-palette h-5 w-5 transition-transform duration-300 ease-out"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" class="dot-1 transition-transform duration-200" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" class="dot-2 transition-transform duration-200" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" class="dot-3 transition-transform duration-200" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" class="dot-4 transition-transform duration-200" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.562C22 6.5 17.5 2 12 2z" />
          </svg>
        </button>

        <!-- Tooltip -->
        <span
          class="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-lg bg-[var(--ink)] px-2.5 py-1.5 text-xs whitespace-nowrap text-[var(--paper)] opacity-0 transition peer-focus-visible:opacity-100 group-hover:opacity-100 lg:top-1/2 lg:left-full lg:mt-0 lg:ml-2 lg:-translate-y-1/2 lg:translate-x-1 lg:peer-focus-visible:translate-x-0 lg:group-hover:translate-x-0"
          :class="muted === item.id && 'opacity-0! lg:translate-x-1!'"
          role="tooltip"
        >
          {{ item.label }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Lucide Animated Hover Effects */

/* 1. Clapperboard: Hinge Opening Animation */
.nav-btn:hover .icon-clapperboard .clapper-top,
.nav-btn:focus-visible .icon-clapperboard .clapper-top {
  transform: rotate(-18deg) translateY(-2px);
  transform-origin: 4px 11px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 2. Settings: Smooth Gear Rotation */
.nav-btn:hover .icon-settings,
.nav-btn:focus-visible .icon-settings {
  transform: rotate(180deg);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 3. Palette: Tilt & Dot Pop Animation */
.nav-btn:hover .icon-palette,
.nav-btn:focus-visible .icon-palette {
  transform: rotate(-12deg) scale(1.08);
}

.nav-btn:hover .icon-palette .dot-1 {
  transform: scale(1.6) translate(-0.5px, -0.5px);
  transition-delay: 0.05s;
}
.nav-btn:hover .icon-palette .dot-2 {
  transform: scale(1.6) translate(0.5px, -0.5px);
  transition-delay: 0.1s;
}
.nav-btn:hover .icon-palette .dot-3 {
  transform: scale(1.6) translate(-0.5px, 0.5px);
  transition-delay: 0.15s;
}
.nav-btn:hover .icon-palette .dot-4 {
  transform: scale(1.6) translate(-0.5px, 0.5px);
  transition-delay: 0.2s;
}
</style>
