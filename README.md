# Maryam Wessam — Portfolio

React + Vite build of the Figma file "portfolio submission" → page **Pages design**, with live data from the Supabase project `portfolio`.

## Run it in VS Code

1. Open this folder in VS Code (**File → Open Folder… → portfolio**).
2. Open the terminal (**Terminal → New Terminal**) and run:

   ```bash
   npm install
   npm run dev
   ```

3. Open the link it prints (usually http://localhost:5173).

You need Node.js 20 or newer (`node -v` to check). If you don't have it, install the LTS version from nodejs.org.

The `.env` file already has your Supabase URL and publishable key. It isn't uploaded to GitHub. Copy `.env.example` if you ever need to recreate it.

## Push to GitHub

The folder is already a git repo with one commit. In the VS Code terminal:

```bash
git remote add origin https://github.com/maryamwessam05/portfolio.git
git push -u origin main
```

If GitHub says the repo already has commits (for example a README you created on the website), run `git pull origin main --allow-unrelated-histories`, then push again.

## Hosting on Hostinger

```bash
npm run build
```

Upload everything inside `dist/` to `public_html` (or to the subdomain's folder). `public/.htaccess` is copied into `dist/` automatically, so refreshing a page like `/about` still works.

## Where things live

| What | Where |
| --- | --- |
| Pages | `src/pages/` (Home, Works, ProjectDetail, Services, About, Journal, JournalPost, Contact, ThankYou, NotFound, Sitemap) |
| Home sections | `src/pages/home/` |
| Case study templates (ux, game, branding, motion, research, coding, 3d) | `src/pages/templates/` |
| Shared bits (nav, footer, preloader, pills, FAQ, CTA) | `src/components/` |
| Supabase queries | `src/lib/data.js` |
| Colours, fonts, type scale | `src/styles/global.css` (`:root`) |
| Category colours and stickers | `src/lib/theme.js` |
| Grad project popup switch and link | `src/config.js` |
| Images exported from Figma | `public/assets/` |

## Data

- Projects show if `status = 'published'`. Which template a project uses comes from its primary category's `template_key`, falling back to whichever template column has data. Anything listed in a template's `hidden_sections` is skipped.
- Project images come from `project_images.section_key`: `screens`, `mockups`, `website`, `final_web_screens`, `walkthrough`, `concept`, `logo_experiments`, `out_in_the_world`, `made_to_live`, `gallery`, `dashboard`, `model`, `characters`, `ui`.
- Home intro, About texts, Services packages and FAQ come from the `content` table. Services cards come from `services`. Contact settings, CV link and freelance badge come from `site_settings`.
- Guestbook notes post to `guestbook_entries` as `pending`. Contact briefs post to `contact_messages`.

## Animations

Everything moving is deliberately simple so you can replace it:

- Preloader: `src/components/Preloader.jsx` (GSAP timeline, plays once per session).
- Hero cards pile → frame, logo reveal: `src/pages/home/Hero.jsx`.
- Scroll reveals: any element with `data-reveal` fades up. `--delay` staggers it.
- Page transition: the mandarine panel in `src/components/Layout.jsx`.
- Services stacking cards (CSS `position: sticky`) and the phases fan-out (GSAP ScrollTrigger): `src/pages/Services.jsx`.
- Research methods stacking cards: `.method` in `src/pages/templates/templates.css`.
