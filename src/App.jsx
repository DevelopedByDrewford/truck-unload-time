import { useCallback, useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import SideMenu from './components/SideMenu'
import UnloadTime from './pages/UnloadTime'
import Productivity from './pages/Productivity'
import './App.css'

// Hash routes: "#/" (truck calculator) and "#/productivity/<category>".
function currentRoute() {
  const hash = window.location.hash
  return hash.startsWith('#/') ? hash : '#/'
}

function App() {
  const [route, setRoute] = useState(currentRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const onHash = () => {
      setRoute(currentRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const productivityMatch = route.match(/^#\/productivity\/(\w+)/)
  const page = productivityMatch ? productivityMatch[1] : 'unload'

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
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="side-menu"
        >
          <FaBars aria-hidden />
        </button>
        <span className="top-bar-title">Truck Tools</span>
      </header>

      <SideMenu open={menuOpen} onClose={closeMenu} route={route} />

      <main>
        {productivityMatch
          ? <Productivity categoryId={productivityMatch[1]} />
          : <UnloadTime />}
      </main>
    </>
  )
}

export default App
