<script setup lang="ts">
import { ref } from 'vue'
import BotTile from '@/components/BotTile.vue'
import { EXPRESSIONS } from '@/bot/expressions'
import { COLORS, SHAPES } from '@/bot/skins'
import { t } from '@/i18n'
import {
  clearVault,
  exportVaultJson,
  loadVault,
  parseVaultImport,
  persistVault,
  removeFromVault,
  renameInVault,
  reorderVault,
  saveToVault,
  updateInVault,
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
const editingId = ref<string | null>(null)
const editingName = ref('')

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
  if (editingId.value === id) {
    editingId.value = null
  }
}

function onStartRename(av: SavedAvatar, event: Event) {
  event.stopPropagation()
  editingId.value = av.id
  editingName.value = av.name
}

function onSaveRename(id: string, event?: Event) {
  event?.stopPropagation()
  if (editingName.value.trim()) {
    vault.value = renameInVault(id, editingName.value.trim(), vault.value)
  }
  editingId.value = null
  editingName.value = ''
}

function onCancelRename(event?: Event) {
  event?.stopPropagation()
  editingId.value = null
  editingName.value = ''
}

function onMoveAvatar(index: number, direction: -1 | 1, event: Event) {
  event.stopPropagation()
  const targetIndex = index + direction
  if (targetIndex >= 0 && targetIndex < vault.value.length) {
    vault.value = reorderVault(index, targetIndex, vault.value)
  }
}

function onUpdateAvatarLook(id: string, event: Event) {
  event.stopPropagation()
  vault.value = updateInVault(
    id,
    {
      shape: shape.value,
      color: color.value,
      expression: expression.value,
      bubble: bubble.value.trim() || undefined
    },
    vault.value
  )
  saveMessage.value = t('vault.saved')
  setTimeout(() => {
    saveMessage.value = ''
  }, 2000)
}

function onSortByName() {
  const sorted = [...vault.value].sort((a, b) => a.name.localeCompare(b.name))
  vault.value = sorted
  persistVault(sorted)
}

function onSortByDate() {
  const sorted = [...vault.value].sort((a, b) => b.createdAt - a.createdAt)
  vault.value = sorted
  persistVault(sorted)
}

