# Hosting & audience cuts

## How the site is built

`index.html` is the **single source of truth** for the full EPK. Audience-tailored cuts
(currently `/venues/`) are **generated** from it — no copy-paste, so contact info, specs, media,
and the song list are edited in one place and never drift.

```bash
npm install       # once
npm run build     # regenerates every cut from index.html, then rebuilds assets/tw.css
```

- `build.mjs` reads `index.html` + `src/variants.json` and writes each cut to `<outDir>/index.html`.
  It also copies `src/site.json` → `epk.json` at the repo root (with an `updatedAt` stamp): a public,
  CORS-open manifest the Setlist-Generator outreach app fetches to sync booking details and links.
  Keep only already-public data in `src/site.json`.
- Each `<section>` in `index.html` carries `data-audience="all"` or `data-audience="full"`; a cut
  keeps sections tagged `all` or its own token (e.g. `venues`). Nav links (`data-nav-for`) to
  dropped sections are removed automatically; hero copy + SEO tags come from `src/variants.json`.
- **To add a cut** (casino, weddings, corporate): add a section token in `index.html` (e.g.
  `data-audience="all casino"`) and a new object in `src/variants.json`. No other changes.
- Generated files (`venues/index.html`, `assets/tw.css`) are committed so the static host needs no
  build step.

## Current live behavior (GitHub Pages)

The site is on GitHub Pages at `zembamusicco.com`. Because the cuts are plain folders, they are
**already reachable by path** once merged:

- `zembamusicco.com/` — full EPK
- `zembamusicco.com/venues/` — venues / bars / restaurants cut
- `zembamusicco.com/songs.html` — repertoire

No Cloudflare is required for that. Subdomains are a nicety on top.

## Optional: Cloudflare Pages + subdomains (when ready)

1. **Connect** — Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git** →
   authorize GitHub → select `chriszemba-EPK`. (No Workers are used; a static Pages project runs
   none.)
2. **Build settings** — Build command: `npm run build` · Build output directory: `/` (repo root) ·
   Framework preset: None. Cloudflare runs `npm install` (incl. devDependencies) automatically.
3. **DNS** — move `zembamusicco.com` to Cloudflare (free) so subdomains are trivial to add.
4. **Map subdomains to the generated paths** with a `_redirects` file at the repo root:

   ```
   https://epk.zembamusicco.com/*       https://zembamusicco.com/:splat        301
   https://venues.zembamusicco.com/*    https://zembamusicco.com/venues/:splat 301
   ```

   (Add `casino.` / `weddings.` lines as those cuts ship.) Alternatively add each subdomain as a
   Pages custom domain and point it at the matching path. Note: `_redirects` is a Cloudflare Pages
   feature — it is ignored by GitHub Pages, so only add it once you have cut over.
5. **Optional** — switch the booking form to Cloudflare Pages Forms for free in-form photo uploads
   (the current FormSubmit `/ajax` path does not carry file attachments).
