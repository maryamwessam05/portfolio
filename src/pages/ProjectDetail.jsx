import { useParams } from 'react-router-dom'
import { KindWords, Media, PageLoading, UpNext } from '../components/Shared'
import { categoryStyle } from '../lib/theme'
import { headerCoverOf, getProject, getProjects, useData } from '../lib/data'
import NotFound from './NotFound'
import UxTemplate from './templates/UxTemplate'
import GameTemplate from './templates/GameTemplate'
import BrandingTemplate from './templates/BrandingTemplate'
import MotionTemplate from './templates/MotionTemplate'
import ResearchTemplate from './templates/ResearchTemplate'
import CodingTemplate from './templates/CodingTemplate'
import ThreeDTemplate from './templates/ThreeDTemplate'
import './templates/templates.css'

const TEMPLATES = {
  ux: ['ux_template', UxTemplate],
  game: ['game_template', GameTemplate],
  branding: ['branding_template', BrandingTemplate],
  motion: ['motion_template', MotionTemplate],
  research: ['research_template', ResearchTemplate],
  coding: ['coding_template', CodingTemplate],
  '3d': ['three_d_template', ThreeDTemplate],
}

function pickTemplate(p) {
  const order = [...new Set([...p.categories.map((c) => c.template_key), ...Object.keys(TEMPLATES)])]
  for (const key of order) {
    const [field] = TEMPLATES[key] ?? []
    if (field && p[field]) return key
  }
  return p.primaryCategory?.template_key ?? 'ux'
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const { data: project, loading } = useData(`project:${slug}`, () => getProject(slug))
  const { data: all } = useData('projects', getProjects)

  if (loading) return <PageLoading />
  if (!project) return <NotFound />

  const key = pickTemplate(project)
  const [field, Template] = TEMPLATES[key]
  const data = project[field] ?? {}
  const hidden = new Set(data.hidden_sections ?? [])
  const show = (k) => !hidden.has(k)

  const list = all ?? []
  const sameCat = list.filter((p) => p.primaryCategory?.slug === project.primaryCategory?.slug)
  const pool = sameCat.length > 1 ? sameCat : list
  const idx = pool.findIndex((p) => p.slug === project.slug)
  const next = pool.length > 1 ? pool[(idx + 1) % pool.length] : null

  return (
    <div className="page project">
      <ProjectHero project={project} />
      <Template project={project} data={data} show={show} />
      {show('testimonial') && <KindWords testimonial={project.testimonial} image={project.thumbnail_url} />}
      <UpNext project={next} />
    </div>
  )
}

function ProjectHero({ project: p }) {
  const b = p.basics
  const cover = headerCoverOf(p)
  const info = [
    ['Role', b.role],
    ['Year', b.year],
    ['Duration', b.duration],
    ['Client', b.client],
  ].filter(([, v]) => v)

  return (
    <header className="p-hero container--wide">
      <div className="p-hero__tags" data-reveal>
        {p.categories.map((c) => {
          const s = categoryStyle(c.slug)
          return (
            <span key={c.slug} className="p-tag" style={{ background: s.bg, color: s.fg }}>
              {c.name}
            </span>
          )
        })}
      </div>
      <div className="p-hero__head" data-reveal style={{ '--delay': '0.05s' }}>
        <div>
          <h1 className="p-hero__title">{p.title}</h1>
          {b.tagline && <p className="p-hero__tagline">{b.tagline}</p>}
        </div>
        <div className="p-hero__links">
          {b.is_live && b.live_url && (
            <a href={b.live_url} target="_blank" rel="noreferrer" className="p-live">
              Live <span aria-hidden="true">↗</span>
            </a>
          )}
          {b.repo_url && (
            <a href={b.repo_url} target="_blank" rel="noreferrer" className="p-live p-live--ghost">
              Code <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
      <div className="p-hero__cover" data-reveal style={{ '--delay': '0.1s' }}>
        <Media src={cover} fallback={p.thumbnail_url} alt={`${p.title} cover`} video={b.cover_type === 'video'} controls={b.cover_type === 'video' ? true : undefined} />
      </div>
      <dl className="p-hero__info" data-reveal>
        {info.map(([k, v]) => (
          <div key={k}>
            <dt className="script">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
        {p.tools?.length > 0 && (
          <div>
            <dt className="script">Tools</dt>
            <dd className="p-hero__tools">
              {p.tools.map((t) => (
                <span key={t.name}>{t.name}</span>
              ))}
            </dd>
          </div>
        )}
      </dl>
      {b.description && (
        <p className="p-hero__desc" data-reveal>
          {b.description}
        </p>
      )}
    </header>
  )
}
