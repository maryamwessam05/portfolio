import { useState } from 'react'
import { Media } from '../../components/Shared'
import { NoteCard, Showcase } from './parts'

export default function CodingTemplate({ project: p, data: d, show }) {
  const [linked, setLinked] = useState(false)
  const dash = d.dashboard_screen_image || p.imagesBy('dashboard')[0]?.url
  const site = d.website_screen_image || p.imagesBy('website')[0]?.url || p.imagesBy('screens')[0]?.url
  const inUse = d.site_in_use_image || p.imagesBy('mockups')[0]?.url

  return (
    <>
      {show('concept') && (
        <section className="cream-band">
          <div className="container--wide">
            <NoteCard title="Concept" body={d.concept_body} />
          </div>
        </section>
      )}

      {show('built_with') && (d.built_with ?? []).length > 0 && (
        <Showcase className="showcase--left">
          <h2 className="tpl-heading tpl-heading--left">Built with</h2>
          <div className="built" data-reveal>
            {d.built_with.map((b) => (
              <article key={b.tool ?? b.name} className="built__card">
                <span className="built__chip">{b.tool ?? b.name}</span>
                <p>{b.note ?? b.usage}</p>
              </article>
            ))}
          </div>
        </Showcase>
      )}

      {show('connected') && (
        <Showcase className="showcase--left">
          <h2 className="tpl-heading tpl-heading--left">How the dashboard and the website are connected</h2>
          <p className="connected__intro">{d.connected_body}</p>
          <button className={`connect-toggle ${linked ? 'is-on' : ''}`} role="switch" aria-checked={linked} onClick={() => setLinked((l) => !l)}>
            Show the connection <span>{linked ? 'On' : 'Off'}</span>
          </button>
          <div className={`connected ${linked ? 'is-linked' : ''}`} data-reveal>
            <figure>
              <Media src={dash} alt="Dashboard screen" />
              <figcaption>Dashboard screen</figcaption>
            </figure>
            <svg className="connected__line" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 10 C 30 -6, 70 26, 100 10" />
            </svg>
            <figure>
              <Media src={site} alt="Website screen" />
              <figcaption>Website screen</figcaption>
            </figure>
          </div>
          <ol className="flow" data-reveal>
            {(d.connected_steps ?? []).map((s, i) => (
              <li key={i} className="flow__step" style={{ '--i': i }}>
                <span className="script">{s.number ?? String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </Showcase>
      )}

      {show('site_in_use') && inUse && (
        <Showcase className="showcase--left">
          <h2 className="tpl-heading tpl-heading--left">The site in use</h2>
          <div className="in-use" data-reveal>
            <Media src={inUse} alt="The site in use" />
          </div>
        </Showcase>
      )}
    </>
  )
}
