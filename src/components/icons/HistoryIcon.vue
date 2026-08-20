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
      <!-- Fleche circulaire en rotation inverse -->
      <g
        class="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :style="{
          transform: isHovered || props.hovered ? 'rotate(-50deg)' : 'rotate(0deg)',
          transformOrigin: '12px 12px'
        }"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </g>
      <!-- Aiguille des heures effectuant un tour complet -->
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="7"
        class="transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="{
          transform: isHovered || props.hovered ? 'rotate(-360deg)' : 'rotate(0deg)',
          transformOrigin: '12px 12px'
        }"
      />
      <!-- Aiguille des minutes -->
      <line
        x1="12"
        y1="12"
        x2="16"
        y2="14"
        class="transition-transform duration-500 ease-in-out"
        :style="{
          transform: isHovered || props.hovered ? 'rotate(-45deg)' : 'rotate(0deg)',
          transformOrigin: '12px 12px'
        }"
      />
    </svg>
  </div>
</template>
