import { useCallback, useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import SideMenu from './components/SideMenu'
import { useI18n, LANGUAGES } from './lang'
import UnloadTime from './pages/UnloadTime'
import Pod from './pages/Pod'
import Freight from './pages/Freight'
import './App.css'

// Hash routes: "#/" (truck calculator), "#/productivity/freight" and "#/pod/<type>".
// Apparel/Shoes productivity pages are off the site for now (pages/Productivity.jsx is kept),
// so any old "#/productivity/..." link is redirected to Freight.
const FREIGHT_ROUTE = '#/productivity/freight'

function currentRoute() {
  const hash = window.location.hash
  if (hash.startsWith('#/productivity/') && hash !== FREIGHT_ROUTE) {
    window.history.replaceState(null, '', FREIGHT_ROUTE)
    return FREIGHT_ROUTE
  }
  return hash.startsWith('#/') ? hash : '#/'
}

function App() {
  const [route, setRoute] = useState(currentRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang, t } = useI18n()
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const onHash = () => {
      setRoute(currentRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const isFreight = route === FREIGHT_ROUTE
  const podMatch = route.match(/^#\/pod\/(\w+)/)
  const page = isFreight ? 'freight' : podMatch ? `pod-${podMatch[1]}` : 'unload'

  // Per-page color theme (see App.css); also tint the mobile browser bar to match.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.page = page
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
  }, [page])

  return (
    <>
      <header className="top-bar">
        <button
          className="icon-btn"
          onClick={() => setMenuOpen(true)}
          aria-label={t('openMenu')}
          aria-expanded={menuOpen}
          aria-controls="side-menu"
        >
          <FaBars aria-hidden />
        </button>
        <span className="top-bar-title">{t('appName')}</span>
        <div className="lang-toggle" role="radiogroup" aria-label={t('language')}>
          {LANGUAGES.map(code => (
            <button
              key={code}
              role="radio"
              aria-checked={code === lang}
              className={code === lang ? 'active' : ''}
              onClick={() => setLang(code)}
              lang={code}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <SideMenu open={menuOpen} onClose={closeMenu} route={route} />

      <main>
        {isFreight ? <Freight />
          : podMatch ? <Pod podId={podMatch[1]} />
          : <UnloadTime />}
      </main>
    </>
  )
}

export default App
