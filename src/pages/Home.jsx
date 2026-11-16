import { ClosingCta, PageLoading } from '../components/Shared'
import { coverOf, getCategories, getContent, getProjects, getSettings, getTestimonials, useData } from '../lib/data'
import Hero from './home/Hero'
import { Desk, SelectedWork } from './home/SelectedWork'
import Folders from './home/Folders'
import Toolbox from './home/Toolbox'
import { AboutTeaser, Guestbook, Testimonials } from './home/People'
import GradPopup from './home/GradPopup'
import './home/Home.css'

export default function Home() {
  const { data: projects } = useData('projects', getProjects)
  const { data: categories } = useData('categories', getCategories)
  const { data: content } = useData('content', getContent)
  const { data: settings } = useData('settings', getSettings)
  const { data: testimonials } = useData('testimonials', getTestimonials)

  if (!projects) return <PageLoading />

  const withCover = projects.filter((p) => coverOf(p) && !/\/$/.test(coverOf(p)))
  const featured = withCover.filter((p) => p.is_featured)
  const selected = (featured.length >= 3 ? featured : withCover).slice(0, 5)
  const desk = withCover.filter((p) => !selected.includes(p)).slice(0, 10)

  return (
    <div className="page home">
      <Hero projects={withCover} settings={settings} />
      <SelectedWork projects={selected} />
      <Desk projects={desk} />
      {categories && <Folders categories={categories} projects={withCover} />}
      <Toolbox />
      <Testimonials items={testimonials} />
      <AboutTeaser intro={content?.home_intro} />
      <ClosingCta />
      <Guestbook />
      <GradPopup fallbackImage={coverOf(selected[0])} />
    </div>
  )
}
