import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ClosingCta, Faq, Media, PageLoading, Sticker } from '../components/Shared'
import { coverOf, getContent, getProjects, getServices, useData } from '../lib/data'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const CARD_TONES = [
  ['var(--cream)', 'var(--burgundy)'],
  ['var(--burgundy)', 'var(--cream)'],
  ['var(--olive)', 'var(--cream)'],
  ['var(--mandarine)', 'var(--cream)'],
]
// Which work category to deep-link from each service card.
const SERVICE_CATEGORY = {
  'ux-ui': 'ux-ui-design',
  'brand-identity': 'branding',
  branding: 'graphic-design',
  'motion-graphics': 'motion-graphics',
  'coding-development': 'coding-development',
  'immersive-games': 'game-ux-ui',
  'contextual-research': 'contextual-research',
}
const PHASES = [
  { n: '01 PLAN', title: 'Plan', bg: 'var(--sky)', items: ['Discovery', 'Research', 'User flows', 'Strategy', 'Personas', 'Sitemap'] },
  { n: '02 Design', title: 'Design', bg: 'var(--blush)', items: ['Wireframes', 'UI kit', 'Prototype', 'Visual style', 'Interaction', 'Design QA'] },
  { n: '03 Develop', title: 'Develop', bg: 'var(--yellow)', items: ['Components', 'Responsive', 'Motion', 'Data', 'QA', 'Launch'] },
]
const HOW = [
  ['01', 'Say hello', 'Tell me what you have in mind. Half-formed ideas are welcome.'],
  ['02', 'Find the focus', 'We agree on the problem, the people and the possibilities.'],
  ['03', 'Make & explore', 'I share directions early, so we can shape the good stuff together.'],
  ['04', 'Refine the details', 'We test, talk and polish. Nothing gets lost in the handoff.'],
  ['05', 'Send it out', 'A considered launch, organised files and a little aftercare.'],
]

export default function Services() {
  const { data: services } = useData('services', getServices)
  const { data: content } = useData('content', getContent)
  const { data: projects } = useData('projects', getProjects)

  if (!services) return <PageLoading />
  const covers = (projects ?? []).map(coverOf).filter((u) => u && !u.endsWith('/'))
  const packages = content?.services_packages ?? []
  const faq = content?.services_faq ?? []

  return (
    <div className="page services">
      <ServicesHero covers={covers.slice(0, 4)} />
      <StackedServices services={services} projects={projects ?? []} />
      <Phases />
      <HowIWork />
      <Packages packages={packages} />
      <Faq items={faq} />
      <ClosingCta />
    </div>
  )
}

