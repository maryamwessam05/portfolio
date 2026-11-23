import { useState } from 'react'
import { Link } from 'react-router-dom'
import TitleStack from '../../components/TitleStack'
import { Media, Sticker } from '../../components/Shared'
import { categoryStyle } from '../../lib/theme'
import { coverOf } from '../../lib/data'

const LAYOUT = {
  branding: { tab: 13, rot: 0 },
  'ux-ui-design': { tab: 40, rot: 1 },
  'motion-graphics': { tab: 62, rot: -0.8 },
  'contextual-research': { tab: 16, rot: 1 },
  'game-ux-ui': { tab: 64, rot: -0.8 },
  'coding-development': { tab: 20, rot: 0.8 },
  'interactive-3d-design': { tab: 70, rot: 0 },
  'xr-interaction-design': { tab: 28, rot: 0.8 },
  'graphic-design': { tab: 64, rot: 0 },
}
const FOLDER_STICKERS = { 'game-ux-ui': 'disco', 'coding-development': 'cups', 'xr-interaction-design': 'folder', 'graphic-design': 'cups' }

export default function Folders({ categories, projects }) {
  const [open, setOpen] = useState(null)
  const ordered = categories.filter((c) => c.slug !== 'xr-interaction-design').sort((a, b) => hasWork(a) - hasWork(b))
  function hasWork(c) {
    return projects.some((p) => p.categories.some((pc) => pc.slug === c.slug)) ? 1 : 0
  }
  const last = ordered.length - 1

  return (
    <section className="serve section">
      <TitleStack script="what i" main="Serve" />
      <div className="folders" onMouseLeave={() => setOpen(null)}>
        {ordered.map((c, i) => {
          const { bg, fg } = categoryStyle(c.slug)
          const lay = LAYOUT[c.slug] ?? { tab: 10 + ((i * 23) % 60), rot: 0 }
          const work = projects.filter((p) => p.categories.some((pc) => pc.slug === c.slug)).slice(0, 8)
          const isOpen = open === c.slug || (open === null && i === last)
          return (
            <div
              key={c.slug}
              className={`folder ${isOpen ? 'is-open' : ''}`}
              style={{ '--bg': bg, '--fg': fg, '--tab': `${lay.tab}%`, '--rot': `${lay.rot}deg`, zIndex: i + 1 }}
              onMouseEnter={() => setOpen(c.slug)}
              onFocus={() => setOpen(c.slug)}
            >
              <button
                className="folder__tab"
                onClick={() => setOpen(isOpen && i !== last ? null : c.slug)}
                aria-expanded={isOpen}
              >
                {c.name}
              </button>
              <div className="folder__body">
                <div className="folder__strip">
                  {work.length ? (
                    work.map((p) => (
                      <Link key={p.id} to={`/work/${p.slug}`} className="folder__thumb" tabIndex={isOpen ? 0 : -1}>
                        <Media src={coverOf(p)} alt={p.title} />
                        <span>{p.title}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="folder__empty">New work for this folder is on the way.</p>
                  )}
                </div>
                <Link to={`/works?category=${c.slug}`} className="folder__all" tabIndex={isOpen ? 0 : -1}>
                  see all {c.name.toLowerCase()} →
                </Link>
                {FOLDER_STICKERS[c.slug] && <Sticker name={FOLDER_STICKERS[c.slug]} className="folder__sticker" />}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
