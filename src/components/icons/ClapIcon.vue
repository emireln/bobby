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
      class="clap-root select-none overflow-visible"
      :class="isHovered || props.hovered ? 'clap-active' : ''"
    >
      <g class="clapper-group">
        <!-- Top clapping arm with hinge swing -->
        <g class="clapper-top origin-[3px_11px]">
          <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
          <path d="m6.2 5.3 3.1 3.9" />
          <path d="m12.4 3.4 3.1 4" />
        </g>
        <!-- Bottom base -->
        <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.clapper-top {
  transform-origin: 3px 11px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.clap-active .clapper-top {
  animation: clapper-clap 0.5s ease-in-out forwards;
}

.clapper-group {
  transform-origin: 4px 20px;
  transition: transform 0.4s ease-in-out;
}

.clap-active .clapper-group {
  animation: clapper-rock 0.7s ease-in-out forwards;
}

@keyframes clapper-clap {
  0% {
    transform: rotate(0deg);
  }
  30% {
    transform: rotate(-14deg);
  }
  60% {
    transform: rotate(18deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes clapper-rock {
  0% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(-8deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
