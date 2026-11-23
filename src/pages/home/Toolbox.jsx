import { useRef, useState } from 'react'
import { useDraggable } from '../../lib/hooks'

const TOOLS = [
  { id: 'illustrator', x: 64, y: 25, w: 252, tags: ['design'] },
  { id: 'blender', x: 331, y: 76, w: 237, tags: ['design'] },
  { id: 'premiere', x: 624, y: 33, w: 246, tags: ['design'] },
  { id: 'figma', x: 863, y: 65, w: 192, tags: ['design', 'research'] },
  { id: 'after-effects', x: 34, y: 194, w: 277, tags: ['design'] },
  { id: 'photoshop', x: 328, y: 204, w: 255, tags: ['design'] },
  { id: 'supabase', x: 604, y: 167, w: 249, tags: ['back-end'] },
  { id: 'affinity', x: 825, y: 196, w: 215, tags: ['design'] },
  { id: 'react', x: 56, y: 334, w: 186, tags: ['front-end'] },
  { id: 'claude', x: 280, y: 301, w: 225, tags: ['research', 'front-end', 'back-end'] },
  { id: 'javascript', x: 520, y: 337, w: 248, tags: ['front-end'] },
  { id: 'html-css', x: 801, y: 318, w: 286, tags: ['front-end'] },
]
const FILTERS = [
  ['all', 'All'],
  ['design', 'Design'],
  ['research', 'Research'],
  ['front-end', 'Front-end'],
  ['back-end', 'Back-end'],
]

export default function Toolbox() {
  const [filter, setFilter] = useState('all')
  const board = useRef(null)
  useDraggable(board)

  return (
    <section className="toolbox stripes">
      <h2 className="title-stack" data-reveal>
        <span className="title-stack__script" style={{ color: 'var(--red)' }}>
          my
        </span>
        <span className="title-stack__main" style={{ color: 'var(--cocoa)' }}>
          Toolbox
        </span>
      </h2>
      <div className="toolbox__filters" role="group" aria-label="Filter tools">
        {FILTERS.map(([key, label]) => (
          <button key={key} className={`chip ${filter === key ? 'is-active' : ''}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="toolbox__board" ref={board} data-reveal>
        {TOOLS.map((t, i) => {
          const on = filter === 'all' || t.tags.includes(filter)
          return (
            <img
              key={t.id}
              data-drag
              src={`/assets/tools/${t.id}.png`}
              alt={t.id.replace('-', ' ')}
              draggable="false"
              className={`tool ${on ? '' : 'is-dim'}`}
              style={{ left: `${(t.x / 1100) * 100}%`, top: `${(t.y / 488) * 100}%`, width: `${(t.w / 1100) * 100}%`, '--i': i }}
            />
          )
        })}
      </div>
      <p className="toolbox__hint script">drag them around</p>
    </section>
  )
}
