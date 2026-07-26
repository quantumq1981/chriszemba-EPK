# Chris Zemba EPK — Execution Progress Log

**Branch:** `claude/zemba-epk-execution-6e6xfo`
**Blueprint:** `EPK-AUDIT.md` (Section 8 Ship Order + detailed sections)
**Objective:** Convert a content-rich page that is silently losing bookings into an effective conversion tool. No scope creep, no redesign deviations.

---

## Leadership note — execution model

Every Phase 1 task edits a **single file** (`index.html`). Running parallel agents (Person A/B/C) against one file would cause merge conflicts and race conditions. The correct engineering call is to execute all three workstreams as **one coordinated sequential stream in the audit's Ship Order (§8)**, which preserves every assignment while eliminating conflict risk.

Ordering refinement: all HTML markup edits are applied **before** the Tailwind purge, because the purge scans the final markup for the class set to keep. Purging before the booking form / facades were added would drop their utility classes.

---

## Phase 1 — Immediate Deployment (addresses booking loss) — ✅ COMPLETE

| # | Task | Audit ref | Owner (workstream) | Status |
|---|------|-----------|--------------------|--------|
| 1 | Inline booking form (replace mailto:) + §7 budget dropdown | P0.1 / §6 | A | ✅ done |
| 2 | Trust bar under hero | §7 red-team | A | ✅ done |
| 3 | Domain + branded email + 702 phone + OG/canonical | P0.3/P0.4 | A | ✅ done |
| 4 | Video facades (6 YT + 1 SoundCloud → click-to-load) | P0.2 / §5.4 | B | ✅ done |
| 5 | Hero preload + `<img>` + srcset (+ generated 800/1400w webp) | P0.2 / §5.7 | B | ✅ done |
| 6 | Purge Tailwind CDN → static `assets/tw.css` (25.7KB min) | P0.2 | B | ✅ done |
| 7 | Verify (render desktop+mobile, class parity) · commit · push · PR | — | Lead | ✅ done |

_Dynamic copyright year + "Updated" line belongs to **Phase 3** in the plan; deferred to honor strict phasing (footer currently reads © 2026, correct today)._

### Verification performed
- **Class parity:** all 419 class tokens in `index.html` resolve to `tw.css`, the inline `<style>`, or Font Awesome — zero dropped utilities after the purge.
- **Render check:** headless Chromium at 1440px and 390px — hero `<img>`, trust bar, and booking form all render correctly; no JS/page errors (only the sandbox proxy blocking Google Fonts + FA CDN, which load normally in a real browser).
- **Tag balance + no CDN remnants** confirmed.

### ⚠️ Go-Live Checklist — User-side activations required before production DNS cutover
These three are owned by Chris/User (accounts + provisioning). The page markup targets the correct end state; each is safely flagged so nothing silently swallows a lead:
1. **Formspree endpoint** — replace `REPLACE_WITH_FORM_ID` in the `<form action>` (see HTML comment in `#book`) with the real Formspree (or Netlify Forms) form ID. Until then the form will not deliver; the branded email link is the working fallback.
2. **Branded email MX** — activate `booking@zembamusicco.com` (and `admin@`) so the mailto + form-reply address receives mail.
3. **702 phone number** — swap the "Direct 702 line — activating" placeholder for the real number once provisioned (make it a `tel:` link at that point).

### Environment facts established
- Node v22 / npx available; no imagemagick (using `sharp` for hero variants).
- `songs.html` does **not** use the Tailwind CDN — purged stylesheet only needs to cover `index.html`.
- Hero responsive variants and video thumbnails did not exist — generated/fetched during execution.

### Decisions / deviations from literal audit text (with rationale)
- **Formspree endpoint:** audit shows placeholder `YOUR_ID`. Real endpoint requires the User's Formspree account. Form is wired with a clearly-marked `REPLACE_ME` placeholder action + a validation note so it cannot silently swallow leads. (Flagged for User.)
- **702 phone:** number not yet provisioned (audit §0). Using a clearly-labeled placeholder, not a fake dialable number, to avoid a dead `tel:` link. (Flagged for User.)
- **Font Awesome CDN:** left in place — not called out in P0.2 (which targets the Tailwind JIT parse + iframes). Avoiding scope creep.

---

## Phase 2 — Visual hierarchy & perceived rate — ✅ COMPLETE

