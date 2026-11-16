// Google Analytics 4 (gtag.js).
// Turned on only when VITE_GA_ID is set (e.g. in .env.local or your host's build settings)
// and only in production builds, so local development doesn't send data.
const GA_ID = import.meta.env.VITE_GA_ID
const enabled = Boolean(GA_ID) && import.meta.env.PROD

function gtag() {
  // gtag.js expects the `arguments` object itself, not an array.
  window.dataLayer.push(arguments)
}

export function initAnalytics() {
  if (!enabled || window.dataLayer) return
  window.dataLayer = []
  window.gtag = gtag

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(script)

  gtag('js', new Date())
  // Page views are sent by trackPageView, because the app switches pages via the URL hash
  // (#/productivity/freight), which GA wouldn't count as separate pages on its own.
  gtag('config', GA_ID, { send_page_view: false })
}

// "#/productivity/freight" → "/productivity/freight"
function pathFromHash(hash) {
  return hash.replace(/^#/, '') || '/'
}

// `title` is an English page name (same in every language, so reports group correctly).
export function trackPageView(hash, title, language) {
  if (!enabled) return
  const path = pathFromHash(hash)
  gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: title,
    app_language: language,
  })
}

export function trackEvent(name, params = {}) {
  if (!enabled) return
  gtag('event', name, { page_path: pathFromHash(window.location.hash), ...params })
}
