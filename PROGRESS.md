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
1. Confirm the Formspree recipient inbox (`xjgnpodo`); switch the action to `booking@` once that mailbox is live. 2. `booking@` / `admin@` mailboxes. 3. ~~702 number~~ ✅ **(702) 706-2145** now live as a `tel:` link on the booking-panel contact list, the mobile **Call** button (Email → Call swap done), and the JSON-LD `contactPoint.telephone`. 4. Add `zembamusicco.com` in a Plausible account so events record.

---

## Post-audit follow-on work (all merged to `main`, branch `claude/epk-audit-v2-fixes-3jfg83`)

Each item below shipped as its own PR after the v2 audit fixes. Every change was verified: `tw.css`
rebuilt (Tailwind 3.4.19), full class-parity check (all class tokens in `index.html` resolve), and
JSON-LD parse check where relevant. Build environment CANNOT render a browser or reach Bandsintown,
so anything visual should be eyeballed on the deployed site.

| PR | What shipped |
|----|--------------|
| #25 | The full v2 audit punch list (Phases 0–3 above) + fix for 3 silently-dropped opacity classes (Tailwind only emits multiples of 5; `via-midnight-950/88`, `/92`, `bg-midnight-950/92` → rounded to /90, /95). |
| #26 | **Corporate proof** block in `#events`: Baskow Talent Agency / Crestron corporate event at the Palms (`assets/photos/corporate-crestron-palms.webp`) + quote. |
| #27 | **702 line live**: (702) 706-2145 as `tel:` in booking panel + mobile Call button + JSON-LD `contactPoint.telephone`. |
| #28 | **Residency accuracy**: reframed the Vegas casino residencies as PAST (Caesars/Boyd), retitled section, fixed "standing residencies" (present tense) in `#billing` and a reviews card; softened ZembAcoustics "ongoing" CT residency. |
| #29 | **Current live dates** added: split section into "Catch us live" (current) + past residencies. Fixed Station Casinos overclaim — it was performances/a regular contract, NOT a residency (hero badge "…residencies" → "…stages"; short bio corrected). |
| #30 | **Bandsintown widget** ("Upcoming shows") replaces hardcoded dates — self-maintaining, artist `id_5846821`, themed to dark/fire palette, lazy-loaded on scroll (IntersectionObserver, off first paint), with a fallback CTA. Plus a "who's who" text key clarifying the acts + specs note: formats "scalable to a 7-piece with a full horn section on request". |
| #31–#33 | **Act logos** added to the who's-who key: Southern Stüe, Johnny B & The Road Dogs (#31); dark-bg Late Shift headline logo replacing the white-bg video version (#32); DSJ logo, restructured to Late Shift featured card + 3-up 4:3 grid for DSJ/Southern Stüe/Johnny B (#33). Logos: `assets/photos/logo-{late-shift-dark,southern-stue,johnny-b-road-dogs,dsj}.webp`. |

### Acts on the calendar (transparency framing — do not misrepresent)
- **Chris Zemba & The Late Shift Band** — headline act, booked through Zemba Music Co.
- **DSJ** (formerly Down South Jukers) — 7-piece horn band Chris FRONTS (lead vocals, lead guitar, MD); bookable as a full horn section UNDER HIS BRAND (not as DSJ) on Zemba contracts.
- **w/ Southern Stüe** (Southern-rock tribute) & **Johnny B & The Road Dogs** (classic rock) — acts Chris GUESTS with on guitar. Not his acts; never present as bookable-through-Zemba.

