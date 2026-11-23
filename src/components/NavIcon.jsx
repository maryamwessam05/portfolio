import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

const motionOK = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ART = {
  home: { src: '/assets/ic-home.png', w: 59, h: 69 },
  about: { src: '/assets/ic-about-eyes.png', w: 67, h: 68 },
  works: { src: '/assets/ic-works.png', w: 78, h: 66 },
  services: { src: '/assets/ic-services.png', w: 60, h: 84 },
  journal: { src: '/assets/ic-journal.png', w: 62, h: 66 },
  heart: { src: '/assets/ic-heart.png', w: 60, h: 66 },
}

const TRACE = {
  home: ['M10 17 L35 2 L56 32', 'M1 25 C20 26 40 30 57 34', 'M4 34 L4 67', 'M53 34 L53 67', 'M10 65 L52 66'],
  heart: ['M35 18 C30 5 15 2 7 9 C-1 17 3 36 14 46 C23 54 31 60 40 59 C50 58 56 45 58 30 C59 17 57 5 51 2 C45 0 39 6 35 14'],
}

const PUPILS = [
  { x: 22.5, y: 53, ex: 19, ey: 38 },
  { x: 57, y: 51.5, ex: 54, ey: 37 },
]

const BITS = [
  'M0 -2.4 L0.7 -0.7 L2.4 0 L0.7 0.7 L0 2.4 L-0.7 0.7 L-2.4 0 L-0.7 -0.7 Z',
  'M0 1.9 C-2.4 0.4 -2.2 -1.8 -0.9 -1.8 C-0.3 -1.8 0 -1.3 0 -1 C0 -1.3 0.3 -1.8 0.9 -1.8 C2.2 -1.8 2.4 0.4 0 1.9 Z',
  'M-1.7 0 A1.7 1.7 0 1 0 1.7 0 A1.7 1.7 0 1 0 -1.7 0',
  'M-2.2 0.6 C-1.4 -1 -0.7 1.6 0 0 C0.7 -1.6 1.4 1 2.2 -0.6',
  'M-1.6 -1.6 L1.6 -1.6 L1.6 1.6 L-1.6 1.6 Z',
  'M0 -2 L1.9 1.4 L-1.9 1.4 Z',
  'M0 -2.5 L0.75 -0.8 L2.4 -0.8 L1.1 0.35 L1.6 2.2 L0 1.1 L-1.6 2.2 L-1.1 0.35 L-2.4 -0.8 L-0.75 -0.8 Z',
  'M0 -2.2 L0 2.2 M-2.2 0 L2.2 0',
  'M-2 0 A2 2 0 1 0 2 0 A2 2 0 1 0 -2 0 M-0.9 0 A0.9 0.9 0 1 0 0.9 0 A0.9 0.9 0 1 0 -0.9 0',
  'M0 -0.9 C0.6 -2.6 2.6 -2 1.2 -0.4 C3 -0.6 3 1.6 1 1 C1.4 2.8 -1 3 -0.6 1.1 C-2.6 2 -3 -0.2 -1.1 -0.4 C-2.4 -2 -0.6 -2.8 0 -0.9 Z',
  'M-2 -1 L2 -1 L1.5 2 L-1.5 2 Z M-1 -1 C-1 -2.6 1 -2.6 1 -1',
  'M-2.4 0.8 C-1.2 -1.8 1.2 -1.8 2.4 0.8',
  'M-1.2 -2.2 L1.2 -2.2 L1.2 2.2 L-1.2 2.2 Z M-0.4 -1.2 L0.4 -1.2',
]

function Ink({ id, art, clip }) {
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={art.w} height={art.h} style={{ maskType: 'alpha' }}>
        <image href={art.src} width={art.w} height={art.h} />
      </mask>
      <rect width={art.w} height={art.h} fill="currentColor" mask={`url(#${id})`} clipPath={clip} />
    </>
  )
}