function ServicesHero({ covers }) {
  return (
    <section className="s-hero">
      <img className="s-hero__squiggle" src="/assets/services-squiggle.png" alt="" aria-hidden="true" />
      <h1 className="s-hero__title" data-reveal>
        <span>Good ideas deserve a</span>
        <span className="s-hero__more">
          <img src="/assets/blob-cream.png" alt="" aria-hidden="true" />
          <span className="script">little more.</span>
        </span>
      </h1>
      <div className="s-hero__pocket" aria-hidden="true">
        <span className="s-hero__back" />
        {covers.map((src, i) => (
          <div key={src} className="s-hero__card" style={{ '--i': i, '--rot': i % 2 ? '-4deg' : '6deg' }}>
            <img src={src} alt="" />
          </div>
        ))}
        <span className="s-hero__front" />
      </div>
      <a href="#services-list" className="s-hero__scroll">
        Scroll to explore <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}

/** 80%-width cards that stack on top of each other while you scroll. */
function StackedServices({ services, projects }) {
  return (
    <section className="stacked" id="services-list">
      {services.map((s, i) => {
        const [bg, fg] = CARD_TONES[i % CARD_TONES.length]
        const cat = SERVICE_CATEGORY[s.slug]
        const previews = (s.preview_images ?? []).filter(Boolean)
        const fallback = projects.filter((p) => p.categories.some((c) => c.slug === cat)).map(coverOf).filter(Boolean)
        const imgs = (previews.length ? previews : fallback).slice(0, 3)
        return (
          <article key={s.id} className="svc" style={{ '--bg': bg, '--fg': fg, '--i': i, top: `calc(90px + ${i * 56}px)` }}>
            <header className="svc__head">
              <h2 className="svc__title">{s.name}</h2>
              <p className="svc__desc">{s.description}</p>
            </header>
            <div className="svc__body">
              <div className="svc__get">
                <p className="script">What you get</p>
                <ul>
                  {(s.what_you_get ?? []).map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              <div className="svc__imgs">
                {[0, 1, 2].map((k) => (
                  <div key={k} className="svc__img" style={{ '--rot': `${[-3, 2, -1][k]}deg` }}>
                    <Media src={imgs[k]} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <footer className="svc__foot">
              <Link to={s.see_all_link || (cat ? `/works?category=${cat}` : '/works')} className="svc__all">
                <span className="hand-outline" aria-hidden="true" />
                See all work ↗
              </Link>
            </footer>
          </article>
        )
      })}
    </section>
  )
}

/** "three phases ONE FLOW": cards start stacked and fan out into three columns on scroll. */
function Phases() {
  const root = useRef(null)
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.phase', root.current)
      gsap.from(cards, {
        xPercent: (i) => (1 - i) * 112,
        rotate: (i) => (i - 1) * -6,
        y: (i) => (i === 1 ? 0 : 30),
        ease: 'power2.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 25%', scrub: 0.8 },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="phases section" ref={root}>
      <h2 className="title-stack" data-reveal>
        <span className="title-stack__script">three phases</span>
        <span className="title-stack__main">One flow</span>
      </h2>
      <div className="phases__row">
        {PHASES.map((p, i) => (
          <article key={p.title} className="phase" style={{ '--bg': p.bg, zIndex: i === 1 ? 2 : 1 }}>
            <header>
              <span>{p.n}</span>
              <span aria-hidden="true">↗</span>
            </header>
            <h3>{p.title}</h3>
            <ol>
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <Sticker name="laptop" className="phases__sticker" />
    </section>
  )
}

function HowIWork() {
  return (
    <section className="how">
      <div className="how__inner">
        <h2 className="how__title" data-reveal>
          How I <span className="script">work.</span>
        </h2>
        <p className="how__sub" data-reveal>
          Clear steps. Shared ideas. A little room for the unexpected.
        </p>
        <ol className="how__line">
          {HOW.map(([n, t, b], i) => (
            <li key={n} data-reveal style={{ '--delay': `${i * 0.08}s` }}>
              <span className="script how__n">{n}</span>
              <h3>{t}</h3>
              <p>{b}</p>
            </li>
          ))}
        </ol>
      </div>
      <Sticker name="cups" className="how__sticker" />
    </section>
  )
}

function Packages({ packages }) {
  const services = [...new Set(packages.map((p) => p.service).filter(Boolean))]
  const [svc, setSvc] = useState(services[0] ?? '')
  const list = packages.filter((p) => !svc || p.service === svc)
  if (!packages.length) return null
  return (
    <section className="packages section">
      <div className="packages__inner">
        <div className="packages__head" data-reveal>
          <h2>
            A few ways <span className="script">in.</span>
          </h2>
          {services.length > 0 && (
            <label className="packages__select">
              <span className="visually-hidden">Service</span>
              <select value={svc} onChange={(e) => setSvc(e.target.value)}>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('-', '/').toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <p className="packages__sub" data-reveal>
          Every proposal is personal. Think of these as starting points.
        </p>
        <div className="packages__grid">
          {list.map((p, i) => (
            <article key={p.title} className={`pkg ${p.is_featured ? 'pkg--featured' : ''}`} data-reveal style={{ '--delay': `${i * 0.08}s` }}>
              {p.badge && <span className="pkg__badge">{p.badge}</span>}
              <p className="script pkg__script">{p.script_label}</p>
              <h3 className="pkg__title">{p.title}</h3>
              <p className="pkg__desc">{p.description}</p>
              <p className="pkg__scope">{p.scope}</p>
              <ul className="pkg__list">
                {(p.includes ?? []).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <Link to="/contact" className="pkg__cta">
                Let's talk <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
