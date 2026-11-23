import { useState } from 'react'
import Pill from '../components/Pill'
import { Media } from '../components/Shared'
import { isVideo, coverOf, cvLink, getContent, getProjects, getSettings, useData } from '../lib/data'
import './About.css'

const BOOK_COLORS = ['var(--mandarine)', 'var(--lilac)', 'var(--olive)', 'var(--sky)', 'var(--blush)']
const TOOL_COLORS = ['var(--olive)', 'var(--red)', 'var(--olive)', 'var(--sky)', 'var(--blush)']
const VALUES = [
  ['Listen first', 'Ask better questions. Make room for the people behind the problem.', 'var(--yellow)', 'headphones'],
  ['Make it simple', 'Find what matters. Let everything else get out of the way.', 'var(--sky)', 'folder'],
  ['Prototype early', 'Make the idea tangible. Learn more by trying than by guessing.', 'var(--blush)', 'laptop'],
  ['Ship and polish', 'Stay close to the build. The little details deserve a good finish.', 'var(--olive)', 'bag'],
]

export default function About() {
  const { data: content } = useData('content', getContent)
  const { data: settings } = useData('settings', getSettings)
  const { data: projects } = useData('projects', getProjects)
  const covers = (projects ?? []).map(coverOf).filter((u) => u && !u.endsWith('/') && !isVideo(u))
  const intro =
    content?.about_intro ||
    "I'm Maryam, a curious designer based in Cairo. I connect visual storytelling, thoughtful experiences, and the code that brings them to life."
  const [first, ...rest] = intro.split(/(?<=\.)\s+/)

  return (
    <div className="page about">
      <section className="a-hero">
        <div className="a-hero__stage" data-reveal>
          <img className="a-hero__art" src="/assets/about-hero.png" alt="About me — a cut-out photo of Maryam surrounded by stickers" />
          <div className="a-hero__gif" aria-hidden="true">
            <img src="/assets/about-photo.gif" alt="" />
          </div>
        </div>
        <div className="a-hero__actions" data-reveal>
          <Pill to="/works">View work</Pill>
          <Pill href={cvLink(settings)} download="Maryam_Wessam_CV.pdf" variant="filled" icon="/assets/ic-download.png">
            Download CV
          </Pill>
        </div>
        <p className="a-hero__intro" data-reveal>
          {first}
          <br />
          {rest.join(' ')}
        </p>
      </section>

      <section className="a-codes stripes stripes--soft">
        <div className="a-codes__board">
          <img className="a-codes__blob" src="/assets/blob-about.png" alt="" aria-hidden="true" />
          {covers.slice(0, 4).map((src, i) => (
            <div key={src} className={`a-codes__img a-codes__img--${i}`}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
          <p className="a-codes__text" data-reveal>
            Designer <img src="/assets/doodle-flower.png" alt="" aria-hidden="true" /> who codes.
            <br />
            Coder who <img src="/assets/doodle-waves.png" alt="" aria-hidden="true" /> designs.
          </p>
        </div>
      </section>

      <Bookshelf slides={content?.about_journey ?? []} />
      <Values />
      <Workplaces items={content?.about_workplaces ?? []} />
      <OnRepeat audio={content?.about_on_repeat?.audio_url} />
    </div>
  )
}

function Bookshelf({ slides }) {
  const [i, setI] = useState(0)
  if (!slides.length) return null
  const s = slides[i]
  return (
    <section className="shelf section">
      <h2 className="shelf__title" data-reveal>
        Different tools. Same curiosity.
      </h2>
      <div className="shelf__row">
        <article className="shelf__page" key={i}>
          <div className="shelf__meta">
            <span>{s.years_label}</span>
            <span>
              {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
          <h3 className="shelf__h">{s.title}</h3>
          <p className="shelf__body">{s.body}</p>
          <div className="shelf__tools">
            {(s.tools ?? []).map((t, k) => (
              <span key={t} style={{ background: TOOL_COLORS[k % TOOL_COLORS.length], rotate: `${k % 2 ? -6 : 7}deg` }}>
                {t}
              </span>
            ))}
          </div>
          <p className="script shelf__script">{s.script_line}</p>
        </article>
        <div className="shelf__books" role="tablist" aria-label="Chapters">
          {slides.map((b, k) => (
            <button
              key={b.title}
              role="tab"
              aria-selected={i === k}
              className={`book book--${k % 3} ${i === k ? 'is-open' : ''}`}
              style={{ '--bg': BOOK_COLORS[k % BOOK_COLORS.length] }}
              onClick={() => setI(k)}
            >
              <span className="book__deco" aria-hidden="true" />
              <span className="book__label">{b.spine_label}</span>
              <span className="visually-hidden">{b.title}</span>
              <span className="book__deco book__deco--bottom" aria-hidden="true" />
            </button>
          ))}
          <span className="shelf__floor" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

function Values() {
  return (
    <section className="values">
      <div className="values__inner">
        <h2 className="values__title" data-reveal>
          Thoughtful by nature.
        </h2>
        <p className="values__sub" data-reveal>
          A few things I bring to every project, whatever shape it takes.
        </p>
        <div className="values__grid">
          {VALUES.map(([t, b, bg, st], i) => (
            <article key={t} className="value" style={{ '--bg': bg, '--delay': `${i * 0.08}s` }} data-reveal>
              <img className="value__st" src={`/assets/st-${st}.png`} alt="" aria-hidden="true" />
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Workplaces({ items }) {
  if (!items.length) return null
  return (
    <section className="work-places section">
      <h2 className="tpl-heading" data-reveal>
        Workplaces that lost a gem
      </h2>
      <ul className="work-places__list">
        {items.map((w, i) => (
          <li key={w.company_name + i} data-reveal style={{ '--delay': `${i * 0.08}s` }}>
            <div className="work-places__logo">
              {w.logo_url ? <img src={w.logo_url} alt="" /> : <span>{w.company_name.slice(0, 1)}</span>}
            </div>
            <div>
              <p className="work-places__name">{w.company_name}</p>
              <p className="work-places__date">{w.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function OnRepeat({ audio }) {
  const [playing, setPlaying] = useState(false)
  const toggle = () => {
    const el = document.getElementById('on-repeat-audio')
    if (el) (playing ? el.pause() : el.play()).catch?.(() => {})
    setPlaying((p) => !p)
  }
  return (
    <section className="repeat section">
      <h2 className="tpl-heading" data-reveal>
        my on repeat
      </h2>
      <button className={`repeat__player ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause' : 'Play'}>
        <Media src="/assets/record-player.png" alt="" />
      </button>
      {audio && <audio id="on-repeat-audio" src={audio} loop />}
      <p className="repeat__hint script">{playing ? 'now spinning' : 'tap to spin'}</p>
    </section>
  )
}
