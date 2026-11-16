// Small switches that aren't in Supabase yet. Edit freely.
export const GRAD_PROJECT_POPUP = {
  enabled: true,
  // TODO: point this at the grad project page or live link once it exists.
  url: '/works',
  // Leave empty to use the cover of your first featured project.
  image: '',
  delayMs: 2500,
}

// Fallback copy used only if the matching row is missing from the `content` table.
export const FALLBACK = {
  heroLine: 'a product/graphic designer',
}
