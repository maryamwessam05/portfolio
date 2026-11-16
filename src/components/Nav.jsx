import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'Home', icon: '/assets/ic-home.png' },
  { to: '/about', label: 'About', icon: '/assets/ic-about.png' },
  { to: '/works', label: 'Works', icon: '/assets/ic-works.png' },
  { to: '/services', label: 'Services', icon: '/assets/ic-services.png' },
  { to: '/journal', label: 'Journal', icon: '/assets/ic-journal.png' },
]

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
      <div className="nav__bar">
        <Link to="/" className="nav__logo" aria-label="Maryam Wessam, home">
          <span className="mask-icon" style={{ '--icon': 'url(/assets/logo-m.png)' }} />
        </Link>

        <nav className="nav__links" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={`nav__link ${isActive(l.to) ? 'is-active' : ''}`}>
              {isActive(l.to) && <span className="hand-outline" aria-hidden="true" />}
              <span className="mask-icon" style={{ '--icon': `url(${l.icon})` }} aria-hidden="true" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="nav__cta">
          <span className="mask-icon" style={{ '--icon': 'url(/assets/ic-heart.png)' }} aria-hidden="true" />
          Work with me
        </Link>

        <button className="nav__menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu">
          <span className="hand-outline" aria-hidden="true" />
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        {LINKS.map((l, i) => (
          <NavLink key={l.to} to={l.to} className="nav__sheet-link" style={{ '--i': i }}>
            <span className="mask-icon" style={{ '--icon': `url(${l.icon})` }} aria-hidden="true" />
            {l.label}
          </NavLink>
        ))}
        <Link to="/contact" className="nav__cta nav__cta--sheet" style={{ '--i': LINKS.length }}>
          <span className="mask-icon" style={{ '--icon': 'url(/assets/ic-heart.png)' }} aria-hidden="true" />
          Work with me
        </Link>
      </div>
    </header>
  )
}
