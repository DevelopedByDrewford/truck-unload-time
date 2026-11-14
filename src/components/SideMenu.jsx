import { useEffect, useRef } from 'react'
import { FaTimes, FaTruck } from 'react-icons/fa'
import { CATEGORIES } from '../utils/productivityMath' // only Freight is on the site for now
import { POD_TYPES } from '../utils/podMath'
import { useI18n } from '../i18n'

function MenuLink({ href, label, Icon, route, onClose, page }) {
  const active = route === href
  return (
    <a href={href} data-page={page} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} onClick={onClose}>
      <Icon aria-hidden />
      <span>{label}</span>
    </a>
  )
}

function SideMenu({ open, onClose, route }) {
  const closeRef = useRef(null)
  const { t } = useI18n()

  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      <div className={`menu-backdrop${open ? ' open' : ''}`} onClick={onClose} aria-hidden />
      <aside
        id="side-menu"
        className={`side-menu${open ? ' open' : ''}`}
        aria-label={t('mainMenu')}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu-head">
          <span>{t('menu')}</span>
          <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label={t('closeMenu')}>
            <FaTimes aria-hidden />
          </button>
        </div>

        <nav>
          <MenuLink href="#/" label={t('nav.truck')} Icon={FaTruck} route={route} onClose={onClose} />

          <h3 className="menu-section">{t('nav.productivity')}</h3>
          {CATEGORIES.filter(c => c.id === 'freight').map(({ id, Icon }) => (
            <MenuLink key={id} href={`#/productivity/${id}`} label={t(`cat.${id}`)} Icon={Icon} route={route} onClose={onClose} page={id} />
          ))}

          <h3 className="menu-section">{t('nav.pod')}</h3>
          {POD_TYPES.map(({ id, Icon }) => (
            <MenuLink key={id} href={`#/pod/${id}`} label={t(`cat.${id}`)} Icon={Icon} route={route} onClose={onClose} page={`pod-${id}`} />
          ))}
        </nav>
      </aside>
    </>
  )
}

export default SideMenu
