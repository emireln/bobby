<script setup lang="ts">
import { ref } from 'vue'
import BotTile from '@/components/BotTile.vue'
import HistoryIcon from '@/components/icons/HistoryIcon.vue'
import { DEFAULT_EXPRESSION, EXPRESSIONS } from '@/bot/expressions'
import { COLORS, SHAPES } from '@/bot/skins'
import { t } from '@/i18n'
import { isDark } from '@/ui/theme'
import { saveToVault } from '@/ui/vault'

const shape = defineModel<string>('shape', { required: true })
const color = defineModel<string>('color', { required: true })
const expression = defineModel<string>('expression', { required: true })
const eyeColor = defineModel<string>('eyeColor', { default: 'blanc' })

/**
 * Les vignettes sont figees a la meme date que la pose de repos : elles montrent
 * la forme et le visage tels qu'ils apparaitront, pas un aplat abstrait.
 */
const PREVIEW_AT = 1

const newAvatarName = ref('')
const saveMessage = ref('')
const hoveredReset = ref(false)

function resetToDefault() {
  shape.value = 'nuage'
  color.value = isDark.value ? 'blanc' : 'encre'
  expression.value = DEFAULT_EXPRESSION
  eyeColor.value = color.value === 'blanc' ? 'encre' : 'blanc'
}

function randomize() {
  const s = SHAPES[Math.floor(Math.random() * SHAPES.length)]
  const e = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)]
  const c = COLORS[Math.floor(Math.random() * COLORS.length)]
  if (s) shape.value = s.id
  if (e) expression.value = e.id
  if (c) color.value = c.id
}

function onSaveCurrent() {
  const shapeKey = `shapes.${shape.value}` as Parameters<typeof t>[0]
  const colorKey = `colors.${color.value}` as Parameters<typeof t>[0]
  const name =
    newAvatarName.value.trim() ||
    `${t(shapeKey)} ${t(colorKey)}`

  saveToVault({
    name,
    shape: shape.value,
    color: color.value,
    expression: expression.value,
    eyeColor: eyeColor.value
  })

  newAvatarName.value = ''
  saveMessage.value = t('vault.saved')
  setTimeout(() => {
    saveMessage.value = ''
  }, 2200)
}
</script>

<template>
  <div class="space-y-5">
    <!-- Forme -->
    <div>
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">{{ t('panel.shape') }}</h2>
        <div class="flex items-center gap-1.5">
          <!-- Couleur des yeux (blanc / noir) -->
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
            :title="eyeColor === 'blanc' ? t('panel.eye_white') : t('panel.eye_black')"
            :aria-label="eyeColor === 'blanc' ? t('panel.eye_white') : t('panel.eye_black')"
            @click="eyeColor = eyeColor === 'blanc' ? 'encre' : 'blanc'"
          >
            <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" :fill="eyeColor === 'blanc' ? '#ffffff' : '#0a0a0c'" :stroke="eyeColor === 'blanc' ? '#71717a' : 'none'" stroke-width="1.5" />
            </svg>
            <span>{{ eyeColor === 'blanc' ? t('panel.eye_white') : t('panel.eye_black') }}</span>
          </button>

          <!-- Reinitialiser -->
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
            :title="t('panel.reset')"
            :aria-label="t('panel.reset')"
            @mouseenter="hoveredReset = true"
            @mouseleave="hoveredReset = false"
            @click="resetToDefault"
          >
            <HistoryIcon :size="14" :hovered="hoveredReset" />
            <span>{{ t('panel.reset') }}</span>
          </button>

          <!-- Aleatoire -->
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
      </div>
      <div class="mt-2 grid grid-cols-4 gap-2">
        <BotTile
          v-for="s in SHAPES"
          :key="s.id"
          :label="t(`shapes.${s.id}`)"
          :selected="shape === s.id"
          :shape="s.id"
          :color="color"
          :expression="expression"
          :eye-color="eyeColor"
          :frozen-at="PREVIEW_AT"
          @click="shape = s.id"
        />
      </div>
    </div>

    <!-- Couleur -->
    <div>
      <h2 class="text-sm font-semibold">{{ t('panel.color') }}</h2>
      <div class="mt-2 grid grid-cols-6 gap-2">
        <button
          v-for="c in COLORS"
          :key="c.id"
          type="button"
          class="aspect-square cursor-pointer rounded-xl border-2 transition"
          :class="color === c.id ? 'border-[var(--ink)] scale-105' : 'border-[var(--line)] hover:scale-105'"
          :style="{ backgroundColor: c.hex }"
          :aria-label="t(`colors.${c.id}`)"
          :aria-pressed="color === c.id"
          @click="color = c.id"
        />
      </div>
    </div>

    <!-- Expression -->
    <div>
      <h2 class="text-sm font-semibold">{{ t('panel.expression') }}</h2>
      <div class="mt-2 grid grid-cols-4 gap-2">
        <BotTile
          v-for="e in EXPRESSIONS"
          :key="e.id"
          :label="t(`expressions.${e.id}`)"
          :selected="expression === e.id"
          :shape="shape"
          :color="color"
          :expression="e.id"
          :eye-color="eyeColor"
          :frozen-at="PREVIEW_AT"
          @click="expression = e.id"
        />
      </div>
    </div>

    <!-- Sauvegarder dans le Cofre -->
    <div class="border-t border-[var(--line)] pt-4">
      <h2 class="text-sm font-semibold">{{ t('vault.save') }}</h2>
      <div class="mt-2 flex items-center gap-1.5">
        <input
          v-model="newAvatarName"
          type="text"
          maxlength="30"
          :placeholder="t('vault.name_placeholder')"
          class="flex-1 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] transition focus-within:border-[var(--ink)]"
          @keyup.enter="onSaveCurrent"
        />
        <button
          type="button"
          class="flex items-center gap-1 rounded-xl bg-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-[var(--paper)] transition hover:opacity-90 cursor-pointer shrink-0 shadow-sm"
          @click="onSaveCurrent"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>{{ t('vault.save') }}</span>
        </button>
      </div>

      <!-- Toast / Message de retour -->
      <div v-if="saveMessage" class="mt-1.5 text-xs font-medium text-green-600 transition">
        {{ saveMessage }}
      </div>
    </div>
  </div>
</template>
