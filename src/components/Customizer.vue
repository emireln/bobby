<script setup lang="ts">
import BotTile from '@/components/BotTile.vue'
import { EXPRESSIONS } from '@/bot/expressions'
import { COLORS, SHAPES } from '@/bot/skins'
import { t } from '@/i18n'

const shape = defineModel<string>('shape', { required: true })
const color = defineModel<string>('color', { required: true })
const expression = defineModel<string>('expression', { required: true })
const bubble = defineModel<string>('bubble', { default: '' })

/**
 * Les vignettes sont figees a la meme date que la pose de repos : elles montrent
 * la forme et le visage tels qu'ils apparaitront, pas un aplat abstrait.
 */
const PREVIEW_AT = 1

function randomize() {
  const s = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  const e = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)]
  const c = COLORS[Math.floor(Math.random() * COLORS.length)]
  if (s) shape.value = s.id
  if (e) expression.value = e.id
  if (c) color.value = c.id
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold">{{ t('panel.shape') }}</h2>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
        :title="t('panel.randomize')"
        :aria-label="t('panel.randomize')"
        @click="randomize"
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="3" />
          <path d="M16 8h.01M8 8h.01M8 16h.01M16 16h.01M12 12h.01" />
        </svg>
        <span>{{ t('panel.randomize') }}</span>
      </button>
    </div>
    <div class="mt-2 grid grid-cols-4 gap-1.5">
      <BotTile
        v-for="s in SHAPES"
        :key="s.id"
        :label="t(`shapes.${s.id}`)"
        :selected="s.id === shape"
        :shape="s.id"
        :color="color"
        :expression="expression"
        :frozen-at="PREVIEW_AT"
        @click="shape = s.id"
      />
    </div>

    <h2 class="mt-5 text-sm font-semibold">{{ t('panel.expression') }}</h2>
    <div class="mt-2 grid grid-cols-4 gap-1.5">
      <BotTile
        v-for="e in EXPRESSIONS"
        :key="e.id"
        :label="t(`expressions.${e.id}`)"
        :selected="e.id === expression"
        :shape="shape"
        :color="color"
        :expression="e.id"
        :frozen-at="PREVIEW_AT"
        @click="expression = e.id"
      />
    </div>

    <h2 class="mt-5 text-sm font-semibold">{{ t('panel.color') }}</h2>
    <div class="mt-2 grid grid-cols-6 gap-1.5">
      <button
        v-for="c in COLORS"
        :key="c.id"
        type="button"
        class="flex aspect-square cursor-pointer items-center justify-center rounded-full border-2 transition"
        :class="
          c.id === color ? 'border-[var(--ink)]' : 'border-transparent hover:border-[var(--line)]'
        "
        :aria-label="t(`colors.${c.id}`)"
        :aria-pressed="c.id === color"
        @click="color = c.id"
      >
        <!-- liseré interne : sinon la pastille creme disparait sur fond clair -->
        <span
          class="block h-[78%] w-[78%] rounded-full ring-1 ring-black/10 ring-inset"
          :style="{ background: c.hex }"
        />
      </button>
    </div>

    <div class="mt-5 flex items-center justify-between">
      <h2 class="text-sm font-semibold">{{ t('panel.bubble') }}</h2>
      <span class="text-xs text-[var(--muted)]">{{ bubble.length }}/40</span>
    </div>
    <div class="mt-2 flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 transition focus-within:border-[var(--ink)]">
      <input
        v-model="bubble"
        type="text"
        maxlength="40"
        :placeholder="t('panel.bubble_placeholder')"
        class="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
      />
      <button
        v-if="bubble"
        type="button"
        class="cursor-pointer text-xs text-[var(--muted)] hover:text-[var(--ink)]"
        :title="t('panel.bubble_clear')"
        :aria-label="t('panel.bubble_clear')"
        @click="bubble = ''"
      >
        ✕
      </button>
    </div>
  </div>
</template>
