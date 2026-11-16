import Pill from '../components/Pill'
import { coverOf, getProjects, useData } from '../lib/data'
import './Misc.css'

// Tile positions copied from the Figma "404" frame (each tile 71 × 49).
const DIGITS = [
  { x: 0, y: 10, t: '129,49;101,98;77,147;41,196;0,245;71,245;141,245;282,246;212,245;212,49;212,98;212,147;212,196;212,294;212,343;176,0' },
  { x: 373, y: 0, t: '71,29;141,29;0,78;13,42;177,50;212,78;0,127;106,353;212,127;0,176;212,176;191,302;105,0;0,225;22,306;212,225;0,274;212,274;71,323;141,323' },
  { x: 676, y: 10, t: '129,49;101,98;77,147;41,196;0,245;71,245;141,245;212,245;212,49;212,98;212,147;212,196;212,294;212,343;282,246;212,0' },
]
const W = 1029
const H = 402

export default function NotFound() {
  const { data } = useData('projects', getProjects)
  const covers = (data ?? []).map(coverOf).filter((u) => u && !u.endsWith('/'))
  let n = 0

  return (
    <div className="page lost">
      <div className="lost__frame">
        <img className="lost__wave" src="/assets/frame-404.png" alt="" aria-hidden="true" />
        <div className="lost__inner">
          <h1 className="lost__title">Hi, this is maryam, and I have no idea where this page went.</h1>
          <p className="lost__sub">While you’re here, take a look at some of my work.</p>
          <div className="lost__tiles" role="img" aria-label="404 made of project images">
            {DIGITS.flatMap((d) =>
              d.t.split(';').map((pair) => {
                const [x, y] = pair.split(',').map(Number)
                const src = covers.length ? covers[n++ % covers.length] : null
                return (
                  <span
                    key={`${d.x}-${pair}`}
                    className="lost__tile"
                    style={{ left: `${((d.x + x) / W) * 100}%`, top: `${((d.y + y) / H) * 100}%`, '--d': `${(n % 20) * 0.04}s` }}
                  >
                    {src && <img src={src} alt="" loading="lazy" />}
                  </span>
                )
              }),
            )}
          </div>
          <Pill to="/">Take me home</Pill>
        </div>
      </div>
    </div>
  )
}
