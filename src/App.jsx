import { useCallback, useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa'
import SideMenu from './components/SideMenu'
import UnloadTime from './pages/UnloadTime'
import Productivity from './pages/Productivity'
import Pod from './pages/Pod'
import Freight from './pages/Freight'
import './App.css'

// Hash routes: "#/" (truck calculator), "#/productivity/<category>" and "#/pod/<type>".
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
  const podMatch = route.match(/^#\/pod\/(\w+)/)
  const page = productivityMatch ? productivityMatch[1] : podMatch ? `pod-${podMatch[1]}` : 'unload'

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
        {productivityMatch?.[1] === 'freight' ? <Freight />
          : productivityMatch ? <Productivity categoryId={productivityMatch[1]} />
          : podMatch ? <Pod podId={podMatch[1]} />
          : <UnloadTime />}
      </main>
    </>
  )
}

export default App