function onClearAllVault() {
  if (window.confirm(t('vault.clear_confirm'))) {
    vault.value = clearVault()
  }
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
          :selected="shape === s.id"
          :shape="s.id"
          :color="color"
          :expression="expression"
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
          :class="color === c.id ? 'border-[var(--ink)] scale-105' : 'border-transparent hover:scale-105'"
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
      <div class="mt-2 grid grid-cols-4 gap-1.5">
        <BotTile
          v-for="e in EXPRESSIONS"
          :key="e.id"
          :label="t(`expressions.${e.id}`)"
          :selected="expression === e.id"
          :shape="shape"
          :color="color"
          :expression="e.id"
          :frozen-at="PREVIEW_AT"
          @click="expression = e.id"
        />
      </div>
    </div>

    <!-- Balão de Fala Personalizado -->
    <div class="border-t border-[var(--line)] pt-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">{{ t('panel.bubble') }}</h2>
        <span class="text-[11px] tabular-nums text-[var(--muted)]">
          {{ bubble.length }}/40
        </span>
      </div>
      <div class="mt-2 flex items-center gap-1.5">
        <input
          v-model="bubble"
          type="text"
          maxlength="40"
          :placeholder="t('panel.bubble_placeholder')"
          class="flex-1 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)] transition focus-within:border-[var(--ink)]"
        />
        <button
          v-if="bubble"
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--muted)] transition hover:bg-[var(--line)] hover:text-[var(--ink)] cursor-pointer shrink-0"
          :title="t('panel.bubble_clear')"
          :aria-label="t('panel.bubble_clear')"
          @click="bubble = ''"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Cofre de Avatares (Avatar Vault) -->
    <div class="border-t border-[var(--line)] pt-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">{{ t('vault.title') }}</h2>
        <div class="flex items-center gap-1">
          <!-- Ordenação -->
          <button
            v-if="vault.length > 1"
            type="button"
            class="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
            :title="t('vault.sort_name')"
            @click="onSortByName"
          >
            A-Z
          </button>
          <button
            v-if="vault.length > 1"
            type="button"
            class="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
            :title="t('vault.sort_date')"
            @click="onSortByDate"
          >
            🕒
          </button>

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

          <!-- Limpar tudo -->
          <button
            v-if="vault.length > 0"
            type="button"
            class="rounded-md px-1.5 py-0.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition cursor-pointer"
            :title="t('vault.clear_all')"
            @click="onClearAllVault"
          >
            ✕
          </button>
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
      <div v-if="vault.length > 0" class="mt-3 grid grid-cols-4 gap-2">
        <div
          v-for="(av, index) in vault"
          :key="av.id"
          class="group relative flex flex-col items-center rounded-xl border border-[var(--line)] bg-[var(--paper)] p-1.5 transition hover:border-[var(--ink)] cursor-pointer"
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
              class="absolute bottom-1 right-1 rounded-full bg-[var(--ink)] p-0.5 text-[var(--paper)] shadow-sm"
              :title="av.bubble"
            >
              <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
          </div>

          <!-- Nom / Edition Inline -->
          <div v-if="editingId === av.id" class="mt-1 flex w-full items-center gap-0.5" @click.stop>
            <input
              v-model="editingName"
              type="text"
              maxlength="30"
              class="w-full rounded border border-[var(--ink)] bg-[var(--paper)] px-1 py-0.5 text-[10px] text-[var(--ink)] outline-none"
              autofocus
              @keyup.enter="onSaveRename(av.id, $event)"
              @keyup.esc="onCancelRename($event)"
            />
            <button
              type="button"
              class="text-[10px] text-green-600 hover:opacity-80"
              @click="onSaveRename(av.id, $event)"
            >
              ✓
            </button>
          </div>
          <span
            v-else
            class="mt-1 w-full truncate text-center text-[10px] font-medium text-[var(--muted)] group-hover:text-[var(--ink)]"
            :title="av.name"
            @dblclick="onStartRename(av, $event)"
          >
            {{ av.name }}
          </span>

          <!-- Overlay Action Bar on Hover -->
          <div class="absolute -top-1 -right-1 hidden items-center gap-0.5 group-hover:flex z-10">
            <!-- Renommer -->
            <button
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] text-[9px] cursor-pointer hover:scale-110 transition shadow-sm"
              :title="t('vault.rename')"
              @click="onStartRename(av, $event)"
            >
              ✎
            </button>
            <!-- Mover para esquerda -->
            <button
              v-if="index > 0"
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] text-[9px] cursor-pointer hover:scale-110 transition shadow-sm"
              :title="t('vault.move_left')"
              @click="onMoveAvatar(index, -1, $event)"
            >
              ◀
            </button>
            <!-- Mover para direita -->
            <button
              v-if="index < vault.length - 1"
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] text-[9px] cursor-pointer hover:scale-110 transition shadow-sm"
              :title="t('vault.move_right')"
              @click="onMoveAvatar(index, 1, $event)"
            >
              ▶
            </button>
            <!-- Atualizar com visual atual -->
            <button
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] text-[9px] cursor-pointer hover:scale-110 transition shadow-sm"
              :title="t('vault.update_current')"
              @click="onUpdateAvatarLook(av.id, $event)"
            >
              ↻
            </button>
            <!-- Supprimer -->
            <button
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[9px] cursor-pointer hover:scale-110 transition shadow-sm"
              :title="t('vault.delete')"
              :aria-label="t('vault.delete')"
              @click="onDeleteAvatar(av.id, $event)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <p v-else class="mt-2 text-xs text-[var(--muted)] text-center py-2">
        {{ t('vault.empty') }}
      </p>
    </div>
  </div>
</template>