### ⚠️ HANDOFF — open items for the next agent / owner (Chris)
1. **Populate Bandsintown** — the "Upcoming shows" widget is EMPTY until Chris enters gigs in Bandsintown for Artists. Cannot be done for him (needs his login; sandbox can't reach Bandsintown). Dates he has: Tiki Di Amore (Aug 1, Sep 4, Oct 2, 2026), Lucille's/Red Rock, and the multi-band calendar in his screenshots.
2. **Free hosting NOT yet set up** — the EPK is NOT publicly live; `zembamusicco.com` currently forwards to Linktree. Recommended: **GitHub Pages** (free) — enable via repo Settings → Pages → Source: `main` / root. Chris green-lit nothing yet; he said he can't afford paid hosting, so GitHub Pages is the path.
3. **Named testimonials** — still only "Barnett Wedding Party" (kept intentionally — it encapsulates the whole wedding party via their coordinator; accurate, do NOT change). Optional future upgrade: if Chris gets the wedding coordinator's name + company, it becomes a named industry reference. No quotes/attributions may be invented.
4. **Logo grid mobile check** — the 3-up 4:3 logo cards get small on narrow phones. Chris was offered 2-up / stacked / DSJ-promoted alternatives; awaiting his pick after he eyeballs it live.
5. **Still needs the deployed URL**: Lighthouse mobile run; Google Rich Results Test on the JSON-LD; visual QA of the Bandsintown widget theming (colors set via `data-*`, unverified in a real browser).

### Build/verify commands (for the next agent)
- Rebuild purged CSS: `npm run build:css` (Tailwind auto-discovers `tailwind.config.js`). `sharp` (installed `--no-save`) is used for image → webp conversion.
- Smoke test tokens in `assets/tw.css`: `4 6 13`, `255 122 61`, `Oswald`, `font-weight:600`, `text-wrap:balance` (each must be ≥1).
- ALWAYS rebuild `tw.css` after markup edits or new utility classes silently won't be styled. Watch for non-multiple-of-5 slash-opacity classes (Tailwind drops them).

---

## Navigation + interactive booking form (branch `claude/entertainment-epk-platform-3vg7zf`)

Blueprint: the User's four booking-form reference screenshots (`IMG_4776`–`4779`) + the brief to add
shortcut-tab navigation, clarify the step-by-step copy, and reflect the 7–9-piece / horn-section /
jazz-trio ensemble range. Same single-file coordinated stream; markup edited first, `assets/tw.css`
rebuilt last (Tailwind 3.4.19). Verified with headless Chromium (playwright-core installed `--no-save`
for the check, then reverted out of `package.json`/`package-lock.json` — not a project dependency).

### What shipped

| # | Item | What shipped | Status |
|---|------|--------------|--------|
| 1 | Shortcut-tab navigation | Desktop nav (now `lg:` breakpoint) surfaces the sections a talent buyer scans for: **Videos · Songs · Gallery · Live · Reviews · About · Specs**. Below `lg`, a **hamburger menu** (`#nav-toggle` → `#mobile-menu`) opens a two-column, 12-link full section index — phones previously had *no* section nav at all, only the CTA + bottom bar. Toggle JS swaps the bars/xmark icon, sets `aria-expanded`, closes on link-tap and Escape. | ✅ |
| 2 | Interactive booking form | `#book` form rebuilt from the reference screenshots, **adapted to Chris** (not the reference's "singer Justin"): **Music style** (8 single-select chips, grounded in his real repertoire), **Ensemble to quote** (9 multi-select chips: solo → duo → jazz trio → 4/5-pc → **7-pc and 8–9-pc horn section** + add-vocalists), **Sound & lighting** (3 radios), **Band budget** ($2–4K … $25–30K ladder + "let's discuss"), **reference-photo upload** (`input[type=file] multiple accept=image/*`, multipart POST), phone field, and additional details. Only name/email/date/event-type are required — everything else optional so a buyer can send a 10-second inquiry or spec the whole show. | ✅ |
| 3 | Chip UI | Options are tappable pills built with hidden `peer sr-only` inputs + `peer-checked:` fire fill/border/white-text (verified via CDP: selected chip → `rgba(238,90,32,.15)` bg, `#ee5a20` border, white text). Streamlined, not the reference's plain radio wall. | ✅ |
| 4 | Copy / clarity pass | Tightened the step-by-step service copy: **How booking works** step 1 (now mentions spec-the-lineup / attach-photos, "professional reply within one business day") and step 3 ("lock the final details… load in early", replacing the jargon "advance the details"). **Specs → Performance formats** updated to the full ladder incl. jazz trio and 7–9-piece horn section. Booking-panel pitch rewritten to invite spec'ing style/ensemble/budget/photos or just sending the date. | ✅ |

### Verification performed
- **Headless Chromium (1440px + 390px):** 7 desktop tabs present; hamburger toggles `#mobile-menu` (hidden→shown) with 12 links; form renders 8 music / 9 ensemble / 9 budget / 3 production chips + 1 file input; chip `peer-checked` highlight confirmed after the 150 ms transition settles (CDP `getMatchedStylesForNode` shows the peer-checked rule matches **and** wins the cascade). **Zero JS/page errors** — only the sandbox proxy blocking Google Fonts / Font Awesome / Plausible / Bandsintown, which load normally in a real browser.
- **Class parity:** all new tokens (`peer`, `peer-checked:*`, `peer-focus-visible:*`, `sr-only`, `file:*`, chip borders, budget grid) resolve in the rebuilt `tw.css` (34.8 KB). Only pre-existing comma-bearing arbitrary utilities (clamp/shadow) don't literal-match a naive grep — they compile and render fine.
- **Tag balance:** form 1/1, fieldset 4/4, legend 4/4, section 13/13, nav 1/1. No leftover "singer Justin" / `REPLACE_*` placeholders.
- **Fixed two Tailwind drops before build:** `bg-midnight-950/97` → `/95` (opacity must be a multiple of 5) and an undefined `text-fire-200` (fire palette is 300–700).

### ⚠️ HANDOFF — open items for the next agent / owner (Chris)
1. **Formspree file uploads need a paid plan.** The photo `input[type=file]` posts via the existing fetch handler (multipart), but **attachments only deliver on Formspree's paid tier**. On the free plan the POST with files may be rejected → the handler's error path surfaces the `booking@zembamusicco.com` email fallback (and the field's helper text already says "Can't attach here? Email them to booking@"). To fully enable in-form photos: upgrade Formspree, or switch to **Netlify Forms** (free file uploads) if the site moves to Netlify hosting. No leads are silently lost either way.
2. **New form fields flow straight to the same Formspree inbox** (`xjgnpodo`) as labeled keys: `music_style`, `ensemble` (repeats for multi-select), `production`, `budget`, `photos`, `phone`, `details`. Confirm they read cleanly in the Formspree dashboard once a test submission comes through.
3. **Ensemble honesty guardrail preserved:** the 7-pc / 8–9-pc horn options are legitimate — they're the DSJ horn band Chris fronts, offered *under Zemba Music Co* (per the transparency framing above). Do not relabel them as "DSJ" on the booking side.
4. Everything from the prior handoff (Bandsintown population, GitHub Pages hosting, named testimonials, logo-grid mobile check, deployed-URL Lighthouse/Rich-Results) still stands.

### Build/verify note added this round
- Chip styling relies on `peer-checked:` — when eyeballing a selected chip's color in code, remember the `.transition` class animates it over ~150 ms, so a computed-style read immediately after a click returns the *start* color, not the final one. Wait for the transition (or read the matched rule) before concluding it "doesn't apply".

---

## Booking form moved off Formspree → FormSubmit.co (branch `claude/entertainment-epk-platform-3vg7zf`)

The Formspree form `xjgnpodo` was orphaned — the User has no such form in any account, so nothing
was ever deliverable through it. Per the User's ask ("forward to my email without signing up for a
service"), the form now uses **FormSubmit.co**, which needs **no account and no dashboard**:

- **Action:** `https://formsubmit.co/ajax/booking@zembamusicco.com` (change the inbox by editing the
  email in the action — that's the only place the destination lives now).
- Uses the `/ajax` endpoint so the existing fetch handler keeps the inline success/error card (no
  redirect, works from any host including a not-yet-deployed page). Handler selector changed from
  `form[action*="formspree"]` → `#book form`.
- Config inputs added: `_subject`, `_template=table`, `_captcha=false`; honeypot renamed `_gotcha`
  → `_honey` (FormSubmit's honeypot field).
- **Activation:** the FIRST submission triggers a one-time "activate this form" email to
  `booking@zembamusicco.com`. Until the User clicks that link, nothing is delivered. That click also
  proves the mailbox actually receives mail — if the activation email never arrives, `booking@` isn't
  set up yet and the action should be pointed at the User's known-working Gmail instead (one-line edit).
- **Photos:** the `/ajax` endpoint does not carry file uploads. The photo field's helper text already
  says "email them to booking@". To enable true in-form attachments later, switch to the non-AJAX
  endpoint (`formsubmit.co/booking@…`) with a `_next` redirect back to the deployed URL — that mode
  supports free file attachments but requires the site to be live at a fixed URL.

### ⚠️ HANDOFF — the ONE step the User must do
Submit the live form once, then click the FormSubmit **activation email** in `booking@zembamusicco.com`
(check spam). After that, inquiries are delivered. If the activation email never lands, `booking@`
can't receive mail yet → tell me and I'll repoint the action at the Gmail. Optional later polish:
FormSubmit issues a random alias (`/el/xxxxx`) after activation that hides the raw email from page
source — swap it in to reduce scraping. Also: the form only works from a **served page**, so the EPK
must actually be deployed (GitHub Pages, etc.) for real visitors to reach it.

### Follow-ups shipped after the FormSubmit switch
- **Booking form is LIVE.** The User completed the FormSubmit activation click ("Form Activated" +
  a test inquiry landed in the inbox). No further form setup needed.
- **Single-tap anchor nav.** Fixed the "Book Now needs two taps" bug: lazy images + the events widget
  grew the page mid-scroll so the first tap landed short. A click handler on same-page `#` links now
  re-aligns to the target as the layout settles, with the correction forced INSTANT (plain
  `scrollIntoView({behavior:'auto'})` inherits CSS `scroll-behavior:smooth`, so it must override it).
  Honors reduced-motion.

## Bandsintown widget updated to the User's real artist (`id_14646019`)

The User supplied a new Bandsintown embed (artist `id_14646019`, app-id
`3e4eac79fcd71e8e2e0a45643fe1c75a`) with past dates, lineup, details, start times, ticket buttons, a
"Stay Connected" follow section, and `display-limit=all`. All of those **functional** settings were
applied. The User's pasted **styling** (bright yellow `#f7e409` + Impact font + white dividers + green
ticket buttons) would clash with the EPK, so — per the User's pick of "Match the EPK" — the colors and
font were mapped onto the site palette: transparent background, slate text `#e2e8f0`, fire accents
(`#ff7a3d`/`#ee5a20`), midnight popups `#0c1322`, `Oswald` display font, subtle white dividers, fire
ticket/RSVP/follow CTAs with midnight text, ember `#e0332a` sold-out button, logo hidden. Kept
`data-auto-style="false"` (required for custom colors) and the existing lazy-loader (did NOT add the
eager `<script src>` from the snippet — the loader injects it on scroll). The "Upcoming shows" widget
now self-populates from whatever the User has entered under artist `id_14646019` in Bandsintown for
Artists. If the User later wants the literal yellow/black look, it's a one-block swap.

**Follow-up tweak (User's second snippet):** applied the User's newer display settings — `Brush Script MT`
font, `capitalize` casing, ticket icon on, RSVP icon off, follow section moved to the bottom with header
"Subscribe for updates on upcoming events", BIT logo `topRight`, past dates + lineup **off**. That snippet
again omitted the color set (would revert to Bandsintown's light default = white box on the dark page), so
the EPK dark/fire theming (`auto-style=false` + colors) was kept. Note flagged to the User: `Brush Script MT`
is a casual script face that reads off-brand for a blues/rock EPK and isn't installed on many devices (esp.
iOS), so it will often fall back to a default sans — easy to change on request.

---

_Log updated as each task completes._
