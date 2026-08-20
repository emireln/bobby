<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { isDark } from '@/ui/theme'

const props = withDefaults(
  defineProps<{
    active?: boolean
    fullscreen?: boolean
  }>(),
  {
    active: true,
    fullscreen: false
  }
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let width = 0
let height = 0
let dpr = 1

// Center interpolation
let currentCenterX = 0
let currentCenterY = 0
let targetCenterX = 0
let targetCenterY = 0

// Mouse with high-inertia smooth filtering
let targetMouseX = -9999
let targetMouseY = -9999
let smoothMouseX = -9999
let smoothMouseY = -9999
let isMouseInside = false
let mouseActiveWeight = 0

// Large expansive particle grid
const COLS = 44
const ROWS = 30
const SPACING_X = 26
const SPACING_Y = 24

interface Particle {
  homeX: number
  homeY: number
  currX: number
  currY: number
  size: number
  freq1: number
  freq2: number
  phase1: number
  phase2: number
}

const particles: Particle[] = []

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const homeX = (c - (COLS - 1) / 2) * SPACING_X
    const homeY = (r - (ROWS - 1) / 2) * SPACING_Y
    particles.push({
      homeX,
      homeY,
      currX: homeX,
      currY: homeY,
      size: 1.15,
      freq1: 0.003 + (c % 3) * 0.0005,
      freq2: 0.003 + (r % 3) * 0.0005,
      phase1: (c * 0.2 + r * 0.15),
      phase2: (c * 0.15 - r * 0.2)
    })
  }
}

// Scale expansion during preview
let currentScale = 1.15
let targetScale = 1.15

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  width = window.innerWidth
  height = window.innerHeight
  dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  updateTargetCenter()
  if (currentCenterX === 0) {
    currentCenterX = targetCenterX
    currentCenterY = targetCenterY
  }
}

function updateTargetCenter() {
  targetScale = props.fullscreen ? 1.35 : 1.15
  const avatarEl = document.querySelector('.avatar')
  if (avatarEl) {
    const rect = avatarEl.getBoundingClientRect()
    // Shift more to right in settings (+55px), lower in preview (+70px)
    targetCenterX = rect.left + rect.width / 2 + (props.fullscreen ? 0 : 55)
    targetCenterY = rect.top + rect.height / 2 + (props.fullscreen ? 70 : 20)
  } else {
    targetCenterX = props.fullscreen ? width * 0.5 : width * 0.78
    targetCenterY = height * 0.5 + (props.fullscreen ? 70 : 20)
  }
}

function onMouseMove(e: MouseEvent) {
  if (!props.active) return
  targetMouseX = e.clientX
  targetMouseY = e.clientY
  isMouseInside = true
}

function onMouseLeave() {
  isMouseInside = false
}

let lastTime = 0
let simTime = 0

function render(timestamp: number) {
  if (!props.active) {
    animationId = requestAnimationFrame(render)
    return
  }

  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (lastTime === 0) lastTime = timestamp
  const dt = Math.min((timestamp - lastTime) * 0.001, 0.05)
  lastTime = timestamp

  // Ultra-slow, serene time progression
  simTime += dt * 0.25

  updateTargetCenter()

  // Smooth position & scale glide
  currentCenterX += (targetCenterX - currentCenterX) * 0.05
  currentCenterY += (targetCenterY - currentCenterY) * 0.05
  currentScale += (targetScale - currentScale) * 0.04

  // Smooth mouse filtering (eliminates all twitching/jitter)
  if (smoothMouseX === -9999) {
    smoothMouseX = targetMouseX
    smoothMouseY = targetMouseY
  } else {
    smoothMouseX += (targetMouseX - smoothMouseX) * 0.06
    smoothMouseY += (targetMouseY - smoothMouseY) * 0.06
  }

  // Smooth mouse active fade
  const targetWeight = isMouseInside ? 1 : 0
  mouseActiveWeight += (targetWeight - mouseActiveWeight) * 0.04

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const rCol = isDark.value ? 255 : 10
  const gCol = isDark.value ? 255 : 10
  const bCol = isDark.value ? 255 : 12
  const baseAlpha = isDark.value ? 0.32 : 0.22

  const maxDistX = ((COLS - 1) / 2) * SPACING_X * currentScale
  const maxDistY = ((ROWS - 1) / 2) * SPACING_Y * currentScale
  const sigma = 180

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]!

    // Base position
    const baseX = p.homeX * currentScale
    const baseY = p.homeY * currentScale

    // Silky organic harmonic field (slow, laminar, peaceful wave)
    const waveX =
      Math.sin(baseX * p.freq1 + simTime * 0.8 + p.phase1) * 7 +
      Math.cos(baseY * p.freq2 + simTime * 0.6 + p.phase2) * 5

    const waveY =
      Math.cos(baseX * p.freq1 - simTime * 0.7 + p.phase2) * 7 +
      Math.sin(baseY * p.freq2 + simTime * 0.9 + p.phase1) * 6

    let targetX = baseX + waveX
    let targetY = baseY + waveY

    // Smooth fluid magnetic ripple push from cursor
    if (mouseActiveWeight > 0.01) {
      const screenX = currentCenterX + targetX
      const screenY = currentCenterY + targetY
      const dx = screenX - smoothMouseX
      const dy = screenY - smoothMouseY
      const distSq = dx * dx + dy * dy
      const dist = Math.sqrt(distSq)

      if (dist < sigma * 2.2) {
        const gaussian = Math.exp(-distSq / (2 * sigma * sigma)) * mouseActiveWeight
        // Fluid ripple wave propagation
        const ripple = Math.sin(dist * 0.04 - simTime * 6) * gaussian * 12
        const pushForce = gaussian * 0.28
        
        targetX += dx * pushForce + (dx / (dist + 1)) * ripple
        targetY += dy * pushForce + (dy / (dist + 1)) * ripple
      }
    }

    // Viscous fluid lerp to target position (smooth organic motion)
    p.currX += (targetX - p.currX) * 0.08
    p.currY += (targetY - p.currY) * 0.08

    const finalScreenX = currentCenterX + p.currX
    const finalScreenY = currentCenterY + p.currY

    // Soft elliptical vignette
    const normX = Math.abs(p.homeX * currentScale) / maxDistX
    const normY = Math.abs(p.homeY * currentScale) / maxDistY
    const vignette = Math.max(0, 1 - Math.pow(normX, 2.0)) * Math.max(0, 1 - Math.pow(normY, 2.0))

    // Bottom safety fade to protect wordmark text
    const distToBottom = Math.max(0, (height - 90 - finalScreenY) / 90)
    const bottomSafety = Math.min(1, distToBottom)

    const alpha = Math.max(0, Math.min(1, vignette * bottomSafety * baseAlpha))
    if (alpha < 0.01) continue

    ctx.beginPath()
    ctx.arc(finalScreenX, finalScreenY, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`
    ctx.fill()
  }

  animationId = requestAnimationFrame(render)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mouseleave', onMouseLeave, { passive: true })
  animationId = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
})

watch(() => props.active, (val) => {
  if (val) resize()
})

watch(() => props.fullscreen, () => {
  updateTargetCenter()
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden select-none">
    <canvas
      ref="canvasRef"
      class="block h-full w-full"
    />
  </div>
</template>
