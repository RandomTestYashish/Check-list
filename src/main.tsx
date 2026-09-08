import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from '@/App'
import '@/index.css'

// Resolve the theme before first paint so the book never flashes white at night.
try {
  const stored = localStorage.getItem('sg-travel-book:v1')
  const preference = stored ? (JSON.parse(stored).theme as string | undefined) : undefined
  const dark =
    preference === 'dark' ||
    ((preference === 'system' || !preference) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
} catch {
  document.documentElement.dataset.theme = 'light'
}

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
