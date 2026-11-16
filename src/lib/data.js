import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/* ------------------------------------------------------------------ */
/* Tiny cache + hook so pages share requests and render instantly on  */
/* revisits. Every helper returns plain data or throws.                */
/* ------------------------------------------------------------------ */
const cache = new Map()

export function useData(key, loader) {
  const [state, setState] = useState(() =>
    cache.has(key) ? { data: cache.get(key), loading: false, error: null } : { data: null, loading: true, error: null },
  )

  useEffect(() => {
    let alive = true
    if (cache.has(key)) {
      setState({ data: cache.get(key), loading: false, error: null })
      return
    }
    setState((s) => ({ ...s, loading: true }))
    loader()
      .then((data) => {
        cache.set(key, data)
        if (alive) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        console.error(`[data:${key}]`, error)
        if (alive) setState({ data: null, loading: false, error })
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

/* ---------------------------- projects ---------------------------- */
const PROJECT_LIST_FIELDS = `
  id, title, slug, thumbnail_url, basics, is_featured, featured_order, created_at,
  project_categories ( is_primary, categories ( id, name, slug, template_key, display_order ) )
`

function shapeProject(p) {
  const cats = (p.project_categories ?? [])
    .filter((pc) => pc.categories)
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.categories.display_order - b.categories.display_order)
    .map((pc) => pc.categories)
  return { ...p, categories: cats, primaryCategory: cats[0] ?? null, basics: p.basics ?? {} }
}

export async function getProjects() {
  const rows = unwrap(
    await supabase
      .from('projects')
      .select(PROJECT_LIST_FIELDS)
      .eq('status', 'published')
      .order('featured_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
  )
  return rows.map(shapeProject)
}

export async function getProject(slug) {
  const row = unwrap(
    await supabase
      .from('projects')
      .select(
        `*,
        project_categories ( is_primary, categories ( id, name, slug, template_key, display_order ) ),
        project_tools ( tools ( name, type ) ),
        project_images ( id, section_key, media_type, url, label, caption, sort_order ),
        testimonials ( quote, author_name, author_role, is_featured )`,
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(),
  )
  if (!row) return null
  const p = shapeProject(row)
  p.tools = (row.project_tools ?? []).map((t) => t.tools).filter(Boolean)
  p.images = [...(row.project_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  p.imagesBy = (key) => p.images.filter((i) => i.section_key === key)
  p.testimonial = (row.testimonials ?? []).sort((a, b) => Number(b.is_featured) - Number(a.is_featured))[0] ?? null
  return p
}

export async function getCategories() {
  return unwrap(await supabase.from('categories').select('*').order('display_order'))
}

/* ------------------------------ copy ------------------------------ */
export async function getContent() {
  const rows = unwrap(await supabase.from('content').select('id, page, text_value, json_value').order('sort_order'))
  return Object.fromEntries(rows.map((r) => [r.id, r.json_value ?? r.text_value]))
}

export async function getServices() {
  return unwrap(await supabase.from('services').select('*').order('sort_order'))
}

export async function getSettings() {
  const rows = unwrap(await supabase.from('site_settings').select('*').limit(1))
  return rows[0] ?? {}
}

export async function getTestimonials() {
  return unwrap(
    await supabase
      .from('testimonials')
      .select('quote, author_name, author_role, is_featured, projects ( title, slug )')
      .order('is_featured', { ascending: false }),
  )
}

export async function getTools() {
  return unwrap(await supabase.from('tools').select('name, type'))
}

/* ----------------------------- journal ---------------------------- */
export async function getPosts() {
  return unwrap(
    await supabase
      .from('posts')
      .select('id, title, slug, excerpt, cover_url, published_at, body')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  )
}

export async function getPost(slug) {
  return unwrap(
    await supabase.from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle(),
  )
}

/* ---------------------------- guestbook --------------------------- */
export async function getGuestbook() {
  return unwrap(
    await supabase
      .from('guestbook_entries')
      .select('id, name, message, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6),
  )
}

export async function signGuestbook({ name, message }) {
  // RLS allows anonymous inserts; entries stay "pending" until approved in the dashboard.
  unwrap(await supabase.from('guestbook_entries').insert({ name: name || 'Anonymous', message }))
}

/* ----------------------------- contact ---------------------------- */
export async function sendContactMessage({ name, email, message, serviceId = null }) {
  unwrap(await supabase.from('contact_messages').insert({ name, email, message, service_id: serviceId }))
}

/* ----------------------------- helpers ---------------------------- */
export const readMinutes = (text = '') => Math.max(1, Math.round(text.split(/\s+/).length / 200))

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export const coverOf = (p) => p?.basics?.cover_url || p?.thumbnail_url || ''

export const isVideo = (url = '') => /\.(mp4|webm|mov)(\?|$)/i.test(url)
