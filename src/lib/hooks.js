import { useEffect, useRef, useState } from 'react'

export function useRevealObserver(deps = []) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-revealed', '')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const watch = (root) => root.querySelectorAll?.('[data-reveal]:not([data-revealed])').forEach((el) => io.observe(el))
    watch(document)
    const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && (n.matches?.('[data-reveal]') ? io.observe(n) : watch(n)))))
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function useDraggable(containerRef, deps = []) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    let active = null
    let start = null
    let z = 10
    const down = (e) => {
      const el = e.target.closest('[data-drag]')
      if (!el || !root.contains(el)) return
      e.preventDefault()
      active = el
      const tx = parseFloat(el.dataset.tx || 0)
      const ty = parseFloat(el.dataset.ty || 0)
      start = { x: e.clientX - tx, y: e.clientY - ty }
      el.style.zIndex = ++z
      el.classList.add('is-dragging')
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      if (!active) return
      const bounds = root.getBoundingClientRect()
      const limX = bounds.width * 0.45
      const limY = bounds.height * 0.45
      const tx = Math.max(-limX, Math.min(limX, e.clientX - start.x))
      const ty = Math.max(-limY, Math.min(limY, e.clientY - start.y))
      active.dataset.tx = tx
      active.dataset.ty = ty
      active.style.translate = `${tx}px ${ty}px`
    }
    const up = () => {
      active?.classList.remove('is-dragging')
      active = null
    }
    root.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      root.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    mq.addEventListener('change', on)
    on()
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export function useCairoTime() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo' })
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return time
}

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const safeSession = {
  get(k) {
    try {
      return sessionStorage.getItem(k)
    } catch {
      return null
    }
  },
  set(k, v) {
    try {
      sessionStorage.setItem(k, v)
    } catch {
    }
  },
}
