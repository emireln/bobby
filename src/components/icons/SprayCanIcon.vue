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
      class="spray-icon select-none transition-transform duration-300"
      :class="isHovered || props.hovered ? '-rotate-6 scale-105' : 'rotate-0'"
    >
      <rect height="4" width="4" x="15" y="5" />
      <path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" />
      <path d="m13 14 8-2" />
      <path d="m13 19 8-2" />
      
      <!-- Staggered Animated Spray Dots -->
      <g :class="isHovered || props.hovered ? 'spray-active' : 'opacity-70'">
        <path d="M11 7h.01" class="spray-dot dot-1" />
        <path d="M7 5h.01" class="spray-dot dot-2" />
        <path d="M7 9h.01" class="spray-dot dot-3" />
        <path d="M3 3h.01" class="spray-dot dot-4" />
        <path d="M3 7h.01" class="spray-dot dot-5" />
        <path d="M3 11h.01" class="spray-dot dot-6" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.spray-active .dot-1 {
  animation: spray-pulse 0.7s infinite 0.05s ease-in-out;
}
.spray-active .dot-2 {
  animation: spray-pulse 0.7s infinite 0.12s ease-in-out;
}
.spray-active .dot-3 {
  animation: spray-pulse 0.7s infinite 0.18s ease-in-out;
}
.spray-active .dot-4 {
  animation: spray-pulse 0.7s infinite 0.25s ease-in-out;
}
.spray-active .dot-5 {
  animation: spray-pulse 0.7s infinite 0.32s ease-in-out;
}
.spray-active .dot-6 {
  animation: spray-pulse 0.7s infinite 0.40s ease-in-out;
}

@keyframes spray-pulse {
  0% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.4);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
}
</style>
