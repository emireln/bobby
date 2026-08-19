<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: number
    strokeWidth?: number
    hovered?: boolean
  }>(),
  {
    size: 20,
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
      <!-- Lid: smooth spring lift -->
      <rect
        x="2"
        y="3"
        width="20"
        height="5"
        rx="1"
        class="transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :class="isHovered || props.hovered ? '-translate-y-0.75' : 'translate-y-0'"
      />
      <!-- Body -->
      <path
        class="transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :d="isHovered || props.hovered ? 'M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10' : 'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8'"
      />
      <!-- Handle slot -->
      <path
        class="transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :d="isHovered || props.hovered ? 'M10 14h4' : 'M10 12h4'"
      />
    </svg>
  </div>
</template>
