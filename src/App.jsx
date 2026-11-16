import { useCallback, useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import SideMenu from './components/SideMenu'
import { useI18n, LANGUAGES } from './lang'
import UnloadTime from './pages/UnloadTime'
import Pod from './pages/Pod'
import Freight from './pages/Freight'
import RunsPage from './pages/RunsPage'
import { SITE_PRODUCTIVITY } from './utils/productivityMath'
import './App.css'

// Hash routes: "#/" (truck calculator), "#/productivity/<freight|hummers|zracks|bluebins>" and "#/pod/<type>".
// Apparel/Shoes productivity pages are off the site for now (pages/Productivity.jsx is kept),
// so any other "#/productivity/..." link is redirected to Freight.
const PRODUCTIVITY_PAGES = {
  freight: Freight,
  hummers: () => <RunsPage pageId="hummers" />,
  zracks: () => <RunsPage pageId="zracks" />,
  bluebins: () => <RunsPage pageId="bluebins" />,
}
const FREIGHT_ROUTE = '#/productivity/freight'

function currentRoute() {
  const hash = window.location.hash
  const match = hash.match(/^#\/productivity\/(\w+)$/)
  if (hash.startsWith('#/productivity/') && !(match && SITE_PRODUCTIVITY.includes(match[1]))) {
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

  const productivityId = route.match(/^#\/productivity\/(\w+)$/)?.[1]
  const ProductivityPage = PRODUCTIVITY_PAGES[productivityId]
  const podMatch = route.match(/^#\/pod\/(\w+)/)
  const page = ProductivityPage ? productivityId : podMatch ? `pod-${podMatch[1]}` : 'unload'

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
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              role="radio"
              aria-checked={code === lang}
              className={code === lang ? 'active' : ''}
              onClick={() => setLang(code)}
              lang={code}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <SideMenu open={menuOpen} onClose={closeMenu} route={route} />

      <main>
        {ProductivityPage ? <ProductivityPage key={productivityId} />
          : podMatch ? <Pod key={podMatch[1]} podId={podMatch[1]} />
          : <UnloadTime />}
      </main>
    </>
  )
}

export default App
