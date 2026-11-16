import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import TitleStack from '../../components/TitleStack'
import Pill from '../../components/Pill'
import { Media } from '../../components/Shared'
import { STICKER_LIST } from '../../lib/theme'
import { coverOf } from '../../lib/data'

const ROT = [4, -3, 2, -1.5, 3]

/** "selected WORK": a messy stack of paper cards — click the top one to send it to the back. */
export function SelectedWork({ projects }) {
  const [order, setOrder] = useState(() => projects.map((_, i) => i))
  const stackRef = useRef(null)
  const busy = useRef(false)

  const next = () => {
    if (busy.current || order.length < 2) return
    busy.current = true
    const top = stackRef.current.querySelector('.paper-card.is-top')
    gsap
      .timeline({
        onComplete: () => {
          setOrder((o) => [...o.slice(1), o[0]])
          gsap.set(top, { clearProps: 'transform,opacity' })
          busy.current = false
        },
      })
      .to(top, { x: '60%', y: -40, rotate: 18, duration: 0.35, ease: 'power2.in' })
      .to(top, { x: 0, y: 0, rotate: 0, opacity: 0.6, scale: 0.94, duration: 0.35, ease: 'power2.out' })
  }

  return (
    <section className="selected section" id="work">
      <TitleStack script="selected" main="Work" />
      <div className="selected__stack" ref={stackRef}>
        {order.map((idx, depth) => {
          const p = projects[idx]
          const cats = p.categories.slice(0, 2)
          return (
            <article
              key={p.id}
              className={`paper-card ${depth === 0 ? 'is-top' : ''}`}
              style={{ zIndex: order.length - depth, '--rot': `${ROT[idx % ROT.length]}deg`, '--depth': depth }}
              onClick={depth === 0 ? next : undefined}
            >
              <div className="paper-card__img">
                <Media src={coverOf(p)} alt={p.title} />
              </div>
              <div className="paper-card__meta">
                <div>
                  <h3 className="paper-card__title">
                    <Link to={`/work/${p.slug}`} onClick={(e) => e.stopPropagation()}>
                      {p.title}
                    </Link>
                  </h3>
                  <p className="paper-card__tagline">{p.basics.tagline}</p>
                </div>
                <div className="paper-card__side">
                  {p.basics.year && <span className="script paper-card__year">{p.basics.year}</span>}
                  <div className="paper-card__tags">
                    {cats.map((c) => (
                      <span key={c.slug}>{c.name}</span>
                    ))}
                  </div>
                </div>
              </div>
              {depth === 0 && <img className="paper-card__sticker" src={STICKER_LIST[idx % STICKER_LIST.length].src} alt="" aria-hidden="true" />}
            </article>
          )
        })}
      </div>
      <p className="selected__hint" data-reveal>
        <button onClick={next}>
          <span className="script">shuffle the pile</span> ↻
        </button>
      </p>
    </section>
  )
}

/** "more from THE DESK": endless drifting row of cards. */
export function Desk({ projects }) {
  const row = [...projects, ...projects]
  return (
    <section className="desk section">
      <TitleStack script="more from" main="The desk" />
      <div className="desk__viewport">
        <div className="desk__track" style={{ '--dur': `${projects.length * 7}s` }}>
          {row.map((p, i) => (
            <Link key={`${p.id}-${i}`} to={`/work/${p.slug}`} className="desk-card" style={{ '--rot': i % 2 ? '2deg' : '-2deg' }} tabIndex={i >= projects.length ? -1 : 0}>
              <div className="desk-card__img">
                <Media src={coverOf(p)} alt="" />
              </div>
              <p className="desk-card__title">{p.title}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="desk__cta" data-reveal>
        <Pill to="/works">See all work</Pill>
      </div>
    </section>
  )
}
