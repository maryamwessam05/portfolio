import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { STICKERS } from '../lib/theme'
import { isVideo } from '../lib/data'
import './Shared.css'

export function Media({ src, fallback, alt = '', className = '', video, poster, ...rest }) {
  const [tries, setTries] = useState(0)
  const [lastSrc, setLastSrc] = useState(src)
  if (lastSrc !== src) {
    setLastSrc(src)
    setTries(0)
  }
  const url = tries === 0 ? src : tries === 1 && fallback && fallback !== src ? fallback : null
  const fail = () => setTries((t) => (t === 0 && fallback && fallback !== src ? 1 : 2))
  if (!url) return <div className={`media-placeholder ${className}`} aria-hidden="true" {...rest} />
  if (video || isVideo(url))
    return <video className={className} src={url} poster={poster} autoPlay muted loop playsInline onError={fail} {...rest} />
  return <img className={className} src={url} alt={alt} loading="lazy" decoding="async" onError={fail} {...rest} />
}

let sizeObs, viewObs
function watchSticker(el) {
  if (typeof window === 'undefined' || !('ResizeObserver' in window)) return () => {}
  sizeObs ??= new ResizeObserver((entries) => {
    for (const { target, contentRect: r } of entries) {
      target.style.setProperty('--w', `${r.width}px`)
      target.style.setProperty('--h', `${r.height}px`)
      target.style.setProperty('--s', `${Math.min(r.width, r.height)}px`)
    }
  })
  viewObs ??= new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.dataset.in = '', viewObs.unobserve(e.target))),
    { threshold: 0.4 },
  )
  sizeObs.observe(el)
  viewObs.observe(el)
  return () => {
    sizeObs.unobserve(el)
    viewObs.unobserve(el)
  }
}

const insetCache = new Map()
function cornerInset(img, side) {
  const key = `${img.currentSrc}|${side}`
  if (insetCache.has(key)) return insetCache.get(key)
  let inset = 0
  try {
    const W = 80
    const H = Math.max(1, Math.round((W * img.naturalHeight) / img.naturalWidth))
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, W, H)
    const d = ctx.getImageData(0, 0, W, H).data
    let best = Infinity
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (d[(y * W + x) * 4 + 3] > 40) best = Math.min(best, side === 'br' ? W + H - x - y : H - y + x)
    if (best < Infinity) inset = best / W
  } catch {
  }
  insetCache.set(key, inset)
  return inset
}

export function Sticker({ name, src, className = '', style, wobble = true, corner }) {
  const ref = useRef(null)
  const url = src || STICKERS[name]
  const side = corner || ((name || url || '').length % 2 ? 'bl' : 'br')
  useEffect(() => (ref.current ? watchSticker(ref.current) : undefined), [])
  const onLoad = (e) => ref.current?.style.setProperty('--o', cornerInset(e.currentTarget, side))
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`sticker peel peel--${side} ${wobble ? 'wobble' : ''} ${className}`}
      style={{ ...style, '--src': `url("${url}")` }}
    >
      <img className="peel__img" src={url} alt="" loading="lazy" draggable="false" onLoad={onLoad} />
      <span className="peel__flap-shadow">
        <span className="peel__flap" />
      </span>
    </span>
  )
}

const CTA_STICKERS = [
  { name: 'folder', style: { left: '42%', top: '4%', width: 'clamp(70px,8.6vw,125px)', '--r': '-10deg' } },
  { name: 'bag', style: { left: '4%', top: '21%', width: 'clamp(80px,10.6vw,153px)', '--r': '12deg' } },
  { name: 'laptop', style: { right: '9%', top: '17%', width: 'clamp(80px,10.6vw,153px)', '--r': '-10deg' } },
  { name: 'disco', style: { left: '9%', bottom: '24%', width: 'clamp(80px,11.6vw,167px)', '--r': '8deg' } },
  { name: 'headphones', style: { right: '6%', bottom: '28%', width: 'clamp(80px,10.6vw,153px)', '--r': '-6deg' } },
  { name: 'cups', style: { left: '57%', bottom: '8%', width: 'clamp(70px,9.6vw,139px)', '--r': '6deg' } },
]

export function ClosingCta() {
  return (
    <section className="closing-cta">
      {CTA_STICKERS.map((s, i) => (
        <Sticker key={s.name} name={s.name} className="closing-cta__sticker" style={{ ...s.style, animationDelay: `${i * -0.7}s` }} />
      ))}
      <h2 className="closing-cta__title" data-reveal>
        <span className="script">have an idea?</span>
        <span className="closing-cta__big">LET’S MAKE IT HAPPEN</span>
      </h2>
      <Link to="/contact" className="closing-cta__btn" data-reveal style={{ '--delay': '0.15s' }}>
        <img src="/assets/cta-outline.png" alt="" aria-hidden="true" />
        <span>GET IN TOUCH</span>
      </Link>
    </section>
  )
}

export function Faq({ items = [] }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq">
      <div className="faq__inner">
        <div className="faq__intro" data-reveal>
          <p className="faq__eyebrow">BEFORE YOU ASK</p>
          <h2 className="faq__title">
            <span>A few</span>
            <span className="script">answers.</span>
          </h2>
          <p className="faq__note">
            Still wondering about something?
            <br />
            <Link to="/contact">That's a good reason to say hello.</Link>
          </p>
        </div>
        <div className="faq__list">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <article key={item.question} className={`faq__item ${isOpen ? 'is-open' : ''}`} data-reveal style={{ '--delay': `${i * 0.05}s` }}>
                <h3>
                  <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                    {item.question}
                    <span className="faq__icon" aria-hidden="true">+</span>
                  </button>
                </h3>
                <div className="faq__a" role="region">
                  <div>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function KindWords({ testimonial, image }) {
  if (!testimonial) return null
  return (
    <section className="kind-words section">
      <h2 className="tpl-heading" data-reveal>A few kind words</h2>
      <div className="kind-words__row container--wide">
        <figure className="kind-words__card" data-reveal>
          <span className="kind-words__mark script" aria-hidden="true">“</span>
          <blockquote>{testimonial.quote}</blockquote>
          <figcaption>
            <span className="script">{testimonial.author_name}</span>
            <small>{testimonial.author_role}</small>
          </figcaption>
        </figure>
        {image && (
          <div className="kind-words__img" data-reveal style={{ '--delay': '0.1s' }}>
            <Media src={image} />
          </div>
        )}
      </div>
    </section>
  )
}

export function UpNext({ project }) {
  if (!project) return null
  return (
    <section className="up-next container--wide" data-reveal>
      <Link to={`/work/${project.slug}`} className="up-next__card">
        <div className="up-next__bg">
          <Media src={project.basics?.cover_url || project.thumbnail_url} alt="" />
        </div>
        <div className="up-next__text">
          <span className="script">Up next</span>
          <span className="up-next__title">{project.title}</span>
        </div>
        <span className="up-next__arrow" aria-hidden="true">→</span>
      </Link>
    </section>
  )
}

export function PageLoading({ light }) {
  return (
    <div className={`page-loading ${light ? 'page-loading--light' : ''}`} role="status">
      <img src="/assets/big-m.png" alt="" />
      <span>getting it ready…</span>
    </div>
  )
}
