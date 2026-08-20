import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'

if (typeof window !== 'undefined' && 'bobbyElectron' in window) {
  document.documentElement.classList.add('is-electron')
}

createApp(App).mount('#app')
