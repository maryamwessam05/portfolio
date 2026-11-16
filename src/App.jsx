import { lazy, Suspense, useCallback, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Preloader from './components/Preloader'
import { PageLoading } from './components/Shared'
import { safeSession } from './lib/hooks'
import { IntroContext } from './lib/intro'
import Home from './pages/Home'

const Works = lazy(() => import('./pages/Works'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Services = lazy(() => import('./pages/Services'))
const About = lazy(() => import('./pages/About'))
const Journal = lazy(() => import('./pages/Journal'))
const JournalPost = lazy(() => import('./pages/JournalPost'))
const Contact = lazy(() => import('./pages/Contact'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const Sitemap = lazy(() => import('./pages/Sitemap'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  // The sticker preloader plays once per browser session.
  const [loading, setLoading] = useState(() => !safeSession.get('mw-preloaded'))
  const done = useCallback(() => {
    safeSession.set('mw-preloaded', '1')
    setLoading(false)
  }, [])

  return (
    <IntroContext.Provider value={!loading}>
      <BrowserRouter>
        {loading && <Preloader onDone={done} />}
        <Suspense fallback={<PageLoading />}>
          <Routes>
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
          </Routes>
        </Suspense>
      </BrowserRouter>
    </IntroContext.Provider>
  )
}
