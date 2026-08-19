<script setup lang="ts">
import { ref } from 'vue'
import BotTile from '@/components/BotTile.vue'
import { EXPRESSIONS } from '@/bot/expressions'
import { COLORS, SHAPES } from '@/bot/skins'
import { t } from '@/i18n'
import {
  exportVaultJson,
  loadVault,
  parseVaultImport,
  persistVault,
  removeFromVault,
  saveToVault,
  type SavedAvatar
} from '@/ui/vault'

const shape = defineModel<string>('shape', { required: true })
const color = defineModel<string>('color', { required: true })
const expression = defineModel<string>('expression', { required: true })
const bubble = defineModel<string>('bubble', { default: '' })

/**
 * Les vignettes sont figees a la meme date que la pose de repos : elles montrent
 * la forme et le visage tels qu'ils apparaitront, pas un aplat abstrait.
 */
const PREVIEW_AT = 1

const vault = ref<SavedAvatar[]>(loadVault())
const newAvatarName = ref('')
const saveMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

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
  const { vault: updated } = saveToVault(
    {
      name,
      shape: shape.value,
      color: color.value,
      expression: expression.value,
      bubble: bubble.value.trim() || undefined
    },
    vault.value
  )
  vault.value = updated
  newAvatarName.value = ''
  saveMessage.value = t('vault.saved')
  setTimeout(() => {
    saveMessage.value = ''
  }, 2000)
}

function onLoadAvatar(av: SavedAvatar) {
  shape.value = av.shape
  color.value = av.color
  expression.value = av.expression
  bubble.value = av.bubble ?? ''
}

function onDeleteAvatar(id: string, event: Event) {
  event.stopPropagation()
  vault.value = removeFromVault(id, vault.value)
}

function onExportVault() {
  exportVaultJson(vault.value)
}

function triggerImport() {
  fileInput.value?.click()
}

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string
      const imported = parseVaultImport(content)
      if (imported.length > 0) {
        // Merge with existing vault, avoiding duplicate IDs
        const existingIds = new Set(vault.value.map((a) => a.id))
        const merged = [...imported.filter((a) => !existingIds.has(a.id)), ...vault.value]
        vault.value = merged
        persistVault(merged)
        saveMessage.value = t('vault.import_success')
        setTimeout(() => {
          saveMessage.value = ''
        }, 2500)
      } else {
        saveMessage.value = t('vault.import_error')
        setTimeout(() => {
          saveMessage.value = ''
        }, 2500)
      }
    } catch {
      saveMessage.value = t('vault.import_error')
      setTimeout(() => {
        saveMessage.value = ''
      }, 2500)
    }
    target.value = ''
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="space-y-5">
    <!-- Forme -->
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
    </div>

    <!-- Expression -->
    <div>
      <h2 class="text-sm font-semibold">{{ t('panel.expression') }}</h2>
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
    </div>

    <!-- Couleur -->
    <div>
      <h2 class="text-sm font-semibold">{{ t('panel.color') }}</h2>
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
          <span
            class="block h-[78%] w-[78%] rounded-full ring-1 ring-black/10 ring-inset"
            :style="{ background: c.hex }"
          />
        </button>
      </div>
    </div>

    <!-- Bulle de dialogue -->
    <div>
      <div class="flex items-center justify-between">
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

    <!-- Coffre d'avatars (Avatar Vault) -->
    <div class="border-t border-[var(--line)] pt-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <svg class="h-4 w-4 text-[var(--ink)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h2 class="text-sm font-semibold">{{ t('vault.title') }}</h2>
        </div>

        <div class="flex items-center gap-1">
          <!-- Exporter le coffre -->
          <button
            v-if="vault.length > 0"
            type="button"
            class="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
            :title="t('vault.export_all')"
            :aria-label="t('vault.export_all')"
            @click="onExportVault"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>JSON</span>
          </button>

          <!-- Importer du JSON -->
          <button
            type="button"
            class="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
            :title="t('vault.import')"
            :aria-label="t('vault.import')"
            @click="triggerImport"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <span>{{ t('vault.import') }}</span>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".json,application/json"
            class="hidden"
            @change="onFileSelected"
          />
        </div>
      </div>

      <!-- Enregistrer l'avatar actuel -->
      <div class="mt-2.5 flex items-center gap-1.5">
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
          class="flex items-center gap-1 rounded-xl bg-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-[var(--paper)] transition hover:opacity-90 cursor-pointer shrink-0"
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
      <div v-if="saveMessage" class="mt-1 text-xs font-medium text-[var(--ink)] transition">
        {{ saveMessage }}
      </div>

      <!-- Grille des avatars sauvegardes -->
      <div v-if="vault.length > 0" class="mt-3 grid grid-cols-4 gap-1.5">
        <div
          v-for="av in vault"
          :key="av.id"
          class="group relative flex flex-col items-center rounded-xl border border-[var(--line)] bg-[var(--paper)] p-1 transition hover:border-[var(--ink)] cursor-pointer"
          :class="
            av.shape === shape && av.color === color && av.expression === expression
              ? 'ring-2 ring-[var(--ink)] border-transparent'
              : ''
          "
          :title="`${av.name} (${t('vault.load')})`"
          @click="onLoadAvatar(av)"
        >
          <div class="relative w-full aspect-square flex items-center justify-center">
            <BotTile
              :label="av.name"
              :selected="av.shape === shape && av.color === color && av.expression === expression"
              :shape="av.shape"
              :color="av.color"
              :expression="av.expression"
              :frozen-at="PREVIEW_AT"
            />
            <!-- Badge bulle de parole -->
            <span
              v-if="av.bubble"
              class="absolute bottom-1 right-1 rounded-full bg-[var(--ink)] p-0.5 text-[var(--paper)]"
              :title="av.bubble"
            >
              <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
          </div>
          <span class="mt-1 w-full truncate text-center text-[10px] font-medium text-[var(--muted)] group-hover:text-[var(--ink)]">
            {{ av.name }}
          </span>

          <!-- Bouton de suppression -->
          <button
            type="button"
            class="absolute -top-1 -right-1 hidden h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] text-[10px] group-hover:flex cursor-pointer hover:scale-110 transition shadow-sm"
            :title="t('vault.delete')"
            :aria-label="t('vault.delete')"
            @click="onDeleteAvatar(av.id, $event)"
          >
            ✕
          </button>
        </div>
      </div>

      <p v-else class="mt-2 text-xs text-[var(--muted)] text-center py-2">
        {{ t('vault.empty') }}
      </p>
    </div>
  </div>
</template>

