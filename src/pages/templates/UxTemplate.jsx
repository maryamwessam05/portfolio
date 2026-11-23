import { Media } from '../../components/Shared'
import { DesignSystem, JourneySteps, Personas, PinnedCards, Process, ScreensRow, Step, Walkthrough } from './parts'

const STEPS = [
  { id: 'context', label: 'The Context' },
  { id: 'problem', label: 'The Problem' },
  { id: 'behavior', label: 'User Behavior' },
  { id: 'journey', label: 'User Journey' },
]

export function UxProcess({ data: d, show }) {
  const steps = STEPS.filter((s) => show(s.id))
  return (
    <Process steps={steps}>
      {show('context') && (
        <Step id="context" className="step--context">
          <div className="step__split">
            <h3 className="step__lead">{d.context_headline}</h3>
            <p className="step__body detail">{d.context_body}</p>
          </div>
          <PinnedCards items={d.context_cards} />
        </Step>
      )}
      {show('problem') && (
        <Step id="problem" className="step--problem">
          <div className="problem">
            <div className="problem__img">
              <Media src={d.problem_image} alt="" />
            </div>
            <div>
              <h3 className="step__h">{d.problem_headline}</h3>
              <div className="problem__cards">
                {(d.problem_cards ?? []).map((c, i) => (
                  <article key={i} className="tilt-card" style={{ '--rot': `${i % 2 ? 2 : -2}deg` }}>
                    <h4>{c.title}</h4>
                    <p className="detail">{c.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Step>
      )}
      {show('behavior') && (
        <Step id="behavior">
          <h3 className="step__h step__h--xl">{d.behavior_headline}</h3>
          <p className="step__sub detail">{d.behavior_body}</p>
          <Personas items={d.behavior_personas} />
          {d.behavior_takeaway && (
            <p className="takeaway">
              <b>Research Takeaway:</b> {d.behavior_takeaway}
            </p>
          )}
        </Step>
      )}
      {show('journey') && (
        <Step id="journey">
          <h3 className="step__h step__h--xl">{d.journey_headline}</h3>
          <p className="step__sub detail">{d.journey_body}</p>
          <JourneySteps items={d.journey_steps} />
        </Step>
      )}
    </Process>
  )
}

export default function UxTemplate({ project: p, data: d, show }) {
  const web = [...p.imagesBy('final_web_screens'), ...p.imagesBy('website')]
  return (
    <>
      <UxProcess data={d} show={show} />
      {show('design') && (
        <DesignSystem
          palette={d.design_palette}
          fonts={d.design_fonts}
          extras={[
            { label: 'Components', src: d.components_image },
            { label: 'Spacing scale', src: d.spacing_image },
            ...p.imagesBy('ui').map((i) => ({ label: i.label || 'UI', src: i.url })),
          ]}
        />
      )}
      {show('screens') && <ScreensRow title="Final App Screens" images={[...p.imagesBy('screens'), ...p.imagesBy('mockups')]} />}
      {show('web') && <ScreensRow title="Final Web Screens" images={web} variant="web" />}
      {show('walkthrough') && <Walkthrough src={d.walkthrough_video} variant={d.walkthrough_variant} extra={p.imagesBy('walkthrough')} />}
    </>
  )
}
