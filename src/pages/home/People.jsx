import { useEffect, useState } from 'react'
import TitleStack from '../../components/TitleStack'
import Pill from '../../components/Pill'
import { Sticker } from '../../components/Shared'
import { NOTE_COLORS, STICKER_LIST, tilt } from '../../lib/theme'
import { getGuestbook, signGuestbook, useData } from '../../lib/data'
import photo from '../../assets/photo-web.jpg'

const scallopMask = (() => {
  const w = 360
  const h = 300
  const r = 9
  const nx = Math.round(w / (r * 2))
  const ny = Math.round(h / (r * 2))
  const sx = w / nx
  const sy = h / ny
  let d = `M0 0`
  for (let i = 0; i < nx; i++) d += ` a${sx / 2} ${r} 0 0 1 ${sx} 0`
  for (let i = 0; i < ny; i++) d += ` a${r} ${sy / 2} 0 0 1 0 ${sy}`
  for (let i = 0; i < nx; i++) d += ` a${sx / 2} ${r} 0 0 1 ${-sx} 0`
  for (let i = 0; i < ny; i++) d += ` a${r} ${sy / 2} 0 0 1 0 ${-sy}`
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-10 -10 ${w + 20} ${h + 20}'><path d='${d} Z' fill='black'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})()

const CARD_COLORS = ['var(--sky)', 'var(--blush)', 'var(--yellow)', 'var(--lilac)', 'var(--olive)', 'var(--cream)']

export function Testimonials({ items }) {
  if (!items?.length) return null
  const row = [...items, ...items]
  return (
    <section className="testimonials section" id="testimonials">
      <TitleStack script="what people say" main="About me" />
      <div className="testimonials__viewport">
        <ul className="testimonials__track" style={{ '--dur': `${items.length * 9}s` }}>
          {row.map((t, i) => (
            <li
              key={i}
              className="stamp"
              aria-hidden={i >= items.length}
              style={{ '--bg': CARD_COLORS[i % CARD_COLORS.length], '--rot': i % 2 ? '-4deg' : '5deg', '--mask': scallopMask, '--ink': i % CARD_COLORS.length === 4 ? 'var(--cream)' : 'var(--cocoa)' }}
            >
              <figure>
                <span className="stamp__mark" aria-hidden="true">“</span>
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  <span className="script">{t.author_name}</span>
                  <small>{t.author_role}</small>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function AboutTeaser({ intro }) {
  const body =
    intro?.body ||
    "I'm Maryam, a product and graphic designer who draws first and ships second. I turn messy briefs into warm, usable things: apps, brands and posters with a handmade edge."
  const highlights = intro?.highlights ?? ['draws first', 'warm, usable things', 'handmade edge']
  const pattern = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  const parts = body.split(pattern)

  return (
    <section className="about-teaser stripes stripes--soft">
      <div className="about-teaser__inner">
        <div className="polaroid" data-reveal>
          <span className="polaroid__tape" aria-hidden="true" />
          <div className="polaroid__photo">
            <img src={intro?.photo_url || photo} alt="Portrait of Maryam Wessam" />
          </div>
          <Sticker name="disco" className="polaroid__sticker" />
        </div>
        <div className="about-teaser__text" data-reveal style={{ '--delay': '0.1s' }}>
          <p className="about-teaser__para">
            {parts.map((part, i) =>
              highlights.includes(part) ? (
                <span key={i} className="hl script">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
          <Pill to="/about" size="sm" iconAfter="⟶" style={{ color: 'var(--cocoa)' }}>
            more about me
          </Pill>
        </div>
      </div>
    </section>
  )
}

export function Guestbook() {
  const { data } = useData('guestbook', getGuestbook)
  const [notes, setNotes] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sticker, setSticker] = useState(STICKER_LIST[0].name)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (data) setNotes(data.map((n, i) => ({ ...n, sticker: STICKER_LIST[i % STICKER_LIST.length].name })))
  }, [data])

  const submit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setStatus('sending')
    try {
      await signGuestbook({ name: name.trim(), message: message.trim() })
      setNotes((n) => [{ id: `local-${Date.now()}`, name: name.trim() || 'Anonymous', message: message.trim(), sticker, pending: true }, ...n].slice(0, 6))
      setMessage('')
      setName('')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="guestbook section">
      <TitleStack script="leave" main="Your mark" />
      <p className="guestbook__sub" data-reveal>
        Say hi, leave a note, pick a sticker.
      </p>
      <div className="guestbook__grid">
        <form className="gb-form" onSubmit={submit} data-reveal>
          <label className="gb-form__label" htmlFor="gb-name">
            Name (optional)
          </label>
          <input id="gb-name" className="gb-form__input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="name" />
          <div className="gb-form__row">
            <label className="gb-form__label" htmlFor="gb-note">
              Your note
            </label>
            <span className="gb-form__count">{message.length}/80</span>
          </div>
          <textarea id="gb-note" className="gb-form__input gb-form__area" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 80))} required />
          <fieldset className="gb-form__stickers">
            <legend className="gb-form__label">Pick a sticker</legend>
            <div className="gb-form__picks">
              {STICKER_LIST.map((s) => (
                <label key={s.name} className={`gb-pick ${sticker === s.name ? 'is-on' : ''}`}>
                  <input type="radio" name="sticker" value={s.name} checked={sticker === s.name} onChange={() => setSticker(s.name)} className="visually-hidden" />
                  <img src={s.src} alt={s.name} />
                </label>
              ))}
            </div>
          </fieldset>
          <button className="gb-form__submit script" disabled={status === 'sending'}>
            {status === 'sending' ? 'sticking…' : 'stick it'}
          </button>
          <p className="gb-form__status" role="status">
            {status === 'sent' && 'Pinned! It shows up for everyone once I approve it.'}
            {status === 'error' && 'Something slipped. Try again in a moment?'}
          </p>
        </form>
        <ul className="notes">
          {notes.map((n, i) => (
            <li key={n.id} className="note" style={{ '--bg': NOTE_COLORS[i % NOTE_COLORS.length], '--rot': tilt(i, 4) }}>
              <p className="note__msg">{n.message}</p>
              <p className="note__by script">{n.name}</p>
              {n.pending && <small className="note__pending">waiting for approval</small>}
              <Sticker src={STICKER_LIST.find((s) => s.name === n.sticker)?.src} className="note__sticker" wobble={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
