import { useEffect, useState } from 'react'
import { Media } from '../../components/Shared'

const list = (v) => (Array.isArray(v) ? v : v ? String(v).split(/\n|;|•/).map((s) => s.trim()).filter(Boolean) : [])

/* ---------------------- Sticky process navigation ---------------------- */
export function Process({ steps, children, toggle = true }) {
  const [active, setActive] = useState(steps[0]?.id)
  const [detailed, setDetailed] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    steps.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [steps])

  return (
    <section className={`process ${detailed ? '' : 'is-brief'}`}>
      <div className="process__inner container--wide">
        <nav className="process__nav" aria-label="Case study sections">
          <ol>
            {steps.map((s, i) => (
              <li key={s.id} className={active === s.id ? 'is-active' : ''}>
                <a href={`#${s.id}`}>
                  <span className="script">{String(i + 1).padStart(2, '0')}</span> {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="process__content">
          {toggle && (
            <button className="process__toggle" role="switch" aria-checked={detailed} onClick={() => setDetailed((d) => !d)}>
              <span className="process__switch" aria-hidden="true" />
              Detailed Case Study
            </button>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}

export function Step({ id, children, className = '' }) {
  return (
    <div id={id} className={`step ${className}`} data-reveal>
      {children}
    </div>
  )
}

/* Cards with a red pin, tilted like they were pinned to a board */
export function PinnedCards({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="pinned">
      {items.map((c, i) => (
        <article key={i} className="pinned__card" style={{ '--rot': `${[-2, 1.5, -1, 2][i % 4]}deg` }}>
          <span className="pinned__pin" aria-hidden="true" />
          <h4>{c.title ?? c.number}</h4>
          {c.subtitle && <p className="pinned__sub">{c.subtitle}</p>}
          <p className="detail">{c.body}</p>
        </article>
      ))}
    </div>
  )
}

export function Personas({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="personas">
      {items.map((p, i) => (
        <article key={i} className="persona">
          <h4>{p.name ?? p.title}</h4>
          {p.role && <p className="persona__role">{p.role}</p>}
          {p.bio && <p className="persona__bio detail">{p.bio}</p>}
          <p className="persona__label persona__label--goals">Goals</p>
          <ul>{list(p.goals).map((g) => <li key={g}>{g}</li>)}</ul>
          <p className="persona__label persona__label--pain">Pain points</p>
          <ul className="is-pain">{list(p.pain_points).map((g) => <li key={g}>{g}</li>)}</ul>
          {p.needs && <p className="persona__needs detail"><strong>Needs:</strong> {p.needs}</p>}
        </article>
      ))}
    </div>
  )
}

export function JourneySteps({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="journey">
      {items.map((s, i) => (
        <article key={i} className="journey__card">
          <span className="journey__num">{s.number ?? String(i + 1).padStart(2, '0')}</span>
          <h4>{s.title}</h4>
          <p>{s.body}</p>
        </article>
      ))}
    </div>
  )
}

/* -------------------------- Dark showcase blocks ------------------------ */
export function Showcase({ title, children, className = '' }) {
  return (
    <section className={`showcase section ${className}`}>
      {title && <h2 className="tpl-heading" data-reveal>{title}</h2>}
      <div className="container--wide">{children}</div>
    </section>
  )
}

export function DesignSystem({ palette = [], fonts = [], extras = [] }) {
  const shown = extras.filter((e) => e.src)
  if (!palette.length && !fonts.length && !shown.length) return null
  return (
    <Showcase title="Design system">
      <div className="ds" data-reveal>
        {palette.length > 0 && (
          <div className="ds__block">
            <p className="ds__label">Colour palette</p>
            <div className="ds__swatches">
              {palette.map((c, i) => (
                <div key={i} className="ds__swatch">
                  <span style={{ background: c.hex }} />
                  {c.name && <b>{c.name}</b>}
                  <small>{c.hex}</small>
                </div>
              ))}
            </div>
          </div>
        )}
        {fonts.length > 0 && (
          <div className="ds__block">
            <p className="ds__label">Typography</p>
            <div className="ds__fonts">
              {fonts.map((f) => (
                <div key={f.name} className="ds__font">
                  <span className="ds__aa" style={{ fontFamily: `'${f.name}', var(--sans)` }}>Aa</span>
                  <div>
                    <b>{f.name}</b>
                    <small>{f.usage}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {shown.map((e) => (
          <figure key={e.label} className="ds__block ds__figure">
            <p className="ds__label">{e.label}</p>
            <Media src={e.src} alt={e.label} />
          </figure>
        ))}
      </div>
    </Showcase>
  )
}

export function ScreensRow({ title, images = [], variant = 'phone' }) {
  if (!images.length) return null
  return (
    <Showcase title={title}>
      <div className={`screens screens--${variant}`} data-reveal>
        {images.map((img) => (
          <figure key={img.id ?? img.url} className="screens__item">
            <Media src={img.url} alt={img.label ?? ''} video={img.media_type === 'video'} />
            {(img.label || img.caption) && (
              <figcaption>
                {img.label && <b>{img.label}</b>}
                {img.caption && <span>{img.caption}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </Showcase>
  )
}

export function Walkthrough({ src, variant = 'both', extra = [] }) {
  const options = variant === 'both' ? ['website', 'phone'] : [variant === 'website' ? 'website' : 'phone']
  const [mode, setMode] = useState(options[0])
  const videos = [src, ...extra.map((e) => e.url)].filter(Boolean)
  if (!videos.length) return null
  return (
    <Showcase title="Walkthrough">
      {options.length > 1 && (
        <div className="walk__toggle" role="tablist">
          {options.map((o) => (
            <button key={o} role="tab" aria-selected={mode === o} className={mode === o ? 'is-on' : ''} onClick={() => setMode(o)}>
              {o === 'website' ? 'Website' : 'Phone'}
            </button>
          ))}
        </div>
      )}
      <div className={`walk walk--${mode}`} data-reveal>
        <div className="walk__frame">
          {mode === 'website' && <div className="walk__bar" aria-hidden="true"><i /><i /><i /></div>}
          <video src={videos[0]} autoPlay muted loop playsInline controls />
        </div>
      </div>
    </Showcase>
  )
}

export function Gallery({ title, images = [] }) {
  if (!images.length) return null
  return (
    <Showcase title={title}>
      <div className="gallery" data-reveal>
        {images.map((img, i) => (
          <figure key={img.id ?? i} className="gallery__item" style={{ '--rot': `${[-1.5, 1, -0.5, 1.5][i % 4]}deg` }}>
            <Media src={img.url} alt={img.label ?? ''} video={img.media_type === 'video'} />
            {img.label && <figcaption>{img.label}</figcaption>}
          </figure>
        ))}
      </div>
    </Showcase>
  )
}

/** Cream rounded card on the cream band (Concept, Brief, Research objective…) */
export function NoteCard({ eyebrow, title, body, tone = 'cream', children }) {
  if (!body && !children) return null
  return (
    <article className={`note-card note-card--${tone}`} data-reveal>
      {eyebrow && <p className="note-card__eyebrow">{eyebrow}</p>}
      <h2 className="note-card__title">{title}</h2>
      {body && <p className="note-card__body">{body}</p>}
      {children}
    </article>
  )
}

export const asList = list
