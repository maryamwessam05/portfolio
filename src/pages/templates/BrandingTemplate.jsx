import { useState } from 'react'
import { Media } from '../../components/Shared'
import { Gallery, Showcase } from './parts'

export default function BrandingTemplate({ project: p, data: d, show }) {
  const world = p.imagesBy('out_in_the_world')
  const [shot, setShot] = useState(0)
  const concepts = [...p.imagesBy('concept'), ...p.imagesBy('visual_style')]

  return (
    <>
      <section className="cream-band">
        <div className="container--wide cream-band__stack">
          {show('brief') && d.brief_body && (
            <article className="brief" data-reveal>
              <h2 className="brief__title">Brief & audience</h2>
              <div className="brief__cols">
                <p>{d.brief_body}</p>
                {d.brief_note && <p>{d.brief_note}</p>}
              </div>
            </article>
          )}
          {show('concept') && d.concept_body && (
            <article className="concept" data-reveal>
              <div>
                <h2 className="concept__title">Concept</h2>
                <p>{d.concept_body}</p>
              </div>
              {concepts.length > 0 && (
                <div className="concept__imgs">
                  {concepts.slice(0, 3).map((img) => (
                    <Media key={img.id} src={img.url} alt={img.label ?? ''} />
                  ))}
                </div>
              )}
            </article>
          )}
        </div>
      </section>

      {show('logo_experiments') && <Gallery title="Logo experiments · happy accidents" images={p.imagesBy('logo_experiments')} />}

      {show('logo') && (
        <QuadGrid
          title="Logo system"
          items={[
            ['Primary mark', d.logo_primary_mark],
            ['Logo variations', d.logo_variations],
            ['Colour variations', d.logo_color_variations],
            ['Clear space', d.logo_clear_space],
          ]}
        />
      )}

      {show('palette') && (d.palette?.length > 0 || d.fonts?.length > 0) && (
        <Showcase title="Colour & type">
          <div className="dots" data-reveal>
            {(d.palette ?? []).map((c, i) => (
              <span key={i} className="dots__dot" style={{ background: c.hex, color: isLight(c.hex) ? '#595959' : '#fff', '--i': i }}>
                {c.hex}
              </span>
            ))}
          </div>
          <div className="type-pair" data-reveal>
            {(d.fonts ?? []).map((f, i) => (
              <div key={f.name}>
                <p className="type-pair__label">{i === 0 ? 'Primary font' : 'Secondary font'}</p>
                <p className="type-pair__name" style={{ fontFamily: `'${f.name}', var(--serif)` }}>{f.name}</p>
                <p className="type-pair__usage">{f.usage}</p>
              </div>
            ))}
          </div>
        </Showcase>
      )}

      {show('out_in_the_world') && world.length > 0 && (
        <Showcase title="Out in the world">
          <div className="world" data-reveal>
            <div className="world__main">
              <Media src={world[shot]?.url} alt={world[shot]?.label ?? ''} key={world[shot]?.url} />
            </div>
            <div className="world__thumbs" role="tablist">
              {world.slice(0, 8).map((img, i) => (
                <button key={img.id} role="tab" aria-selected={shot === i} className={shot === i ? 'is-on' : ''} onClick={() => setShot(i)}>
                  <Media src={img.url} alt="" />
                  <span>{img.label || `View ${i + 1}`}</span>
                </button>
              ))}
            </div>
          </div>
        </Showcase>
      )}

      {show('made_to_live') && <Gallery title="Made to live in the real world" images={[...p.imagesBy('made_to_live'), ...p.imagesBy('gallery')]} />}

      {show('patterns') && (
        <QuadGrid
          title="Patterns & assets"
          items={[
            ['Pattern 1', d.pattern_1],
            ['Pattern 2', d.pattern_2],
            ['Mascot', d.mascot],
            ['Illustrations', d.illustrations],
          ]}
        />
      )}
    </>
  )
}

function QuadGrid({ title, items }) {
  const shown = items.filter(([, src]) => src)
  if (!shown.length) return null
  return (
    <Showcase title={title}>
      <div className="quad" data-reveal>
        {shown.map(([label, src]) => (
          <figure key={label} className="quad__item">
            <div className="quad__img">
              <Media src={src} alt={label} />
            </div>
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
    </Showcase>
  )
}

function isLight(hex = '#000') {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return r * 0.299 + g * 0.587 + b * 0.114 > 200
}
