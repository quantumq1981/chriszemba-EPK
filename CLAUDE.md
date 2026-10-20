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
  themed dark/fire (`data-auto-style="false"`). **Populated and live** — the owner maintains gigs in
  Bandsintown for Artists and the widget self-updates. A branded residency **fallback**
  (`#bit-fallback`) is a defensive safety net that shows **only** if the widget ever renders zero
  events or the third-party script is blocked/failed; it stays hidden while real dates render (see
  the loader at the foot of `index.html`).
- **Linktree** = fan spoke, not the booking path. Human-facing Linktree links carry `utm_source=epk`;
  JSON-LD `sameAs` links stay clean. Booking always routes to `#book`/contact.
- **Contracts (Jotform Sign):** the per-gig e-sign contract is the Jotform Sign doc
  **"Zemba Music Co. — Performance Agreement (v2)"** (`262913782643060`). Public mirror of its terms:
  `assets/downloads/performance-agreement-src.html` → `zemba-music-performance-agreement.pdf`
  (rebuilt by the PDF Action). **Keep three places in sync** when terms change: the Jotform doc, the
  agreement source, and the "Hold & contract" copy + deposit FAQ in `index.html` / `solo-duo/`.
  Canonical terms: 7-day courtesy hold → date confirmed only on signature + 50% non-refundable
  retainer; balance 7 days out (100% at signing if <14 days out); Stripe hosted invoice (card / ACH
  debit / bank transfer) + Venmo Business / Zelle / PayPal / wire / check; **credit-card surcharge
  ≤3% only, never on debit** (card-network rule; Stripe invoices have no built-in surcharge); checks received
  14 days out; late fee 1.5%/month; cancel <14 days = 100% due; power 1×20A (solo–trio) / 2×20A
  (4-pc+). **`/pay/`** (hand-maintained, `noindex`, not in nav — linked from the agreement and
  invoices) shows the Venmo Business QR (`assets/photos/venmo-qr-zembamusicco.svg`, regenerated from
  the owner's QR payload and decode-verified; **owner phone-scan confirmed it opens the Zemba Music Co
  Venmo profile, 2026-10-19**) + `venmo.com/u/zembamusicco`. Venmo handle is public by
  design; **never** publish bank/routing numbers or Zelle details — those stay on the invoice.
  PayPal: owner's managed PayPal QR (`paypal.com/qrcodes/managed/2fd0ca29-…`, payload decoded from
  their upload) re-encoded as `assets/photos/paypal-qr-zembamusicco.svg`, decode-verified; the
  "Open in PayPal" button uses the same URL. Owner phone-scan of the PayPal QR still pending.
- **Stripe (Payments + Invoicing):** Dashboard-driven, **no code / no keys in this repo** (static host
  — a secret key here would be public). Pattern per gig: (1) retainer invoice, `send_invoice`, due in
  7 days (= courtesy hold), card + `us_bank_account` + `customer_balance` (US bank transfer VBAN);
  (2) balance invoice created at the same time as a draft scheduled to auto-finalize ~21 days before
  the event, `due_date` = event − 7 days. Product `Live Entertainment Performance`; event date /
  venue in `custom_fields`, installment + event date in `metadata`. Sandbox walkthrough objects carry
  `metadata.source=epk-setup`. Scheduled-send emails fire only in live mode. Payment plans (single
  invoice, deposit + balance) are private preview — don't build on them yet.
- **Analytics:** Plausible (`file-downloads.outbound-links.tagged-events`); `Booking Inquiry`
  custom event fires from the form handler.

## Guardrails (do not violate)

- **Never fabricate** testimonials, client names, quotes, dates, capacities, or compliance flags.
  Omit and flag for the owner instead. Every proof element on this page is third-party verifiable.
- **Act transparency:** Late Shift = Chris's headline act (bookable via Zemba). DSJ = the horn band
  he fronts (bookable as a horn section *under Zemba*, not as "DSJ"). Southern Stüe / Johnny B & The
  Road Dogs = acts he *guests* with — never present as bookable through Zemba.

## Open owner handoffs (account-gated — can't be done in-repo)

1. Linktree Pro: pin EPK/booking on top, enable lead-capture.
   (`zembamusicco.com` is wired to the EPK and Bandsintown is populated — both done.)
2. Deployed-URL QA: Lighthouse mobile, Rich Results test.
3. Jotform Sign: review the v2 agreement in the builder (signer order: Purchaser then Chris),
   then delete/archive the older v1 draft ("PERFORMANCE AGREEMENT ZEMBA MUSIC CO", `262913767740061`).
   Owner's attorney should give the agreement a once-over before first use.
   Stripe go-live: activate the account, set branding + invoice defaults (see PROGRESS.md "Stripe"),
   and decide whether to absorb card fees or set up a compliant credit-only surcharge.
4. One more **named** testimonial (entertainment director or banquet/catering manager — title +
   property). Supply real; never invent.

**Done (no longer open):** Bandsintown calendar is populated (`id_14646019`, live dates render);
`zembamusicco.com` resolves to the EPK.

---
_Update this file at the end of each session with anything the next session needs to know._
