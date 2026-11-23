import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Pill from '../../components/Pill'
import { useIntroDone } from '../../lib/intro'
import { coverOf, cvLink, isVideo } from '../../lib/data'
import { useMediaQuery } from '../../lib/hooks'
import './Hero.mobile.css'

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

const EXTRA = [
  [[300, 300, 450, 8], [-390, 420, 360, 8]],
  [[700, 150, 450, -6], [1310, 400, 360, -6]],
  [[100, 500, 450, 10], [-300, 690, 360, 10]],
  [[900, 350, 450, -12], [1390, 560, 360, -12]],
  [[500, 620, 450, 5], [420, 840, 360, 5]],
  [[1100, 100, 450, 14], [1240, 870, 360, 14]],
  [[-100, 100, 450, -5], [40, 880, 360, -5]],
  [[1000, 650, 450, 9], [960, 905, 360, 9]],
]
EXTRA.forEach(([pile, frame]) => {
  PILE.push(pile)
  FRAME.push(frame)
})

const TOP_BAND = 260
const LIFT = 250
FRAME.forEach((pos) => {
  if (pos[1] < TOP_BAND) pos[1] -= LIFT
})
const M_PILE = [
  [10, 60, 210, 17], [160, 90, 210, -9], [40, 170, 210, 7], [170, 200, 210, -14], [0, 300, 210, 12], [150, 310, 210, -6],
  [60, 240, 210, 22], [120, 400, 210, -20], [-20, 420, 210, 5], [190, 430, 210, 10], [60, 500, 210, -11], [170, 520, 210, 15],
]
const M_FRAME = [
  [-90, -140, 190, 12], [285, -125, 190, -10], [-150, 170, 190, 8], [-160, 330, 190, -10], [352, 200, 190, -8], [356, 360, 190, 12],
  [-40, 480, 190, -6], [120, 500, 190, 8], [270, 470, 190, -12], [30, 560, 190, 10], [200, 570, 190, -4], [-100, 600, 190, 6],
]

const LAYOUTS = {
  desktop: { pile: PILE, frame: FRAME, W: 1440, H: 871 },
  phone: { pile: M_PILE, frame: M_FRAME, W: 390, H: 640 },
}
const toStyle = ([x, y, w, r], { W, H }) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${(w / W) * 100}%`, rotate: `${r}deg` })

export default function Hero({ projects, settings }) {
  const root = useRef(null)
  const introDone = useIntroDone()
  const phone = useMediaQuery('(max-width: 720px)')
  const L = phone ? LAYOUTS.phone : LAYOUTS.desktop
  const images = projects
    .filter((p) => !p.categories.some((c) => c.slug === 'contextual-research'))
    .map(coverOf)
    .filter((u) => u && !isVideo(u))

  useEffect(() => {
    if (!introDone || !images.length) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.hero__card')
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from(cards, { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.025, ease: 'back.out(1.6)' })
        .to(
          cards,
          {
            left: (i) => toStyle(L.frame[i], L).left,
            top: (i) => toStyle(L.frame[i], L).top,
            width: (i) => toStyle(L.frame[i], L).width,
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
  }, [introDone, images.length, phone])

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
          L.pile.map((pos, i) => (
            <div key={`${phone ? 'p' : 'd'}${i}`} className="hero__card" style={toStyle(pos, L)}>
              <img src={images[i % images.length]} alt="" loading={i < 8 ? 'eager' : 'lazy'} onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
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
          <Pill href={cvLink(settings)} download="Maryam_Wessam_CV.pdf" variant="filled" icon="/assets/ic-download.png">
            Download CV
          </Pill>
        </div>
      </div>
    </section>
  )
}
