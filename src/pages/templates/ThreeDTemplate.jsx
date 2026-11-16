import { useState } from 'react'
import { Media } from '../../components/Shared'
import { NoteCard, Showcase } from './parts'

export default function ThreeDTemplate({ project: p, data: d, show }) {
  const views = [
    ['Front', d.front_image],
    ['Side', d.side_image],
    ['Top', d.top_image],
    ['Wireframe', d.wireframe_image],
    ['Material view', d.material_image],
    ...p.imagesBy('model').map((m) => [m.label || 'Model', m.url]),
  ].filter(([, src]) => src)
  const [view, setView] = useState(0)

  return (
    <>
      {show('concept') && (
        <section className="cream-band">
          <div className="container--wide">
            <NoteCard title="Concept" body={d.concept_body} />
          </div>
        </section>
      )}
      {show('turntable') && views.length > 0 && (
        <Showcase title="Modeling · turntable">
          <div className="turntable" data-reveal>
            <div className="turntable__stage">
              <Media key={views[view][1]} src={views[view][1]} alt={`${views[view][0]} view`} />
            </div>
            <div className="turntable__tabs" role="tablist">
              {views.map(([label], i) => (
                <button key={label + i} role="tab" aria-selected={view === i} className={view === i ? 'is-on' : ''} onClick={() => setView(i)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Showcase>
      )}
    </>
  )
}
