import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { STICKER_LIST } from '../lib/theme'
import './Preloader.css'

// Pile layout (percent of the viewport) loosely following the Figma pile in the bottom-left corner.
const PILE = Array.from({ length: 18 }, (_, i) => {
  const col = i % 6
  const row = Math.floor(i / 6)
  return {
    src: STICKER_LIST[i % STICKER_LIST.length].src,
    left: -6 + col * 9 + (row % 2) * 4 + ((i * 37) % 7),
    bottom: -6 + row * 13 + ((i * 53) % 9),
    rot: ((i * 47) % 40) - 20,
    size: 11 + ((i * 29) % 5),
  }
})

/** Sticker-drop preloader. Every sticker is a chunk of progress; at 100 the pile bursts and the page shows. */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stickers = gsap.utils.toArray('.preloader__sticker')
      const counter = { v: 0 }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.preloader__line', { opacity: 0, y: 12, duration: 0.6 })
        .from('.preloader__m', { scale: 0.6, rotate: -14, opacity: 0, duration: 0.8, ease: 'back.out(1.8)' }, '<')
        .from('.preloader__sq', { opacity: 0, xPercent: -10, duration: 1, stagger: 0.12 }, '<')
        .from(
          stickers,
          { y: () => -window.innerHeight * 1.1, rotate: () => gsap.utils.random(-60, 60), duration: 0.55, stagger: 0.09, ease: 'bounce.out' },
          0.3,
        )
        .to(counter, { v: 100, duration: 0.09 * stickers.length + 0.4, ease: 'none', onUpdate: () => setPct(Math.round(counter.v)) }, 0.3)
        // burst
        .to(stickers, {
          x: () => gsap.utils.random(-1, 1) * window.innerWidth,
          y: () => gsap.utils.random(-1.2, 0.4) * window.innerHeight,
          rotate: () => gsap.utils.random(-180, 180),
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in',
          stagger: 0.01,
        })
        .to('.preloader__m, .preloader__line, .preloader__count, .preloader__sq', { opacity: 0, duration: 0.3 }, '<0.2')
        .to(root.current, { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '-=0.2')
        .add(() => onDone?.())
    }, root)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="preloader" ref={root} role="status" aria-live="polite">
      <img className="preloader__sq preloader__sq--a" src="/assets/squiggle-1.png" alt="" />
      <img className="preloader__sq preloader__sq--b" src="/assets/squiggle-1.png" alt="" />
      <img className="preloader__sq preloader__sq--c" src="/assets/squiggle-1.png" alt="" />
      <p className="preloader__line">dont rush me. im getting ready</p>
      <img className="preloader__m" src="/assets/big-m.png" alt="" />
      {PILE.map((s, i) => (
        <img
          key={i}
          className="preloader__sticker"
          src={s.src}
          alt=""
          style={{ left: `${s.left}vw`, bottom: `${s.bottom}vh`, width: `max(${s.size}vw, 90px)`, rotate: `${s.rot}deg` }}
        />
      ))}
      <p className="preloader__count">
        <span className="visually-hidden">Loading </span>
        {String(pct).padStart(2, '0')}%
      </p>
    </div>
  )
}
