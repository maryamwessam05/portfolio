import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STICKERS } from '../lib/theme'
import { isVideo } from '../lib/data'
import './Shared.css'

/* ------------------------------ Media ------------------------------ */
export function Media({ src, alt = '', className = '', video, poster, ...rest }) {
  if (!src) return <div className={`media-placeholder ${className}`} aria-hidden="true" {...rest} />
  if (video || isVideo(src))
    return <video className={className} src={src} poster={poster} autoPlay muted loop playsInline {...rest} />
  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" {...rest} />
}

/* ---------------------------- Sticker ------------------------------ */
export function Sticker({ name, className = '', style, wobble = true }) {
  return (
    <img
      src={STICKERS[name]}
      alt=""
      aria-hidden="true"
      className={`sticker ${wobble ? 'wobble' : ''} ${className}`}
      style={style}
      loading="lazy"
    />
  )
}

/* --------------------------- Closing CTA --------------------------- */
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

/* ------------------------------- FAQ ------------------------------- */
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

/* ---------------------------- Kind words --------------------------- */
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

/* ------------------------------ Up next ---------------------------- */
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

/* ------------------------------ Loading ---------------------------- */
export function PageLoading({ light }) {
  return (
    <div className={`page-loading ${light ? 'page-loading--light' : ''}`} role="status">
      <img src="/assets/big-m.png" alt="" />
      <span>getting it ready…</span>
    </div>
  )
}
