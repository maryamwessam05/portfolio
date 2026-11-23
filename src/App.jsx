import { lazy, useCallback, useState } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import ScribbleRoutes from './components/ScribbleTransition'
import Layout from './components/Layout'
import Preloader from './components/Preloader'
import { PageLoading } from './components/Shared'
import { safeSession } from './lib/hooks'
import { IntroContext } from './lib/intro'
import Home from './pages/Home'

const pages = {
  works: () => import('./pages/Works'),
  project: () => import('./pages/ProjectDetail'),
  services: () => import('./pages/Services'),
  about: () => import('./pages/About'),
  journal: () => import('./pages/Journal'),
  post: () => import('./pages/JournalPost'),
  contact: () => import('./pages/Contact'),
  thanks: () => import('./pages/ThankYou'),
  sitemap: () => import('./pages/Sitemap'),
  notFound: () => import('./pages/NotFound'),
}
if (typeof window !== 'undefined') {
  const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 2000))
  idle(() => Object.values(pages).forEach((load) => load()))
}

const Works = lazy(pages.works)
const ProjectDetail = lazy(pages.project)
const Services = lazy(pages.services)
const About = lazy(pages.about)
const Journal = lazy(pages.journal)
const JournalPost = lazy(pages.post)
const Contact = lazy(pages.contact)
const ThankYou = lazy(pages.thanks)
const Sitemap = lazy(pages.sitemap)
const NotFound = lazy(pages.notFound)

export default function App() {
  const [loading, setLoading] = useState(() => !safeSession.get('mw-preloaded'))
  const done = useCallback(() => {
    safeSession.set('mw-preloaded', '1')
    setLoading(false)
  }, [])

  return (
    <IntroContext.Provider value={!loading}>
      <BrowserRouter>
        {loading && <Preloader onDone={done} />}
          <ScribbleRoutes fallback={<PageLoading />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="works" element={<Works />} />
              <Route path="work/:slug" element={<ProjectDetail />} />
              <Route path="services" element={<Services />} />
              <Route path="about" element={<About />} />
              <Route path="journal" element={<Journal />} />
              <Route path="journal/:slug" element={<JournalPost />} />
              <Route path="contact" element={<Contact />} />
              <Route path="thank-you" element={<ThankYou />} />
              <Route path="sitemap" element={<Sitemap />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </ScribbleRoutes>
      </BrowserRouter>
    </IntroContext.Provider>
  )
}
