<script setup lang="ts">
import { computed, ref } from 'vue'
import ArchiveIcon from '@/components/icons/ArchiveIcon.vue'
import ClapIcon from '@/components/icons/ClapIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import SprayCanIcon from '@/components/icons/SprayCanIcon.vue'
import { t } from '@/i18n'

export type ViewId = 'personnaliser' | 'animations' | 'coffre' | 'reglages'

const view = defineModel<ViewId>({ default: 'personnaliser' })

const ITEMS = computed<Array<{ id: ViewId; label: string }>>(() => [
  { id: 'personnaliser', label: t('rail.customize') },
  { id: 'animations', label: t('rail.animations') },
  { id: 'coffre', label: t('rail.vault') },
  { id: 'reglages', label: t('rail.settings') }
])

const hoveredItem = ref<ViewId | null>(null)
const muted = ref<ViewId | null>(null)
</script>

<template>
  <nav
    class="fixed top-3 left-1/2 z-20 -translate-x-1/2 rounded-2xl border border-[var(--line)] bg-white/90 p-2 shadow-md backdrop-blur-md lg:top-1/2 lg:left-6 lg:translate-x-0 lg:-translate-y-1/2"
    :aria-label="t('rail.nav')"
  >
    <ul class="flex gap-1.5 lg:flex-col">
      <li
        v-for="item in ITEMS"
        :key="item.id"
        class="group relative"
        @mouseenter="hoveredItem = item.id"
        @mouseleave="hoveredItem = null; muted = null"
      >
        <button
          type="button"
          class="peer flex h-11 w-11 lg:h-12 lg:w-12 cursor-pointer items-center justify-center rounded-xl lg:rounded-2xl transition-all duration-200"
          :class="
            view === item.id
              ? 'bg-[var(--ink)] text-[var(--paper)] shadow-sm'
              : 'text-[var(--muted)] hover:bg-black/5 hover:text-[var(--ink)]'
          "
          :aria-label="item.label"
          :aria-current="view === item.id ? 'page' : undefined"
          @pointerdown="muted = item.id"
          @click="view = item.id"
        >
          <!-- Animations: ClapIcon -->
          <ClapIcon
            v-if="item.id === 'animations'"
            :size="24"
            :hovered="hoveredItem === 'animations'"
          />

          <!-- Vault: ArchiveIcon -->
          <ArchiveIcon
            v-else-if="item.id === 'coffre'"
            :size="24"
            :hovered="hoveredItem === 'coffre'"
          />

          <!-- Settings: SettingsIcon -->
          <SettingsIcon
            v-else-if="item.id === 'reglages'"
            :size="24"
            :hovered="hoveredItem === 'reglages'"
          />

          <!-- Personalize: SprayCanIcon -->
          <SprayCanIcon
            v-else
            :size="24"
            :hovered="hoveredItem === 'personnaliser'"
          />
        </button>

        <!-- Tooltip -->
        <span
          class="pointer-events-none absolute top-full left-1/2 z-10 mt-2.5 -translate-x-1/2 rounded-xl bg-[var(--ink)] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[var(--paper)] opacity-0 shadow-lg transition peer-focus-visible:opacity-100 group-hover:opacity-100 lg:top-1/2 lg:left-full lg:mt-0 lg:ml-3 lg:-translate-y-1/2 lg:translate-x-1 lg:peer-focus-visible:translate-x-0 lg:group-hover:translate-x-0"
          :class="muted === item.id && 'opacity-0! lg:translate-x-1!'"
          role="tooltip"
        >
          {{ item.label }}
        </span>
      </li>
    </ul>
  </nav>
</template>
