import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import NavIcon, { NavIconDefs } from './NavIcon'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/about', label: 'About', icon: 'about' },
  { to: '/works', label: 'Works', icon: 'works' },
  { to: '/services', label: 'Services', icon: 'services' },
  { to: '/journal', label: 'Journal', icon: 'journal' },
]

function IconLink({ as: As = NavLink, icon, children, ...rest }) {
  const ref = useRef(null)
  return (
    <As ref={ref} {...rest}>
      {children?.[0]}
      <NavIcon name={icon} hostRef={ref} />
      {children?.slice(1)}
    </As>
  )
}

export default function Nav({ theme = 'dark' }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to) || (to === '/works' && pathname.startsWith('/work/')))

  return (
    <header className={`nav nav--${theme} ${open ? 'is-open' : ''}`}>
      <NavIconDefs />
      <div className="nav__bar">
        <Link to="/" className="nav__logo" aria-label="Maryam Wessam, home">
          <span className="mask-icon" style={{ '--icon': 'url(/assets/logo-m.png)' }} />
        </Link>

        <nav className="nav__links" aria-label="Main">
          {LINKS.map((l) => (
            <IconLink key={l.to} to={l.to} icon={l.icon} className={`nav__link ${isActive(l.to) ? 'is-active' : ''}`}>
              {isActive(l.to) ? <span className="hand-outline" aria-hidden="true" /> : null}
              {l.label}
            </IconLink>
          ))}
        </nav>

        <IconLink as={Link} to="/contact" className="nav__cta" icon="heart">
          {null}
          Work with me
        </IconLink>

        <button className="nav__menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu">
          <span className="hand-outline" aria-hidden="true" />
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        {LINKS.map((l, i) => (
          <IconLink key={l.to} to={l.to} icon={l.icon} className="nav__sheet-link" style={{ '--i': i }}>
            {null}
            {l.label}
          </IconLink>
        ))}
        <IconLink as={Link} to="/contact" className="nav__cta nav__cta--sheet" style={{ '--i': LINKS.length }} icon="heart">
          {null}
          Work with me
        </IconLink>
      </div>
    </header>
  )
}
