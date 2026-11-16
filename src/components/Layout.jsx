import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import Nav from './Nav'
import Footer from './Footer'
import { useRevealObserver } from '../lib/hooks'

const LIGHT_ROUTES = ['/journal']

export default function Layout() {
  const { pathname, hash } = useLocation()
  const wipe = useRef(null)
  const first = useRef(true)
  const light = LIGHT_ROUTES.some((r) => pathname.startsWith(r))

  useRevealObserver([pathname])

  // Scroll handling: top on page change, or to the #hash target.
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

  // Page transition: a mandarine brush panel that lifts away to reveal the new page.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const el = wipe.current
    gsap.fromTo(
      el,
      { yPercent: 0, autoAlpha: 1 },
      { yPercent: -105, duration: 0.8, ease: 'power3.inOut', delay: 0.05, onComplete: () => gsap.set(el, { autoAlpha: 0 }) },
    )
  }, [pathname])

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
      <div ref={wipe} className="page-wipe" aria-hidden="true">
        <img src="/assets/big-m.png" alt="" />
      </div>
    </div>
  )
}
