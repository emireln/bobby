<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: number
    strokeWidth?: number
    hovered?: boolean
  }>(),
  {
    size: 15,
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
      <circle cx="12" cy="12" r="10" />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="6"
        class="transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="{
          transform: (isHovered || props.hovered) ? 'rotate(360deg)' : 'rotate(0deg)',
          transformOrigin: '12px 12px'
        }"
      />
      <line
        x1="12"
        y1="12"
        x2="16"
        y2="12"
        class="transition-transform duration-500 ease-in-out"
        :style="{
          transform: (isHovered || props.hovered) ? 'rotate(45deg)' : 'rotate(0deg)',
          transformOrigin: '12px 12px'
        }"
      />
    </svg>
  </div>
</template>