Branch restarted from merged `main` (PR #20). Executed as one coordinated single-file stream (same rationale as Phase 1). Markup edited first; `tw.css` rebuilt last against final markup.

| Bucket | Audit ref | What shipped | Status |
|---|---|---|---|
| Contrast floor | §4.1 | Marquee `slate-500→slate-300/90`; readable `slate-500→slate-400` (RJ caption, artists heading, table header, input-list note, form helper); deleted `slate-600` (footer ©, Venmo → slate-400; ext-link icons → slate-500 decoration). Remaining slate-500 are pure decoration/placeholders. | ✅ |
| Accent budget | §4.2 | Glows cut **14 → 3** deliberate moments (hero CTA, brand banner, wedding anchor). Event-tile icons demoted to `slate-400` with `group-hover:text-fire-400` ignite (audit's exemplar cluster) + format-ribbon icon. Specs wayfinding icons deliberately kept (functional scannability, not inflation). | ✅ |
| Spacing & rhythm | §2 | Three-tier vertical scale (hero/#book tier-1, events/acts/stage/about tier-2, rest tier-3); `scroll-mt-24` on all sections (fixes sticky-nav anchor bug §2.2); 7 section headers split to 12-col grid (§2.3); `neon-rule` cut from 10 headers, single closing rule kept at #book; bento gaps `gap-4→md:gap-5`. | ✅ |
| Typography | §3 | Fluid `clamp()` on H1/all H2s/#book heading (§3.1); eyebrow tracking `.32em→.20em` (§3.6); card sales-copy promoted to `text-[15px] slate-300` (§3.3); proof stats rebuilt as editorial `gap-px` hairline dividers with clamp'd numerals (§3.5). | ✅ |
| Surfaces | §4.3 | Top inset highlight baked into shared `.card-hover` (covers all hover-cards in one rule) + hover lift shadow; `.card-surface` gradient-glass on format ribbon, both repertoire cards, specs list; all ambient blurs `hidden md:block` (skip mobile compositing). | ✅ |

**Verification:** `tw.css` rebuilt (28KB); 446/446 class tokens resolve; headless Chromium desktop + mobile render clean, **0 page errors**. Split headers, fluid type, quieted icons, readable marquee, edge-lit surfaces confirmed visually.

**Scope discipline:** §4.4 nav-glass and §5.3 button sweep were *not* pulled in (not in the Phase 2 brief) — only the §5.3 CTA copy fix ("Check Availability → Check your date") was applied as pure conversion copy. Motion/focus/keyboard-nav (§5.1/5.2/5.5) remain Phase 3 per the plan.

## Phase 3 — Shortlisting & shelf life — ✅ COMPLETE (one content gap flagged)

Branch restarted from merged `main` (PR #21). Same single-file coordinated stream.

| Item | Audit ref | What shipped | Status |
|---|---|---|---|
| Bio refresh | — | About long-bio replaced with User's updated copy (adds DSJ / formerly Down South Jukers; corrected "Station Casinos", "Rowdy McCaren"). | ✅ |
| Paste-ready short bio | P1.3 | ~80-word third-person block with a working copy-to-clipboard button. | ✅ |
| Dates section | P1.1 | New `#dates` section + nav link. Populated with the **real recurring residencies** from the on-property flyers (Indigo Lounge/Bally's, EXTRA Lounge/Planet Hollywood, Roxy's/Sam's Town) — no fabricated one-off dates. Template comment + "ask for current calendar" CTA. | ✅ |
| How Booking Works | P2 | New `#how` 3-step section (Inquiry → Hold & contract → Advance & downbeat) before the form, to de-risk first-time corporate buyers. | ✅ |
| Structured data | P2 | JSON-LD `Person` + `MusicGroup` + `WebSite` graph in `<head>` (validated: parses clean). | ✅ |
| Analytics | P2 | Plausible file-downloads + outbound-links script (auto-tracks rider/repertoire PDF downloads); custom `Booking Inquiry` event on the form submit. | ✅ |
| One-sheet PDF | P1.2 | `assets/downloads/chris-zemba-one-sheet.pdf` (270KB, Letter): photo, short bio, 3 quotes, formats, compliance chips, contact. Linked from the Specs card. Source: `assets/downloads/one-sheet-src.html` (rendered via Chromium with downsized images). | ✅ |
| Print stylesheet | §5.8 | `@media print` — hides nav/marquee/video facades, white background, prints link URLs, fits to page. | ✅ |
| Focus states | §5.1 | Visible `:focus-visible` outline on all interactive elements. | ✅ |
| Reduced motion | §5.2 | Guarded smooth-scroll; gallery scales + card lifts disabled under `prefers-reduced-motion`. | ✅ |
| Tab keyboard nav | §5.5 | Roving-tabindex + arrow/Home/End key nav on the media tablist; panels `tabindex="0"`. | ✅ |
| Dynamic year + Updated | §7 | `© <span id="yr">` set by JS; visible "Updated July 2026" line. | ✅ |

**Verification:** `tw.css` rebuilt; 464 classes resolve (only clamp/shadow/opacity escaping artifacts flagged); desktop render **0 page errors**; JSON-LD parses valid; dynamic year renders. Dates + How-Booking-Works + short bio + one-sheet visually confirmed.

### ⚠️ The one item I will NOT fabricate — needs Chris
- **Third named testimonial.** The reviews section still has the two genuine ones (RJ + the real wedding-client quote). The audit wants a third *named* testimonial (title + property, e.g. "Banquet Manager, Green Valley Ranch"). I will not invent a quote or attribution — that would be fabricated social proof published as real. **Send one real testimonial (quote + name + title + property) and I'll drop it in.**
- **Specific upcoming one-off dates** (beyond the residencies) can be added anytime using the template comment in `#dates`.

### Go-live checklist (unchanged, User-owned)
1. ~~Formspree form ID~~ ✅ wired (`xjgnpodo`) — confirm the recipient inbox in the Formspree dashboard, then switch it to `booking@` once live. 2. `booking@`/`admin@` mailboxes. 3. 702 number (User adding later per instruction). 4. Plausible: add `zembamusicco.com` in a Plausible account for the analytics to record.

---

## Audit v2 → v3 execution (branch `claude/epk-audit-v2-fixes-3jfg83`)

Blueprint: `EPK-AUDIT-v2.md` §8 ship order. Same single-file coordinated stream as prior phases
(parallel agents on one `index.html` would conflict). Markup edited first; `assets/tw.css` rebuilt
last against the final markup with Tailwind 3.4.19 so every new utility class is purged in.

### Phase 0 — Blocking

| # | Item | Audit ref | What shipped | Status |
|---|------|-----------|--------------|--------|
| 1 | Verify `tw.css` carries the theme | §2.1 | Toolchain restored (`npm i`, Tailwind 3.4.19). Smoke test passes: `bg-midnight-950`, `text-fire-400`, `Oswald`, `font-weight:600`, `text-wrap:balance` all ≥1. `clamp()` classes processed by Tailwind (not hand-copied). | ✅ |
| 2 | Asset path check | §2.2 | All `assets/` refs resolve, including `portrait-chris.webp` (89 KB, exists) — the JSON-LD image is valid, no broken path. | ✅ |
| 3 | Form wiring — no redirect | §3.2 | Fetch-based submit handler: `e.preventDefault()`, POST via `fetch`, inline "Inquiry received" success card, and an error path that re-enables the button + surfaces the email fallback (de-duplicated on retry). Buyer never leaves the page. | ✅ |
| 3b | Plausible fixed | §3.3 | Swapped to `script.file-downloads.outbound-links.tagged-events.js`; removed the inert `plausible-event-name=...` class; fire `plausible('Booking Inquiry')` from the handler (reliable, controlled timing). | ✅ |
| 4 | Build size / LCP | red team | Purged `tw.css` ≈ 28 KB (not 3 MB → purge works). Hero LCP path already correct (`<img>` + srcset + `fetchpriority=high` + preload). Full Lighthouse run needs the deployed URL (see note). | ✅ static / ⚠️ live |

### Phase 1 — Direct booking impact

| # | Item | Audit ref | What shipped | Status |
|---|------|-----------|--------------|--------|
| 5 | Sticky mobile action bar | §4.1 | Two-up **Email / Check your date**, `fixed … md:hidden`, safe-area padding, hidden in print. `pb-24 md:pb-0` added to `<body>`. Swap Email → Call when the 702 line activates (comment in place). | ✅ |
| 6 | Booking panel two-column split | §3.1 | `#book` inner content is now a 12-col grid — pitch + direct contact left (`col-span-5`), form in its own `card-surface` glass card right (`col-span-7`). Dropped redundant `sm:col-span-1`. | ✅ |
| 7 | Un-orphan short bio | §3.4 | Re-added the paste-ready short-bio block (`.copy-btn` / `#short-bio`) inside `#about`, matching the existing copy-to-clipboard JS. (It had been added then removed in commit 258dfe7, leaving the listener dead.) | ✅ |
| 8 | Dates truth-in-advertising | §5.2 | Retitled **"Where to catch us live"**; badge is now day/format on top, cadence underneath (no more `LIVE` ×3). All three acts appear: Late Shift residencies (Public) + The Chris Zemba Band and ZembAcoustics rows ("By arrangement" — honest, not invented public dates). | ✅ |

### Phase 2 — Polish & perceived rate

| # | Item | Audit ref | What shipped | Status |
|---|------|-----------|--------------|--------|
| 9 | Accent budget | §4.5 / red team | Trust-bar icons → `text-slate-400` (calm authority); separators stay fire. Demoted structural icons in colored tiles (specs list, "Official Website" globe) to slate-400 with `group-hover:text-fire-400`. Fire kept on trust chips, CTAs, stat numbers, gradient words. | ✅ |
| 10 | Nav glass + Logistics | §4.2 | `backdrop-blur-xl backdrop-saturate-150` + `supports-[backdrop-filter]` fallback. Nav "Repertoire" → **"Logistics"** (`#specs`) so production managers find the stage plot directly. | ✅ |
| 11 | Hero CTA treatment | §4.3 | §5.3 gradient / press-state / hover-sweep applied to the hero primary "Check your date"; matched quieter treatment on the secondary "Watch the Reels". | ✅ |
| 12 | Finish card-surface rollout | §6 | Applied `card-surface` uniformly to the flat content cards (press coverage + agency, About formats stack, spec/stage/input-list rows, two review sub-cards). Photo frames and the intentional hairline stat-divider tiles stay flat. | ✅ |
| 13 | Small contrast fixes | §6 | Footer "Updated July 2026" and all form placeholders → `text-slate-400`. Remaining `slate-500` is decorative only (em-dash separator, external-link arrows). | ✅ |

### Phase 3 — Structure & shelf life

| # | Item | Audit ref | What shipped | Status |
|---|------|-----------|--------------|--------|
| 16 | JSON-LD restructure | §5.3 | Three acts are now `subOrganization` `MusicGroup`s under an `Organization` (`#org`) with `contactPoint` Booking — no longer collapsed as `alternateName` of one band. `WebSite.publisher` → `#org`. Validate at Rich Results Test before publishing. | ✅ |
| 17 | Comment cleanup | red team | Replaced every `§`/`P0`-style audit-reference comment with plain-English explanations of what the code does. | ✅ |

### Content gaps
- **Corporate proof (highest-value gap, red team §7) — ✅ CLOSED.** Chris supplied a real booking: **Baskow Talent Agency** booked Chris Zemba & The Late Shift Band for a private corporate event at the **Palms Casino Resort** (Crestron-branded stage visible in the photo). Added a corporate-proof block to `#events`: the event photo (`assets/photos/corporate-crestron-palms.webp`), the named agency reference, and their post-event quote ("extremely polished, seasoned and professional"). Integrity guardrail: the David Walker / Renee Balaco / Ian Seeberg quotes are testimonials about *Baskow the agency*, not about Chris, so they were **not** used as endorsements of Chris. The contract `.doc` was treated as backing only — not read, not published.
- **Named testimonials — still partial (§4.6).** The corporate named reference (Baskow) is now live. Still "Barnett Wedding Party" + two press/residency quotes for the wedding/individual side; per User note those individual testimonials are in progress and will be dropped in when supplied. No quotes or attributions invented.

### Verify on the deployed URL (needs the live site, can't run here)
- Lighthouse **mobile** run on the deployed URL; confirm LCP is reasonable and `tw.css` downloads at its purged ~28 KB.
- Google Rich Results Test on the new JSON-LD.

### Go-live checklist (User-owned, unchanged)
1. Confirm the Formspree recipient inbox (`xjgnpodo`); switch the action to `booking@` once that mailbox is live. 2. `booking@` / `admin@` mailboxes. 3. 702 number → make the pitch line + mobile-bar button a `tel:` link. 4. Add `zembamusicco.com` in a Plausible account so events record.

---

_Log updated as each task completes._
