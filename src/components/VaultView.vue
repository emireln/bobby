<script setup lang="ts">
import { ref } from 'vue'
import BobbyBot from '@/components/BobbyBot.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import { t } from '@/i18n'
import {
  exportAvatarJson,
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
  eyeColor?: string
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
const hoveredDate = ref(false)
const hoveredExportId = ref<string | null>(null)

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
      expression: props.expression,
      eyeColor: props.eyeColor
    },
    vault.value
  )
  saveMessage.value = t('vault.saved')
  setTimeout(() => {
    saveMessage.value = ''
  }, 2000)
}

function onExportAvatar(av: SavedAvatar, event: Event) {
  event.stopPropagation()
  exportAvatarJson(av)
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
          class="flex items-center justify-center rounded-lg p-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] transition cursor-pointer"
          :title="t('vault.sort_date')"
          @mouseenter="hoveredDate = true"
          @mouseleave="hoveredDate = false"
          @click="onSortByDate"
        >
          <ClockIcon :size="15" :hovered="hoveredDate" />
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
        class="group relative flex flex-col items-center rounded-2xl border p-3 transition-all duration-200 cursor-pointer select-none"
        :class="
          av.shape === shape && av.color === color && av.expression === expression
            ? 'border-[var(--ink)]/40 bg-[var(--line)] shadow-xs font-semibold ring-1 ring-[var(--ink)]/15'
            : 'border-[var(--line)] bg-[var(--paper)]/85 hover:bg-[var(--line)]/50'
        "
        :title="`${av.name} (${t('vault.load')})`"
        @click="onLoadAvatar(av)"
      >
        <!-- Top Action Buttons (Visible on hover on desktop, always visible on mobile/focus) -->
        <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 max-lg:opacity-100 transition-opacity z-10" @click.stop>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--paper)]/95 backdrop-blur-xs text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] text-xs shadow-xs transition cursor-pointer"
            :title="t('vault.rename')"
            @click="onStartRename(av, $event)"
          >
            ✎
          </button>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--paper)]/95 backdrop-blur-xs text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] text-xs shadow-xs transition cursor-pointer"
            :title="t('vault.update_current')"
            @click="onUpdateAvatarLook(av.id, $event)"
          >
            ↻
          </button>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--paper)]/95 backdrop-blur-xs text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] text-xs shadow-xs transition cursor-pointer"
            :title="t('vault.export_avatar')"
            :aria-label="t('vault.export_avatar')"
            @mouseenter="hoveredExportId = av.id"
            @mouseleave="hoveredExportId = null"
            @click="onExportAvatar(av, $event)"
          >
            <DownloadIcon :size="14" :hovered="hoveredExportId === av.id" />
          </button>
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--paper)]/95 backdrop-blur-xs text-red-500 hover:bg-red-500/15 hover:text-red-600 text-xs shadow-xs transition cursor-pointer"
            :title="t('vault.delete')"
            :aria-label="t('vault.delete')"
            @click="onDeleteAvatar(av.id, $event)"
          >
            ✕
          </button>
        </div>

        <!-- Left / Right Reorder Badges (Top Left) -->
        <div class="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 max-lg:opacity-100 transition-opacity z-10" @click.stop>
          <button
            v-if="index > 0"
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--paper)]/95 backdrop-blur-xs text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] text-[10px] shadow-xs transition cursor-pointer"
            :title="t('vault.move_left')"
            @click="onMoveAvatar(index, -1, $event)"
          >
            ◀
          </button>
          <button
            v-if="index < vault.length - 1"
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--paper)]/95 backdrop-blur-xs text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] text-[10px] shadow-xs transition cursor-pointer"
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
            :paper="av.eyeColor === 'encre' ? '#0a0a0c' : '#ffffff'"
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
            class="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1 text-xs text-[var(--ink)] outline-none focus:border-[var(--muted)]"
            autofocus
            @keyup.enter="onSaveRename(av.id, $event)"
            @keyup.esc="onCancelRename($event)"
          />
          <button
            type="button"
            class="rounded-lg bg-[var(--ink)] px-2.5 py-1 text-xs font-semibold text-[var(--paper)] shadow-xs"
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
