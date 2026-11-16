import { Link, useParams } from 'react-router-dom'
import { Media, PageLoading } from '../components/Shared'
import { formatDate, getPost, getPosts, readMinutes, useData } from '../lib/data'
import { PostCard } from './Journal'
import NotFound from './NotFound'
import './Journal.css'

export default function JournalPost() {
  const { slug } = useParams()
  const { data: post, loading } = useData(`post:${slug}`, () => getPost(slug))
  const { data: posts } = useData('posts', getPosts)

  if (loading) return <PageLoading light />
  if (!post) return <NotFound />

  const paragraphs = (post.body ?? '').split(/\n{2,}|\n/).filter(Boolean)
  const others = (posts ?? []).filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <article className="page page--cream post">
      <div className="post__wrap">
        <Link to="/journal" className="post__back">
          ← Back to the journal
        </Link>
        <header className="post__head" data-reveal>
          <p className="post__meta">
            {formatDate(post.published_at)} · {readMinutes(post.body)} min read
          </p>
          <h1 className="post__title">{post.title}</h1>
          {post.excerpt && <p className="post__excerpt">{post.excerpt}</p>}
          <div className="post__author">
            <span className="post__avatar script">mw</span>
            <div>
              <p>Words & experiments by Maryam Wessam</p>
              <p className="script">from my desk to yours</p>
            </div>
          </div>
        </header>
        {post.cover_url && (
          <div className="post__cover" data-reveal>
            <Media src={post.cover_url} alt="" />
          </div>
        )}
        <div className="post__body">
          {paragraphs.map((para, i) =>
            /^>\s?/.test(para) ? (
              <blockquote key={i} className="post__quote script">
                {para.replace(/^>\s?/, '')}
              </blockquote>
            ) : (
              <p key={i}>{para}</p>
            ),
          )}
          <p className="post__sign script">Thanks for reading, Maryam.</p>
        </div>

        {others.length > 0 && (
          <section className="post__more">
            <div className="post__more-head">
              <div>
                <p>Stay a little longer</p>
                <h2>Another open page.</h2>
              </div>
              <Link to="/journal">All journal entries ↗</Link>
            </div>
            <div className="post__more-grid">
              {others.map((p, i) => (
                <PostCard key={p.id} post={p} i={i + 1} big />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
