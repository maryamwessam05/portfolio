import { Link } from 'react-router-dom'
import { getCategories, getPosts, getProjects, useData } from '../lib/data'
import './Misc.css'

export default function Sitemap() {
  const { data: categories } = useData('categories', getCategories)
  const { data: projects } = useData('projects', getProjects)
  const { data: posts } = useData('posts', getPosts)
  const firstCase = projects?.[0]
  const firstPost = posts?.[0]

  const cols = [
    [
      {
        title: 'Work',
        dot: 'var(--olive)',
        links: [
          ['All projects', '/works'],
          ['Category views', '/works'],
          ...(categories ?? []).map((c) => [c.name, `/works?category=${c.slug}`, true]),
          ['Case study pages', firstCase ? `/work/${firstCase.slug}` : '/works'],
        ],
      },
    ],
    [
      { title: 'Home', dot: 'var(--red)', to: '/', links: [] },
      { title: 'About', dot: 'var(--sky)', to: '/about', links: [['Resume / CV', '/about']] },
      { title: 'Services', dot: 'var(--yellow)', to: '/services', links: [['Start a project', '/contact']] },
    ],
    [
      { title: 'Journal', dot: 'var(--lilac)', to: '/journal', links: [['All posts', '/journal'], ['Article pages', firstPost ? `/journal/${firstPost.slug}` : '/journal']] },
      { title: 'Contact', dot: 'var(--mandarine)', to: '/contact', links: [['Thank-you state', '/thank-you']] },
      { title: 'Other', dot: 'var(--blush)', links: [['404 page', '/this-page-does-not-exist']] },
    ],
  ]

  return (
    <div className="page sitemap">
      <h1 className="sitemap__title">Sitemap</h1>
      <p className="sitemap__crumb">
        <Link to="/">Home</Link> › Sitemap
      </p>
      <div className="sitemap__cols">
        {cols.map((col, i) => (
          <div key={i} className="sitemap__col">
            {col.map((s) => (
              <section key={s.title} data-reveal>
                <h2 className="sitemap__h">
                  <i style={{ background: s.dot }} />
                  {s.to ? <Link to={s.to}>{s.title}</Link> : s.title}
                </h2>
                <ul>
                  {s.links.map(([label, to, sub]) => (
                    <li key={label} className={sub ? 'is-sub' : ''}>
                      <Link to={to}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
