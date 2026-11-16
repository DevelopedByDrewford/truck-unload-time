import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './lang'
import { initAnalytics } from './analytics'

initAnalytics()

// Page inputs used to be saved in localStorage; they now live in memory only. Remove old copies.
try {
  for (const key of Object.keys(localStorage)) {
    // 'lang' was saved automatically (even without a choice); it's replaced by 'langChoice'.
    if (key === 'podState' || key === 'rate' || key === 'lang' || key.startsWith('freight.') || key.startsWith('unload.')) {
      localStorage.removeItem(key)
    }
  }
} catch { /* storage unavailable */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
