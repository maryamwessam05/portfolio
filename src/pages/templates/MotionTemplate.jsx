import { Media } from '../../components/Shared'
import { Gallery } from './parts'

export default function MotionTemplate({ project: p, data: d, show }) {
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
              {d.concept_image && (
                <div className="concept__imgs concept__imgs--one">
                  <Media src={d.concept_image} alt="Concept frame" />
                </div>
              )}
            </article>
          )}
        </div>
      </section>
      {show('frames') && <Gallery title="Frames" images={[...p.imagesBy('gallery'), ...p.imagesBy('concept')]} />}
    </>
  )
}
