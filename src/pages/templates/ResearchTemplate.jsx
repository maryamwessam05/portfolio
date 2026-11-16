import { Media } from '../../components/Shared'
import { NoteCard, Showcase } from './parts'

export default function ResearchTemplate({ project: p, data: d, show }) {
  const methods = d.methods ?? []
  const evidence = (d.evidence_images ?? []).filter((e) => e.url).length
    ? d.evidence_images.filter((e) => e.url)
    : p.images.filter((i) => ['gallery', 'pitch', 'before_and_after'].includes(i.section_key)).slice(0, 3)

  return (
    <>
      <section className="cream-band">
        <div className="container--wide cream-band__stack">
          {show('objective') && <NoteCard eyebrow="Project note" title="Research objective" body={d.objective_body} />}

          {show('methodology') && methods.length > 0 && (
            <div className="methods">
              <div className="methods__intro" data-reveal>
                <p className="note-card__eyebrow">Methodology</p>
                <h2 className="note-card__title">Research methodology</h2>
                <p className="note-card__body">{d.methodology_body}</p>
              </div>
              {/* Stacking cards: each one sticks and the next slides over it */}
              <div className="methods__stack">
                {methods.map((m, i) => (
                  <article
                    key={i}
                    className="method"
                    style={{ '--i': i, '--rot': `${[0, 1.5, -1, 1][i % 4]}deg`, '--bg': i % 2 ? 'var(--cream)' : 'var(--blush)' }}
                  >
                    <div>
                      <span className="method__chip">{m.label}</span>
                      <h3 className="method__title">{m.title}</h3>
                      <p className="method__body">{m.body}</p>
                      <p className="script method__count">
                        Method {i + 1} of {methods.length}
                      </p>
                    </div>
                    {evidence[i % Math.max(evidence.length, 1)] && (
                      <div className="method__img">
                        <Media src={evidence[i % evidence.length].url} alt="" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {show('evidence') && evidence.length > 0 && (
        <Showcase className="showcase--left">
          <p className="note-card__eyebrow" style={{ color: 'var(--cream)' }}>Evidence</p>
          <h2 className="tpl-heading tpl-heading--left">Interface evidence</h2>
          <div className="evidence" data-reveal>
            {evidence.map((e, i) => (
              <figure key={i} style={{ '--rot': `${[-3, 2, -1][i % 3]}deg` }}>
                <Media src={e.url} alt={e.label ?? ''} />
                {e.label && <figcaption>{e.label}</figcaption>}
              </figure>
            ))}
          </div>
        </Showcase>
      )}

      <section className="cream-band">
        <div className="container--wide cream-band__stack">
          {show('synthesis') && d.synthesis_body && <NoteCard title="Synthesis" body={d.synthesis_body} tone="burgundy" />}
          {show('findings') && (d.findings ?? []).length > 0 && (
            <div data-reveal>
              <p className="note-card__eyebrow">Key findings</p>
              <h2 className="note-card__title" style={{ marginBottom: 24 }}>What we learned</h2>
              <div className="findings">
                {d.findings.map((f, i) => (
                  <article key={i} className="finding">
                    <span className="script">{f.number ?? String(i + 1).padStart(2, '0')}</span>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
          {show('implications') && <NoteCard eyebrow="So what" title="Implications" body={d.implications_body} />}
          {show('limits') && <NoteCard eyebrow="Honest notes" title="Limits & reflection" body={d.limits_body} />}
        </div>
      </section>
    </>
  )
}
