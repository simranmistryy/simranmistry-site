# simranmistry.com

Personal site for Simran Mistry — Senior PM @ Spotnana + lifestyle/fashion creator.
Static site (blush/burgundy "liquid glass" design). No build step — plain HTML, served as-is.

## Pages
- `index.html` — Home
- `work.html` — Work (product/PM projects)
- `content.html` — Content / media kit
- `portfolio.html` — Portfolio (events, shoots, notes, playlists, maps, travel)
- `shop.html` — Shop ("The Archive")

Shared runtime + styles: `support.js`, `reveal.js`, `image-slot.js`, `styles.css`, `tokens/`.
Images live in `assets/` and `uploads/`.

## Updating content (articles, projects, posts)
Edit the relevant `*.html` file directly, or ask Claude to do it. A few times a month is expected.

## Auto-updating stats (social analytics)
The rolling social numbers on the media kit are **managed data**, not hand-typed:
- Current values live in `stats/stats.json`.
- Each number on the page is wrapped like `<span data-stat="ig_views_30d">28.4K</span>`.
- `python3 stats/apply_stats.py` pushes `stats.json` values into every page (idempotent).

The weekly refresh: pull live IG/TikTok numbers → update `stats/stats.json` → run `apply_stats.py` → deploy.

Follower counts and 30-day follower growth are managed here too (`ig_followers`, `tt_followers`,
`tt_growth_30d`). Follower counts appear in **two** places — the hero pills near the top of
`content.html` and the Platforms & Analytics section lower down — so hand-editing reliably missed
one. Both spots now share the same `data-stat` key and `apply_stats.py` keeps them in sync.

**Editorial numbers are NOT auto-managed** — the 171K single-post hero, FYP %, and non-follower %
come from native app analytics and are edited by hand in `content.html`. The "Top posts · last 30
days" captions are hand-edited too.

## Deploy
Hosted on Netlify, connected to this repo — every push auto-deploys. Custom domain: simranmistry.com.
