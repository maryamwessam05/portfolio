import { Suspense, useEffect, useRef, useState } from 'react'
import { Routes, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const SCRIBBLE =
  'M 0 334.9 C 75.8 172.6 270.8 -112.2 443.7 46.6 C 659.8 245.2 -92.0 347.1 25.0 511.6 C 142.0 676.1 730.8 -99.4 900.9 89.9 C 1071.0 279.3 -257.3 806.9 69.3 937.3 C 395.9 1067.6 730.8 539.6 936.4 462.2 C 1142.0 384.7 950.9 50.1 1163.5 25.2 C 1376.1 0.2 1503.2 232.5 1358.1 372.0 C 1213.0 511.6 645.8 570.6 493.2 843.6 C 340.6 1116.6 780.3 1137.6 900.9 1035.6 C 1021.4 933.7 1027.9 604.8 1358.1 598.6 C 1622.2 593.7 1293.8 1130.8 1244.8 1183.8'

const IN = 1.1
const OUT = 1.0
const THIN = 40
const THICK = 460

export default function ScribbleRoutes({ children, fallback }) {
  const location = useLocation()
  const [shown, setShown] = useState(location)
  const svg = useRef(null)
  const path = useRef(null)
  const current = useRef(location)

  useEffect(() => {
    if (location.key === current.current.key) return
    const samePage = location.pathname === current.current.pathname
    const swap = () => {
      current.current = location
      setShown(location)
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (samePage || reduced) {
      swap()
      return
    }
    const el = path.current
    const len = el.getTotalLength()
    const tl = gsap.timeline()
    tl.set(svg.current, { autoAlpha: 1 })
      .set(el, { strokeDasharray: `0 ${len}`, strokeDashoffset: 0, strokeWidth: THIN })
      .to(el, { strokeDasharray: `${len} ${len}`, strokeWidth: THICK, duration: IN, ease: 'power2.inOut' })
      .add(swap)
      .to(el, { strokeDashoffset: -len, strokeWidth: THIN, duration: OUT, ease: 'power2.inOut' }, '+=0.12')
      .set(svg.current, { autoAlpha: 0 })
    return () => tl.kill()
  }, [location])

  return (
    <>
      <Suspense fallback={fallback}>
        <Routes location={shown}>{children}</Routes>
      </Suspense>
      <svg ref={svg} className="scribble" viewBox="0 0 1440 1024" preserveAspectRatio="none" aria-hidden="true">
        <path
          ref={path}
          d={SCRIBBLE}
          transform="translate(-57.32 -43.82)"
        />
      </svg>
    </>
  )
}
