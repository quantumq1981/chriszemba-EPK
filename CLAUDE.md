# CLAUDE.md — Chris Zemba EPK

Working notes for AI/dev sessions on this repo. Read at session start; update at session end.
Deep history lives in `PROGRESS.md`; the current structure rationale lives in
`EPK-STRUCTURE-ANALYSIS.md`. This file is the fast index.

---

## What this is

Static Electronic Press Kit for **Zemba Music Co (Chris Zemba)**, a Las Vegas guitarist / vocalist
/ bandleader. Sells live music to **booking agents, corporate/gala planners, entertainment
directors, club owners, festival buyers, and wedding clients**. Hosted on GitHub Pages at
`zembamusicco.com`. No backend.

## Architecture — single source, generated cuts

- **`index.html` is the single source of truth** (full EPK, 12 sections). Edit content here once.
- **Audience cuts are GENERATED** from it by `build.mjs` + `src/variants.json`. Never hand-edit a
  cut's `index.html` — it is overwritten on build.
  - `/venues/` — venues, bars & restaurants
  - `/corporate/` — corporate events & galas
  - `/weddings/` — weddings (ceremony → reception)
- **How a cut is defined:**
  - Each `<main> > section` carries `data-audience="all"` or a space-list of tokens
    (e.g. `"full corporate weddings"`). A cut keeps sections tagged `all` or its own token.
    `full` = full-EPK-only (dropped from every cut — used by the persona router).
  - Hero copy is swapped via `data-slot="hero-eyebrow"` / `data-slot="hero-subcopy"`.
  - Budget fieldset carries `data-slot="budget-ladder"` (removed when `hideBudgetLadder:true`).
  - Add a cut = add a `data-audience` token to the relevant sections + one object in
    `src/variants.json`. **No code change to `build.mjs`.**
- **`solo-duo/index.html`** is the exception: a **hand-maintained** ZembAcoustics sub-brand page
  (azure theme). Not generated. Shares `assets/tw.css` (its classes are in the Tailwind globs).
- **`src/site.json` → `epk.json`** (public, CORS-open manifest): booking contact + cut URLs +
  download links. The Setlist-Generator outreach app fetches it. Keep only already-public data here.

## Build & verify

```bash
npm install                 # once (devDeps: node-html-parser, tailwindcss 3.4)
npm run build               # regenerate all cuts from index.html + rebuild assets/tw.css
```

- **ALWAYS rebuild `tw.css` after markup/class edits** or new utilities won't be styled.
- Tailwind drops slash-opacity classes that aren't multiples of 5 (`bg-x/97` → use `/95`).
- Commit generated files (`venues/`, `corporate/`, `weddings/`, `assets/tw.css`) — the host has no
  build step.
- **Smoke test `assets/tw.css`** (each `grep -c` must be ≥1):
  `4 6 13` · `255 122 61` · `Oswald` · `font-weight:600` · `text-wrap:balance`.
- **No browser in the build sandbox** — anything visual (widget render, Lighthouse) is
  eyeball-on-deployed.

## Integrations

- **Booking form:** FormSubmit `/ajax` → `booking@zembamusicco.com` (activated, live). Change the
  destination by editing the email in the form `action`. `/ajax` does not carry file uploads.
- **Bandsintown for Artists:** artist `id_14646019`, widget in `#dates`, lazy-loaded on scroll,
  themed dark/fire (`data-auto-style="false"`). Empty until the owner enters gigs. A branded
  residency **fallback** (`#bit-fallback`) shows if the widget renders zero events or is
  blocked/failed (see the loader at the foot of `index.html`).
- **Linktree** = fan spoke, not the booking path. Human-facing Linktree links carry `utm_source=epk`;
  JSON-LD `sameAs` links stay clean. Booking always routes to `#book`/contact.
- **Analytics:** Plausible (`file-downloads.outbound-links.tagged-events`); `Booking Inquiry`
  custom event fires from the form handler.

## Guardrails (do not violate)

- **Never fabricate** testimonials, client names, quotes, dates, capacities, or compliance flags.
  Omit and flag for the owner instead. Every proof element on this page is third-party verifiable.
- **Act transparency:** Late Shift = Chris's headline act (bookable via Zemba). DSJ = the horn band
  he fronts (bookable as a horn section *under Zemba*, not as "DSJ"). Southern Stüe / Johnny B & The
  Road Dogs = acts he *guests* with — never present as bookable through Zemba.

## Open owner handoffs (account-gated — can't be done in-repo)

1. Populate Bandsintown (`id_14646019`) with upcoming dates.
2. Linktree Pro: pin EPK/booking on top, enable lead-capture, confirm `zembamusicco.com` → EPK
   (not a Linktree forward).
3. Deployed-URL QA: Lighthouse mobile, Rich Results test, Bandsintown widget + empty-state eyeball.
4. One more **named** testimonial (entertainment director or banquet/catering manager — title +
   property). Supply real; never invent.

---
_Update this file at the end of each session with anything the next session needs to know._
