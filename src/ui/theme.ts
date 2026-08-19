import { computed, ref, watchEffect } from 'vue'
import { ecris, lis } from './stockage'

export type Theme = 'light' | 'dark' | 'system'

export const THEMES: Array<{ id: Theme; nom: 'theme_light' | 'theme_dark' | 'theme_system' }> = [
  { id: 'light', nom: 'theme_light' },
  { id: 'dark', nom: 'theme_dark' },
  { id: 'system', nom: 'theme_system' }
]

const storedTheme = lis('theme')
const initialTheme: Theme = storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
  ? storedTheme
  : 'system'

export const theme = ref<Theme>(initialTheme)

const mediaQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
const systemDark = ref(mediaQuery?.matches ?? false)

if (mediaQuery) {
  mediaQuery.addEventListener('change', (e) => {
    systemDark.value = e.matches
  })
}

export const isDark = computed(() => {
  if (theme.value === 'dark') return true
  if (theme.value === 'light') return false
  return systemDark.value
})

watchEffect(() => {
  ecris('theme', theme.value)
  if (typeof document !== 'undefined') {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
    }
  }
})
