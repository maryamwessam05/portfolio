import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import { useRevealObserver } from '../lib/hooks'

const LIGHT_ROUTES = ['/journal']

export default function Layout() {
  const { pathname, hash } = useLocation()
  const light = LIGHT_ROUTES.some((r) => pathname.startsWith(r))

  useRevealObserver([pathname])

  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 400)
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <div className={light ? 'theme-light' : 'theme-dark'}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav theme={light ? 'light' : 'dark'} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
