import { Link, useSearchParams } from 'react-router-dom'
import { Media, PageLoading } from '../components/Shared'
import { coverOf, getCategories, getProjects, useData } from '../lib/data'
import './Works.css'

export default function Works() {
  const { data: projects } = useData('projects', getProjects)
  const { data: categories } = useData('categories', getCategories)
  const [params, setParams] = useSearchParams()
  const active = params.get('category') ?? 'all'

  if (!projects) return <PageLoading />

  const used = (categories ?? []).filter((c) => projects.some((p) => p.categories.some((pc) => pc.slug === c.slug)))
  const list = active === 'all' ? projects : projects.filter((p) => p.categories.some((c) => c.slug === active))

  return (
    <div className="page works">
      <h1 className="visually-hidden">All work</h1>
      <div className="works__filters container--wide" role="tablist" aria-label="Filter by category">
        <span className="works__tape works__tape--l" aria-hidden="true" />
        <span className="works__tape works__tape--r" aria-hidden="true" />
        {[{ slug: 'all', name: 'All' }, ...used].map((c) => (
          <button
            key={c.slug}
            role="tab"
            aria-selected={active === c.slug}
            className={`works__filter ${active === c.slug ? 'is-active' : ''}`}
            onClick={() => setParams(c.slug === 'all' ? {} : { category: c.slug })}
          >
            {active === c.slug && <span className="hand-outline" aria-hidden="true" />}
            {c.name}
          </button>
        ))}
      </div>

      <div className="works__grid container--wide" key={active}>
        {list.map((p, i) => (
          <Link key={p.id} to={`/work/${p.slug}`} className="work-card" style={{ '--i': i % 12 }}>
            <div className="work-card__img">
              <Media src={coverOf(p)} alt="" />
            </div>
            <div className="work-card__meta">
              <h2 className="work-card__title">{p.title}</h2>
              <span className="work-card__cat">{p.primaryCategory?.name}</span>
            </div>
          </Link>
        ))}
        {!list.length && <p className="works__empty">Nothing in this folder yet. Check back soon.</p>}
      </div>
    </div>
  )
}
