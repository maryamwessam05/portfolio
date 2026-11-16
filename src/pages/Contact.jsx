import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Faq } from '../components/Shared'
import { getCategories, getContent, getSettings, sendContactMessage, useData } from '../lib/data'
import { useCairoTime } from '../lib/hooks'
import './Contact.css'

const TIMELINES = ['ASAP', '1 to 2 weeks', 'About a month', 'Flexible']
const BUDGETS = ['Under $500', '$500 – $1,500', '$1,500 – $3,000', '$3,000+', 'Not sure yet']

export default function Contact() {
  const { data: settings } = useData('settings', getSettings)
  const { data: categories } = useData('categories', getCategories)
  const { data: content } = useData('content', getContent)
  const time = useCairoTime()
  const navigate = useNavigate()

  const [lane, setLane] = useState('project')
  const [form, setForm] = useState({ category: '', name: '', email: '', whatsapp: '', timeline: '', budget: '', idea: '', link: '' })
  const [status, setStatus] = useState('idle')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: typeof e === 'string' ? e : e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || (!form.email.trim() && !form.whatsapp.trim())) {
      setStatus('missing')
      return
    }
    setStatus('sending')
    const lines = [
      `Lane: ${lane === 'project' ? 'I have a project' : "I'm hiring"}`,
      form.category && `Category: ${form.category}`,
      form.timeline && `Timeline: ${form.timeline}`,
      form.budget && `Budget: ${form.budget}`,
      form.whatsapp && `WhatsApp: ${form.whatsapp}`,
      form.link && `Reference: ${form.link}`,
      '',
      form.idea,
    ].filter((l) => l !== false && l !== undefined && l !== '')
    try {
      await sendContactMessage({ name: form.name.trim(), email: form.email.trim() || `${form.whatsapp.trim()}@whatsapp`, message: lines.join('\n') })
      navigate('/thank-you')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="page contact">
      <div className="c-bar">
        <span>
          <span aria-hidden="true">⌖</span> Cairo, Egypt <span className="c-bar__sep">/</span> <time>{time}</time>
        </span>
        {settings?.available_for_freelance !== false && (
          <span className="c-bar__badge">
            <i aria-hidden="true" /> Available for freelance
          </span>
        )}
        <span>I usually reply {settings?.reply_time ? settings.reply_time.toLowerCase() : 'within 24 hours'}</span>
      </div>

      <section className="c-hero">
        <h1 className="c-hero__title" data-reveal>
          <span>Let’s make</span>
          <span className="c-hero__something">
            <img src="/assets/blob-something.png" alt="" aria-hidden="true" />
            <span className="script">something</span>
          </span>
        </h1>
        <p className="c-hero__sub" data-reveal>
          Good ideas start with a conversation. Tell me what you have in mind.
        </p>
        <div className="c-lanes" role="tablist" data-reveal>
          <button role="tab" aria-selected={lane === 'project'} className={lane === 'project' ? 'is-on' : ''} onClick={() => setLane('project')}>
            I have a project <span aria-hidden="true">↗</span>
          </button>
          <button role="tab" aria-selected={lane === 'hiring'} className={lane === 'hiring' ? 'is-on' : ''} onClick={() => setLane('hiring')}>
            I'm hiring <span aria-hidden="true">+</span>
          </button>
        </div>
      </section>

      <section className="c-main">
        <form className="c-form" onSubmit={submit} noValidate>
          <div className="c-step">
            <h2>
              <span className="c-num">{lane === 'project' ? '01 /' : '01 /'}</span> {lane === 'project' ? 'What are we making?' : 'What’s the role?'}
            </h2>
            <p className="c-hint">{lane === 'project' ? 'Pick a folder. We’ll figure out the details together.' : 'Pick the closest fit. Tell me the rest below.'}</p>
            <div className="c-folders">
              {(categories ?? []).map((c, i) => (
                <button
                  type="button"
                  key={c.slug}
                  className={`c-folder ${form.category === c.name ? 'is-on' : ''}`}
                  aria-pressed={form.category === c.name}
                  onClick={() => set('category')(form.category === c.name ? '' : c.name)}
                >
                  <span className="c-folder__tab" aria-hidden="true" />
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="c-step">
            <h2>
              <span className="c-num">02 /</span> And a little about you.
            </h2>
            <div className="c-fields">
              <label>
                Your name
                <input value={form.name} onChange={set('name')} placeholder="What should I call you?" autoComplete="name" required />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@somewhere.com" autoComplete="email" />
              </label>
              <label>
                Or WhatsApp
                <input type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+20 …" autoComplete="tel" />
              </label>
            </div>

            <fieldset className="c-chips">
              <legend>When are you thinking?</legend>
              {TIMELINES.map((t) => (
                <button type="button" key={t} className={form.timeline === t ? 'is-on' : ''} aria-pressed={form.timeline === t} onClick={() => set('timeline')(t)}>
                  {t}
                </button>
              ))}
            </fieldset>

            <label className="c-wide">
              <span>
                A budget in mind? <small>optional</small>
              </span>
              <select value={form.budget} onChange={set('budget')}>
                <option value="">Choose a range · USD</option>
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>

            <label className="c-wide">
              The idea, in your words
              <textarea value={form.idea} onChange={(e) => set('idea')(e.target.value.slice(0, 500))} placeholder="The messy version is welcome. That’s where the good stuff starts." />
              <small className="c-count">{form.idea.length} / 500</small>
            </label>

            <label className="c-wide">
              <span>
                Something I should see? <small>optional</small>
              </span>
              <input value={form.link} onChange={set('link')} placeholder="A reference, website, or anything helpful · https://" />
            </label>

            <button className="c-send" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send my brief'} <span aria-hidden="true">➶</span>
            </button>
            <p className="c-status" role="status">
              {status === 'missing' && 'Add your name and an email or WhatsApp number so I can reply.'}
              {status === 'error' && 'That didn’t go through. Try again, or email me directly.'}
            </p>
          </div>
        </form>

        <aside className="receipt" aria-label="Your live brief">
          <div className="receipt__paper">
            <div className="receipt__top">
              <span>MADE FOR YOU</span>
              <span>BRIEF NO. 001</span>
            </div>
            <h2>A good beginning.</h2>
            <p className="receipt__sub">A little idea, taking shape.</p>
            <dl>
              <div>
                <dt>THE COLLABORATION</dt>
                <dd>{form.category || '—'}</dd>
              </div>
              <div>
                <dt>THE DETAILS</dt>
                <dd>{form.idea ? form.idea.slice(0, 90) + (form.idea.length > 90 ? '…' : '') : '—'}</dd>
              </div>
              <div>
                <dt>THE TIMING</dt>
                <dd>{form.timeline || '—'}</dd>
              </div>
              <div>
                <dt>THE BUDGET</dt>
                <dd>{form.budget || '—'}</dd>
              </div>
              <div>
                <dt>FROM</dt>
                <dd>{form.name || '—'}</dd>
              </div>
            </dl>
            <p className="receipt__foot">
              NO PRESSURE. NO PERFECT BRIEFS REQUIRED.
              <br />
              JUST A CONVERSATION TO START.
            </p>
          </div>
        </aside>
      </section>

      <Faq items={content?.services_faq ?? []} />
    </div>
  )
}
