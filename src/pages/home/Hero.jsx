import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Pill from '../../components/Pill'
import { useIntroDone } from '../../lib/intro'
import { coverOf } from '../../lib/data'

// Card positions from the two Figma hero variants (frame 1440 × 871): [x, y, width, rotation].
const PILE = [
  [-296, 59, 494, 17], [667, 642, 494, 17], [449, 59, 494, 17], [182, 503, 474, 17], [-243, 652, 474, 17],
  [927, 503, 474, 17], [1693, 148, 474, -152], [-195, 226, 494, 7], [550, 226, 494, 7], [275, 540, 494, -8],
  [-195, 386, 495, -9], [550, 386, 495, -9], [139, 239, 463, 12], [884, 239, 463, 12], [1787, 398, 463, -157],
  [190, -78, 424, -12], [935, -78, 424, -12], [1226, 566, 424, -12], [1798, 719, 424, 179],
]
const FRAME = [
  [-158, -126, 400, 17], [771, 866, 400, 17], [510, -158, 400, 17], [-21, 844, 420, 17], [-326, 609, 383, 17],
  [1128, 761, 383, 17], [1607, -90, 383, -152], [-366, 98, 400, 7], [592, -172, 400, 7], [345, 757, 400, -8],
  [-334, 228, 401, -9], [592, 751, 401, -9], [-228, 765, 375, 12], [1338, 43, 375, 12], [1772, 309, 375, -157],
  [300, -234, 343, -12], [903, -205, 343, -12], [1128, 794, 343, 10], [1713, 666, 343, 179],
]
const W = 1440
const H = 871
const toStyle = ([x, y, w, r]) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${(w / W) * 100}%`, rotate: `${r}deg` })

export default function Hero({ projects, settings }) {
  const root = useRef(null)
  const introDone = useIntroDone()
  const images = projects.map(coverOf).filter(Boolean)

  useEffect(() => {
    if (!introDone || !images.length) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.hero__card')
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from(cards, { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.025, ease: 'back.out(1.6)' })
        .to(
          cards,
          {
            left: (i) => toStyle(FRAME[i]).left,
            top: (i) => toStyle(FRAME[i]).top,
            width: (i) => toStyle(FRAME[i]).width,
            duration: 1.3,
            ease: 'power3.inOut',
            stagger: { each: 0.03, from: 'center' },
          },
          '+=0.35',
        )
        .from('.hero__hi', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero__logo', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' }, '-=0.4')
        .from('.hero__line, .hero__actions > *', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.6')
    }, root)
    return () => ctx.revert()
  }, [introDone, images.length])

  // Gentle parallax on the frame of cards.
  useEffect(() => {
    const el = root.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - r.left) / r.width - 0.5
      const dy = (e.clientY - r.top) / r.height - 0.5
      gsap.to(el.querySelector('.hero__cards'), { x: dx * -18, y: dy * -12, duration: 1, ease: 'power2.out' })
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [])

  return (
    <section className="hero" ref={root}>
      <div className="hero__cards" aria-hidden="true">
        {images.length > 0 &&
          PILE.map((pos, i) => (
            <div key={i} className="hero__card" style={toStyle(pos)}>
              <img src={images[i % images.length]} alt="" loading={i < 8 ? 'eager' : 'lazy'} />
            </div>
          ))}
      </div>
      <div className="hero__center">
        <h1 className="hero__title">
          <span className="hero__hi script">hi this is</span>
          <img className="hero__logo" src="/assets/maryam-logo.png" alt="maryam" />
          <span className="hero__line">a product/graphic designer</span>
        </h1>
        <div className="hero__actions">
          <Pill to="/works">View Work</Pill>
          <Pill
            href={settings?.cv_url?.startsWith('http') ? settings.cv_url : undefined}
            to={settings?.cv_url?.startsWith('http') ? undefined : '/about'}
            variant="filled"
            icon="/assets/ic-download.png"
          >
            Download CV
          </Pill>
        </div>
      </div>
    </section>
  )
}
