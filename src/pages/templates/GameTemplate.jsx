import { Media } from '../../components/Shared'
import { DesignSystem, Process, ScreensRow, Step, Walkthrough } from './parts'
import { UxProcess } from './UxTemplate'

const STEPS_2 = [
  { id: 'testing', label: 'Testing & changes' },
  { id: 'outcome', label: 'Outcome & reflection' },
  { id: 'game-context', label: 'Game context' },
  { id: 'hud', label: 'HUD & menus' },
]

export default function GameTemplate({ project: p, data: d, show }) {
  return (
    <>
      <UxProcess data={d} show={show} />
      {show('design') && (
        <DesignSystem
          palette={d.design_palette}
          fonts={d.design_fonts}
          extras={[
            { label: 'Iconography', src: d.iconography_image },
            { label: 'Character set', src: d.character_set_image },
            ...p.imagesBy('characters').map((i) => ({ label: i.label || 'Characters', src: i.url })),
          ]}
        />
      )}
      {show('screens') && <ScreensRow title="Final App Screens" images={p.imagesBy('screens')} variant="web" />}
      {show('walkthrough') && <Walkthrough src={d.walkthrough_video} variant="website" extra={p.imagesBy('walkthrough')} />}

      <Process steps={STEPS_2.filter((s) => show(s.id))} toggle={false}>
        {show('testing') && (
          <Step id="testing">
            <h3 className="step__h">Testing & changes</h3>
            <p className="step__sub">{d.testing_body}</p>
            <div className="duo">
              {(d.testing_cards ?? []).map((c, i) => (
                <figure key={i} className="duo__item">
                  <Media src={c.image} alt={c.label} />
                  <figcaption>{c.label}</figcaption>
                </figure>
              ))}
            </div>
          </Step>
        )}
        {show('outcome') && d.outcome_body && (
          <Step id="outcome">
            <h3 className="step__h">Outcome & reflection</h3>
            <p className="step__sub">{d.outcome_body}</p>
          </Step>
        )}
        {show('game-context') && (
          <Step id="game-context">
            <h3 className="step__h">Game context</h3>
            <p className="step__sub">{d.game_context_body}</p>
            <div className="devices">
              {d.game_context_tablet_image && <Media className="devices__tablet" src={d.game_context_tablet_image} alt="Game on a tablet" />}
              {d.game_context_phone_image && <Media className="devices__phone" src={d.game_context_phone_image} alt="Game on a phone" />}
            </div>
          </Step>
        )}
        {show('hud') && (
          <Step id="hud">
            <h3 className="step__h">HUD & menus</h3>
            <p className="step__sub">{d.hud_body}</p>
            <div className="duo">
              {d.hud_image && <Media src={d.hud_image} alt="HUD" />}
              {d.menu_breakdown_image && <Media src={d.menu_breakdown_image} alt="Menu breakdown" />}
            </div>
          </Step>
        )}
      </Process>
    </>
  )
}
