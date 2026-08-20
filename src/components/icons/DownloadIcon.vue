<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: number
    strokeWidth?: number
    hovered?: boolean
  }>(),
  {
    size: 16,
    strokeWidth: 2,
    hovered: false
  }
)

const isHovered = ref(false)

function startAnimation() {
  isHovered.value = true
}

function stopAnimation() {
  isHovered.value = false
}

defineExpose({
  startAnimation,
  stopAnimation
})
</script>

<template>
  <div
    class="flex items-center justify-center pointer-events-none"
    @mouseenter="startAnimation"
    @mouseleave="stopAnimation"
  >
    <svg
      :width="props.size"
      :height="props.size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="select-none"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <g
        class="transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :class="isHovered || props.hovered ? 'translate-y-0.75' : 'translate-y-0'"
      >
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </g>
    </svg>
  </div>
</template>