export default function NavIcon({ name, hostRef, className = '' }) {
  const svg = useRef(null)
  const uid = `ni${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const art = ART[name]

  useEffect(() => {
    const el = svg.current
    const host = hostRef?.current || el
    if (!el || !motionOK()) return
    const q = gsap.utils.selector(el)
    let tl
    let looping = false
    const cleanups = []
    const on = (type, fn) => {
      host.addEventListener(type, fn)
      cleanups.push(() => host.removeEventListener(type, fn))
    }

    if (name === 'home' || name === 'heart') {
      const traces = q('.ni-trace')
      const full = q('.ni-full')
      on('mouseenter', () => {
        tl?.kill()
        tl = gsap.timeline({ onComplete: () => gsap.set(full, { opacity: 1 }) })
        tl.set(full, { opacity: 0 })
        traces.forEach((p, i) => {
          const len = p.getTotalLength()
          tl.fromTo(
            p,
            { strokeDasharray: `${len} ${len + 10}`, strokeDashoffset: len + 5 },
            { strokeDashoffset: 0, duration: name === 'heart' ? 1 : 0.38, ease: name === 'heart' ? 'power2.inOut' : 'power1.inOut' },
            name === 'heart' ? 0 : i * 0.22,
          )
        })
      })
    }

    if (name === 'about') {
      const pupils = q('.ni-pupil')
      const xs = pupils.map((p) => gsap.quickTo(p, 'x', { duration: 0.18, ease: 'power3.out' }))
      const ys = pupils.map((p) => gsap.quickTo(p, 'y', { duration: 0.18, ease: 'power3.out' }))
      const look = (e) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const a = Math.atan2(dy, dx)
        const k = Math.min(1, Math.hypot(dx, dy) / 60)
        PUPILS.forEach((p, i) => {
          xs[i](p.ex + Math.cos(a) * 5 * k - p.x)
          ys[i](p.ey + Math.sin(a) * 16 * k - p.y)
        })
      }
      window.addEventListener('pointermove', look, { passive: true })
      cleanups.push(() => window.removeEventListener('pointermove', look))
      const blink = gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 2 })
      blink
        .to(q('.ni-eyes'), { scaleY: 0.1, svgOrigin: '34 40', duration: 0.08, ease: 'power1.in' })
        .to(q('.ni-eyes'), { scaleY: 1, duration: 0.12, ease: 'power1.out' })
      cleanups.push(() => blink.kill())
    }

    if (name === 'works') {
      const lid = q('.ni-lid')
      const screen = q('.ni-screen')
      on('mouseenter', () => {
        tl?.kill()
        gsap.set(screen, { opacity: 0 })
        tl = gsap
          .timeline()
          .to(lid, { scaleY: 0.06, svgOrigin: '39 35', duration: 0.28, ease: 'power2.in' })
          .to(lid, { scaleY: 1, duration: 0.5, ease: 'back.out(2.2)' }, '+=0.12')
          .to(screen, { opacity: 0.6, duration: 0.05 })
          .to(screen, { opacity: 0.1, duration: 0.06 })
          .to(screen, { opacity: 1, duration: 0.15 })
      })
      on('mouseleave', () => {
        tl?.kill()
        gsap.to(lid, { scaleY: 1, duration: 0.3 })
        gsap.to(screen, { opacity: 0, duration: 0.35 })
      })
    }

    if (name === 'services') {
      const bag = q('.ni-bag')
      const bits = q('.ni-bit')
      const spill = () => {
        const t = gsap.timeline({ onComplete: () => looping && spill() })
        t.to(bag, { y: -8, scaleY: 1.05, svgOrigin: '30 82', duration: 0.16, ease: 'power2.out' })
          .to(bag, { y: 0, scaleY: 0.88, duration: 0.18, ease: 'power2.in' })
          .to(bag, { scaleY: 1, duration: 0.45, ease: 'elastic.out(1, 0.4)' })
        gsap.utils
          .shuffle([...bits])
          .slice(0, gsap.utils.random(4, 6, 1))
          .forEach((b, i) => {
            const dx = gsap.utils.random(-140, 140)
            t.fromTo(
              b,
              { x: 32, y: 34, opacity: 0, rotate: 0, scale: 0.6 },
              {
                keyframes: [
                  { x: 32 + dx * 0.25, y: gsap.utils.random(-40, -10), opacity: 1, scale: gsap.utils.random(0.8, 1.15), duration: 0.3, ease: 'power2.out' },
                  { x: 32 + dx, y: gsap.utils.random(900, 1300), rotate: gsap.utils.random(-300, 300), duration: gsap.utils.random(1.1, 1.5), ease: 'power2.in' },
                  { opacity: 0, duration: 0.2 },
                ],
              },
              0.14 + i * 0.06,
            )
          })
        tl = t
      }
      on('mouseenter', () => {
        looping = true
        if (!tl?.isActive()) spill()
      })
      on('mouseleave', () => (looping = false))
    }

    if (name === 'journal') {
      const pages = q('.ni-page')
      gsap.set(pages, { opacity: 0 })
      const flip = () => {
        const t = gsap.timeline({ onComplete: () => looping && flip() })
        pages.forEach((p, i) =>
          t.fromTo(
            p,
            { scaleX: 1, opacity: 1 },
            { scaleX: -1, svgOrigin: '31 33', duration: 0.42, ease: 'power1.inOut' },
            i * 0.16,
          ),
        )
        t.set(pages, { opacity: 0 })
        tl = t
      }
      on('mouseenter', () => {
        looping = true
        if (!tl?.isActive()) flip()
      })
      on('mouseleave', () => (looping = false))
    }

    return () => {
      cleanups.forEach((c) => c())
      tl?.kill()
    }
  }, [name, hostRef])

  if (!art) return null

  const props = {
    ref: svg,
    className: `nav-icon nav-icon--${name} ${className}`,
    viewBox: `0 0 ${art.w} ${art.h}`,
    style: { aspectRatio: `${art.w} / ${art.h}` },
    overflow: 'visible',
    'aria-hidden': true,
  }

  if (name === 'home' || name === 'heart')
    return (
      <svg {...props}>
        <mask id={`${uid}r`} maskUnits="userSpaceOnUse" x="-5" y="-5" width={art.w + 10} height={art.h + 10}>
          <rect className="ni-full" x="-5" y="-5" width={art.w + 10} height={art.h + 10} fill="#fff" />
          {TRACE[name].map((d) => (
            <path key={d} className="ni-trace" d={d} fill="none" stroke="#fff" strokeWidth={name === 'heart' ? 13 : 11} strokeLinecap="round" />
          ))}
        </mask>
        <g mask={`url(#${uid}r)`}>
          <Ink id={uid} art={art} />
        </g>
      </svg>
    )

  if (name === 'about')
    return (
      <svg {...props}>
        <g className="ni-eyes">
          <Ink id={uid} art={art} />
          {PUPILS.map((p) => (
            <circle key={p.x} className="ni-pupil" cx={p.x} cy={p.y} r="5.6" fill="currentColor" filter="url(#nav-brush)" />
          ))}
        </g>
      </svg>
    )

  if (name === 'works')
    return (
      <svg {...props}>
        <clipPath id={`${uid}t`}>
          <rect width={art.w} height="35.5" />
        </clipPath>
        <clipPath id={`${uid}b`}>
          <rect y="35.5" width={art.w} height={art.h - 35.5} />
        </clipPath>
        <g className="ni-lid">
          <Ink id={`${uid}l`} art={art} clip={`url(#${uid}t)`} />
          <rect className="ni-screen" x="15" y="6" width="42.5" height="25.5" rx="2" fill="var(--cream)" opacity="0" />
        </g>
        <Ink id={`${uid}k`} art={art} clip={`url(#${uid}b)`} />
      </svg>
    )

  if (name === 'services')
    return (
      <svg {...props}>
        <g filter="url(#nav-brush)">
          {BITS.map((d, i) => (
            <g key={i} className="ni-bit" opacity="0">
              <path d={d} transform="scale(5)" fill={i % 2 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>
        <g className="ni-bag">
          <Ink id={uid} art={art} />
        </g>
      </svg>
    )

  if (name === 'journal')
    return (
      <svg {...props}>
        <clipPath id={`${uid}c`}>
          <rect x="31" width={art.w - 31} height={art.h} />
        </clipPath>
        <Ink id={uid} art={art} />
        {[0, 1].map((i) => (
          <g key={i} className="ni-page">
            <Ink id={`${uid}p${i}`} art={art} clip={`url(#${uid}c)`} />
          </g>
        ))}
      </svg>
    )

  return null
}

export function NavIconDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="nav-brush" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
