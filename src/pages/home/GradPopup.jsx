import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GRAD_PROJECT_POPUP } from '../../config'
import { useIntroDone } from '../../lib/intro'
import { safeSession } from '../../lib/hooks'
import { Sticker } from '../../components/Shared'

export default function GradPopup({ fallbackImage }) {
  const introDone = useIntroDone()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!GRAD_PROJECT_POPUP.enabled || !introDone || safeSession.get('mw-popup')) return
    const id = setTimeout(() => setOpen(true), GRAD_PROJECT_POPUP.delayMs)
    return () => clearTimeout(id)
  }, [introDone])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const close = () => {
    safeSession.set('mw-popup', '1')
    setOpen(false)
  }

  if (!open) return null
  const image = GRAD_PROJECT_POPUP.image || fallbackImage
  const external = GRAD_PROJECT_POPUP.url.startsWith('http')

  return (
    <div className="popup" role="dialog" aria-modal="true" aria-label="My grad project" onClick={close}>
      <div className="popup__card" onClick={(e) => e.stopPropagation()}>
        <button className="popup__close" onClick={close} aria-label="Close">
          ×
        </button>
        <div className="popup__img">{image && <img src={image} alt="" />}</div>
        <div className="popup__band">
          {external ? (
            <a href={GRAD_PROJECT_POPUP.url} target="_blank" rel="noreferrer" className="popup__cta" onClick={close}>
              <span className="hand-outline" aria-hidden="true" />
              View my grad project
            </a>
          ) : (
            <Link to={GRAD_PROJECT_POPUP.url} className="popup__cta" onClick={close}>
              <span className="hand-outline" aria-hidden="true" />
              View my grad project
            </Link>
          )}
        </div>
        <Sticker name="laptop" className="popup__st popup__st--a" />
        <Sticker name="headphones" className="popup__st popup__st--b" />
        <Sticker name="folder" className="popup__st popup__st--c" />
        <Sticker name="bag" className="popup__st popup__st--d" />
      </div>
    </div>
  )
}
