import { useEffect, useState } from 'react'
import './ScrollTop.css'

/** Hand-drawn "back to top" button; shows up once you've scrolled past the first screen. */
export default function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`scroll-top ${show ? 'is-shown' : ''}`}
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
    >
      <svg className="scroll-top__ring" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M33 4.5 C49 3.5 60.5 15 59.5 31 C58.6 47 47 59.6 31.5 59.5 C15.5 59.3 4.3 47.5 4.5 32 C4.7 17.5 15 5.5 31 4.6 C35 4.4 38.5 5.2 41 6.3" />
      </svg>
      <svg className="scroll-top__arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.2 19.5 C11.9 15 12.3 9.5 12 5.2 M6.4 10.4 C8.4 8.6 10.2 6.6 12 4.6 C13.7 6.5 15.6 8.5 17.6 10.2" />
      </svg>
    </button>
  )
}
