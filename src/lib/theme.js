export const CATEGORY_STYLE = {
  branding: { bg: 'var(--lilac)', fg: 'var(--cocoa)' },
  'ux-ui-design': { bg: 'var(--red)', fg: 'var(--cream)' },
  'motion-graphics': { bg: 'var(--olive)', fg: 'var(--cream)' },
  'contextual-research': { bg: 'var(--blush)', fg: 'var(--burgundy)' },
  'game-ux-ui': { bg: 'var(--yellow)', fg: 'var(--burgundy)' },
  'coding-development': { bg: 'var(--sky)', fg: 'var(--burgundy)' },
  'interactive-3d-design': { bg: 'var(--burgundy)', fg: 'var(--cream)' },
  'xr-interaction-design': { bg: 'var(--cream)', fg: 'var(--burgundy)' },
  'graphic-design': { bg: 'var(--mandarine)', fg: 'var(--cream)' },
}

export const categoryStyle = (slug) => CATEGORY_STYLE[slug] ?? { bg: 'var(--cream)', fg: 'var(--cocoa)' }

export const STICKERS = {
  cups: '/assets/st-cups.png',
  disco: '/assets/st-disco.png',
  bag: '/assets/st-bag.png',
  laptop: '/assets/st-laptop.png',
  headphones: '/assets/st-headphones.png',
  folder: '/assets/st-folder.png',
}

export const STICKER_LIST = Object.entries(STICKERS).map(([name, src]) => ({ name, src }))

export const tilt = (i, amount = 4) => {
  const pattern = [1, -0.8, 0.5, -1.1, 0.7, -0.4, 1.2, -0.6]
  return `${(pattern[i % pattern.length] * amount).toFixed(2)}deg`
}

export const NOTE_COLORS = ['var(--butter)', 'var(--sky)', 'var(--blush)', 'var(--yellow)', 'var(--lilac)', 'var(--cream)']
