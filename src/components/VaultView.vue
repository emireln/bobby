<script setup lang="ts">
import { ref } from 'vue'
import BobbyBot from '@/components/BobbyBot.vue'
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
  updateInVault,
  type SavedAvatar
} from '@/ui/vault'

const props = defineProps<{
  shape: string
  color: string
  expression: string
}>()

const emit = defineEmits<{
  load: [avatar: SavedAvatar]
}>()

const PREVIEW_AT = 1

const vault = ref<SavedAvatar[]>(loadVault())
const saveMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const editingId = ref<string | null>(null)
const editingName = ref('')

function onLoadAvatar(av: SavedAvatar) {
  emit('load', av)
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
      shape: props.shape,
      color: props.color,
      expression: props.expression
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
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-1 border-b border-[var(--line)]">
      <div>
        <h2 class="text-base font-semibold text-[var(--ink)]">{{ t('vault.title') }}</h2>
        <span class="text-xs text-[var(--muted)]">
          {{ vault.length }} {{ vault.length === 1 ? 'avatar' : 'avatars' }}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <!-- Sort buttons -->
        <button
          v-if="vault.length > 1"
          type="button"
          class="rounded-lg px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
          :title="t('vault.sort_name')"
          @click="onSortByName"
        >
          A-Z
        </button>
        <button
          v-if="vault.length > 1"
          type="button"
          class="rounded-lg px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
          :title="t('vault.sort_date')"
          @click="onSortByDate"
        >
          🕒
        </button>

        <!-- Export JSON -->
        <button
          v-if="vault.length > 0"
          type="button"
          class="flex items-center gap-1 rounded-lg border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
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

        <!-- Import JSON -->
        <button
          type="button"
          class="flex items-center gap-1 rounded-lg border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
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

        <!-- Clear all -->
        <button
          v-if="vault.length > 0"
          type="button"
          class="rounded-lg p-1 text-xs text-red-500 hover:bg-red-500/10 transition cursor-pointer"
          :title="t('vault.clear_all')"
          @click="onClearAllVault"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Notification Toast -->
    <div v-if="saveMessage" class="text-xs font-medium text-green-600 transition">
      {{ saveMessage }}
    </div>

    <!-- Grid of saved avatars (2 columns, large spacious cards) -->
    <div v-if="vault.length > 0" class="grid grid-cols-2 gap-3.5">
      <div
        v-for="(av, index) in vault"
        :key="av.id"
        class="group relative flex flex-col items-center rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3 transition-all duration-200 hover:border-[var(--ink)] hover:shadow-md cursor-pointer select-none"
        :class="
          av.shape === shape && av.color === color && av.expression === expression
            ? 'ring-2 ring-[var(--ink)] border-transparent'
            : ''
        "
        :title="`${av.name} (${t('vault.load')})`"
        @click="onLoadAvatar(av)"
      >
        <!-- Top Action Buttons (Visible on hover) -->
        <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" @click.stop>
          <button
            type="button"
            class="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--line)] text-[var(--ink)] text-xs hover:bg-[var(--ink)] hover:text-[var(--paper)] transition cursor-pointer"
            :title="t('vault.rename')"
            @click="onStartRename(av, $event)"
          >
            ✎
          </button>
          <button
            type="button"
            class="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--line)] text-[var(--ink)] text-xs hover:bg-[var(--ink)] hover:text-[var(--paper)] transition cursor-pointer"
            :title="t('vault.update_current')"
            @click="onUpdateAvatarLook(av.id, $event)"
          >
            ↻
          </button>
          <button
            type="button"
            class="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/15 text-red-600 text-xs hover:bg-red-600 hover:text-white transition cursor-pointer"
            :title="t('vault.delete')"
            :aria-label="t('vault.delete')"
            @click="onDeleteAvatar(av.id, $event)"
          >
            ✕
          </button>
        </div>

        <!-- Left / Right Reorder Badges (Top Left) -->
        <div class="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" @click.stop>
          <button
            v-if="index > 0"
            type="button"
            class="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--line)] text-[var(--ink)] text-[10px] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition cursor-pointer"
            :title="t('vault.move_left')"
            @click="onMoveAvatar(index, -1, $event)"
          >
            ◀
          </button>
          <button
            v-if="index < vault.length - 1"
            type="button"
            class="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--line)] text-[var(--ink)] text-[10px] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition cursor-pointer"
            :title="t('vault.move_right')"
            @click="onMoveAvatar(index, 1, $event)"
          >
            ▶
          </button>
        </div>

        <!-- Single Bobby Avatar Preview -->
        <div class="w-full aspect-square flex items-center justify-center py-2">
          <BobbyBot
            :shape="av.shape"
            :color="av.color"
            :expression="av.expression"
            :frozen-at="PREVIEW_AT"
            :size="76"
          />
        </div>

        <!-- Single Clean Avatar Name -->
        <div v-if="editingId === av.id" class="mt-2 flex w-full items-center gap-1" @click.stop>
          <input
            v-model="editingName"
            type="text"
            maxlength="30"
            class="w-full rounded-lg border border-[var(--ink)] bg-[var(--paper)] px-2 py-1 text-xs text-[var(--ink)] outline-none"
            autofocus
            @keyup.enter="onSaveRename(av.id, $event)"
            @keyup.esc="onCancelRename($event)"
          />
          <button
            type="button"
            class="rounded-md bg-[var(--ink)] px-2 py-1 text-xs font-semibold text-[var(--paper)]"
            @click="onSaveRename(av.id, $event)"
          >
            ✓
          </button>
        </div>
        <span
          v-else
          class="mt-1 w-full truncate text-center text-xs font-medium text-[var(--ink)]"
          :title="av.name"
          @dblclick="onStartRename(av, $event)"
        >
          {{ av.name }}
        </span>
      </div>
    </div>

    <!-- Empty Vault State -->
    <div v-else class="rounded-3xl border border-dashed border-[var(--line)] py-16 text-center">
      <p class="text-sm font-medium text-[var(--muted)]">
        {{ t('vault.empty') }}
      </p>
    </div>
  </div>
</template>
