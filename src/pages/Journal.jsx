import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Media, PageLoading } from '../components/Shared'
import { formatDate, getPosts, readMinutes, useData } from '../lib/data'
import './Journal.css'

const CARD_COLORS = ['var(--sky)', 'var(--blush)', 'var(--butter)', 'var(--cream)', 'var(--olive)']
const ROTS = [4, -3, 7, -4, 3]

export function PostCard({ post, i, big }) {
  return (
    <Link
      to={`/journal/${post.slug}`}
      className={`post-card ${big ? 'post-card--big' : ''}`}
      style={{ '--bg': CARD_COLORS[i % CARD_COLORS.length], '--rot': `${ROTS[i % ROTS.length]}deg`, '--ink': i % 5 === 4 ? 'var(--cream)' : 'var(--cocoa)' }}
    >
      <span className="post-card__tape" aria-hidden="true" />
      <div className="post-card__img">
        <Media src={post.cover_url} alt="" />
      </div>
      <h2 className="post-card__title">{post.title}</h2>
      <p className="post-card__excerpt">{post.excerpt}</p>
      <div className="post-card__meta">
        <span>
          {formatDate(post.published_at)} / {readMinutes(post.body)} min read
        </span>
        <span aria-hidden="true">↗</span>
      </div>
    </Link>
  )
}

export default function Journal() {
  const { data: posts } = useData('posts', getPosts)

  return (
    <div className="page journal page--cream">
      <header className="j-head container">
        <h1 className="j-head__title" data-reveal>
          MY JOURNAL
        </h1>
        <div className="j-head__row" data-reveal>
          <p>
            Things I’m making, things I’m learning,
            <br /> and things I haven’t quite figured out yet.
          </p>
          <p className="script">an open notebook, not a manual.</p>
        </div>
      </header>

      <section className="j-board container--wide" aria-label="Journal entries">
        <span className="j-board__tab script">Everything</span>
        {!posts ? (
          <PageLoading />
        ) : (
          <div className="j-board__grid">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} i={i} />
            ))}
          </div>
        )}
      </section>

      <Suggest />
    </div>
  )
}

/** "What's on your mind?" — topic suggestions (kept on this device until a suggestions table exists). */
function Suggest() {
  const [topic, setTopic] = useState('')
  const [name, setName] = useState('')
  const [pinned, setPinned] = useState(false)
  return (
    <section className="suggest container--wide">
      <div className="suggest__intro" data-reveal>
        <p className="script">your turn</p>
        <h2>What’s on your mind?</h2>
        <p>A question, a curiosity, a rabbit hole worth exploring. Leave a topic for a future post.</p>
      </div>
      <form
        className="suggest__form"
        data-reveal
        onSubmit={(e) => {
          e.preventDefault()
          if (!topic.trim()) return
          setPinned(true)
          setTopic('')
          setName('')
        }}
      >
        <label htmlFor="s-topic">I’d love to read about…</label>
        <textarea id="s-topic" value={topic} placeholder="The thing you keep wondering about…" onChange={(e) => setTopic(e.target.value.slice(0, 80))} />
        <span className="suggest__count">{topic.length}/80</span>
        <div className="suggest__row">
          <label>
            Your name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Anonymous (or a name)" />
          </label>
          <button>
            Pin a suggestion <span aria-hidden="true">↗</span>
          </button>
        </div>
        {pinned && <p className="suggest__done" role="status">Pinned to my board, thank you!</p>}
      </form>
    </section>
  )
}
