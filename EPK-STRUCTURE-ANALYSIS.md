# Chris Zemba EPK — Structure Analysis & Optimization

**Scope:** the full markdown corpus (`README`, `PROGRESS`, `HOSTING`, `EPK-AUDIT`, `EPK-AUDIT-v2`)
and the live static site (`index.html`, `songs.html`, `venues/`, `solo-duo/`).
**Lens:** what a booking agent, corporate/gala planner, entertainment director, club owner, or
festival buyer does in the first 30 seconds on this kit — and where the current structure makes
that harder than it needs to be.
**Bottom line up front:** the *content* is top-decile and the *conversion mechanics* are done
(live form, purged CSS, facades, structured data, a11y). The remaining leverage is not more
polish — it is **audience routing and funnel architecture**.

---

## 1. Current state (from the markdown record)

Three formal audit cycles are logged in `PROGRESS.md` against `EPK-AUDIT.md` / `EPK-AUDIT-v2.md`.
Everything revenue-critical those audits flagged has shipped:

| Area | State |
|---|---|
| Lead capture | ✅ Live FormSubmit form (activated), inline success/error, no redirect |
| Performance | ✅ Tailwind purged to a static `assets/tw.css` (~43 KB), 0 iframes at first paint (facades), hero `<img>`+srcset+preload |
| Trust / compliance | ✅ Trust bar above the fold (insured · W-9 · COI · stage plot) |
| Proof | ✅ RJ/FOX5 press, named venues, on-property flyers, **corporate proof** (Baskow / Palms) |
| Structured data | ✅ `Organization` + 3 `MusicGroup` sub-orgs + `FAQPage` (all parse clean) |
| Shelf life | ✅ Dynamic year, "Updated" line, Bandsintown widget replacing hardcoded dates |
| Architecture | ✅ **Single source → generated cuts** (`build.mjs` + `src/variants.json`); `/venues/` cut live |

**The engineering asset that matters most here** is the build system: `index.html` is the single
source of truth, and audience-specific versions are *derived* from it by tagging sections with
`data-audience` and adding a manifest entry. Content edited once, zero drift. Only one cut
(`venues`) existed before this pass — the machine was built and barely used.

---

## 2. Structure & navigation evaluation

### 2.1 Section inventory (full EPK, document order)
`events → acts(Videos) → stage(Gallery) → dates(Live) → billing(marquee) → press → about →
songs → specs(Logistics) → reviews → how(booking) → book`

Twelve sections. Each is individually strong. The problem is not any section — it is that **every
persona gets all twelve, in one order, and must self-navigate to the three or four that decide
their booking.**

### 2.2 The five real navigation defects

1. **No in-body path to the tailored cuts.** `/venues/` and `/solo-duo/` are strong, purpose-built
   pages, but the full EPK never linked to them for a *human* — they appeared only in JSON-LD and
   machine manifests. A booking agent landing on `/` had no way to reach the version built for them.
2. **`solo-duo/` was orphaned.** It links *into* the EPK; the EPK never linked *out* to it. The
   ZembAcoustics sub-brand was effectively invisible unless someone typed the URL.
3. **`Specs`/Logistics sits last in the nav** — yet COI, W-9, stage plot, and input list are the
   *first* thing a production manager, corporate planner, or entertainment director shortlists on.
4. **Cross-page nav is inconsistent.** `songs.html` has a proper "← Full EPK" backlink; `solo-duo/`
   had only `#book`/`#songs` — a dead end with no route back.
5. **The Bandsintown block had no fallback for the empty/blocked case.** A live "Upcoming shows"
   heading over an empty (or ad-blocked) third-party widget is the exact "dated site = not currently
   working" signal the audits warned about. (The owner has since populated the calendar, so the live
   widget now renders real dates; the fix below is the safety net for the day it empties out or a
   visitor's ad-blocker kills the widget script.)

---

## 3. Recommendations (implemented in this pass)

All five are **code**, shipped on this branch. Remaining owner-account steps (Linktree Pro settings;
deployed-URL QA) are the only handoffs, listed in §5 and `CLAUDE.md`.

### R1 — Persona router + Corporate & Wedding cuts *(highest impact)*
The build system gives audience cuts for free; this pass adds the two lanes the brief names.
- **New cuts** `/corporate/` and `/weddings/`, generated from `index.html` (no forked content):
  - *Corporate* leads on proof + compliance + logistics + how-booking; budget dropdown kept for
    triage (the red-team compromise from `EPK-AUDIT.md §7`).
  - *Weddings* reframes the hero to ceremony → cocktail → reception and surfaces ZembAcoustics.
- **"Who's booking?" router** on the full EPK (under the capability strip): four cards —
  Corporate & galas · Weddings · Venues/bars · Casinos & festivals — each routing to the trimmed
  version. It is `data-audience="full"`, so it never appears *inside* a cut (a cut is already aimed).
- **Why it matters per persona:** an agent forwarding a link to a corporate client sends
  `/corporate/`, not a 12-section everything-page; a club owner gets `/venues/`; the buyer sees a
  kit that looks *built for their event*, which is the single strongest shortlisting signal.

### R2 — Information architecture & cut discovery
- ZembAcoustics `/solo-duo/` is now linked from its act panel on the full EPK ("See the full
  ZembAcoustics solo & duo page →") — the orphan is connected.
- `/solo-duo/` gained a "← Full EPK" backlink (desktop tabs + mobile menu) for nav parity with
  `songs.html`.
- The router doubles as human-facing cut discovery, closing the "every visitor gets everything" gap.
- *Deliberately not done:* physically reordering `index.html` sections. The build keeps document
  order, so reordering the source would reorder every cut. Routing solves "right content first"
  without forking; per-cut emphasis is achieved by *which* sections a cut includes + hero copy.

### R3 — Bandsintown: graceful empty-state + retention wiring
- A branded **residency fallback card** ("Standing residencies & private dates — ask for the
  calendar" + a *Track on Bandsintown* CTA) now replaces the bare widget box whenever the widget
  renders **zero events** *or* the third-party script is blocked/fails (ad blockers are common).
- Detection: the lazy loader watches `#bit-widget-card` (MutationObserver) for a real dated event
  row; if none appears within a bounded window, it hides the empty widget and reveals the fallback.
  Best-effort by design — flagged for an eyeball on the deployed URL.
- The *Track* CTA (deep-linked with UTM) is the fan-retention lever of Bandsintown for Artists — it
  converts a page view into a follower who is notified of every future date.

### R4 — Linktree funnel inversion
The funnel was invertible: Linktree read as the hub and the EPK as a link, and the "Connect" block's
primary card was a **self-referential** "Official Website → zembamusicco.com" (circular on-site).
- The Connect block is now explicitly the **fan spoke** ("For fans · follow & stream"), with the
  circular self-link replaced by an outbound **Linktree "all links"** card. Booking stays the page's
  own `#book`/contact path — pros are never routed into a link aggregator.
- All human-facing Linktree links carry `utm_source=epk` so the EPK → Linktree hand-off shows up in
  the existing Plausible outbound-link tracking. JSON-LD `sameAs` links stay clean (canonical).

### R5 — Cross-surface consistency
- `src/site.json` (→ `epk.json`) now publishes `corporateCut` / `weddingsCut` so the
  Setlist-Generator outreach app and the EPK stay in sync — one source of truth, no drift.

---

## 4. Integration strategy — Bandsintown & Linktree Pro

These two tools do different jobs; the mistake is treating either as the booking funnel.

| Tool | Correct role | What this pass wired | Owner action (§5) |
|---|---|---|---|
| **Bandsintown for Artists** | *Fan retention + proof-of-activity.* A populated calendar signals a working act; the Track button builds a notified following. | Themed widget + defensive empty-state safety net + tracked Track CTA. | ✅ **Populated** — owner maintains live dates (`id_14646019`); the widget renders them and self-updates. The empty-state only appears if the calendar ever empties or the script is blocked. |
| **Linktree Pro** | *Fan aggregator* for casual social traffic (IG/TikTok bio link). Not the pro booking path. | Inverted the funnel: EPK is the hub, Linktree the fan spoke, links tracked. | Pin the EPK/booking link to the **top** of Linktree; enable Linktree Pro lead-capture for fan inquiries. (`zembamusicco.com` → EPK: ✅ done.) |

**The principle:** the EPK is the professional funnel (agents, planners, directors, club owners →
`#book`). Bandsintown and Linktree are fan-facing surfaces that should *feed* the EPK, not compete
with it. Both now point inward for pros and outward for fans, with the hand-off measured.

---

## 5. Owner handoffs (require account access — cannot be done in-repo)

1. **Linktree Pro:** pin EPK/booking to the top; enable lead-capture. (Domain resolution —
   `zembamusicco.com` → EPK — is done.)
2. **Deployed-URL QA:** Lighthouse mobile and Google Rich Results on the JSON-LD (no browser in the
   build sandbox).
3. **Named testimonials** (a standing content gap from the audits): a third named reference —
   entertainment director or catering/banquet manager, title + property — is the last high-value
   item. No quote or attribution may be invented; supply one and it drops in.

**Already done:** Bandsintown calendar is populated (`id_14646019`, live dates render — the
empty-state safety net stays dormant); `zembamusicco.com` resolves to the EPK.

---

## 6. Verification performed this pass

- `npm run build` regenerates `venues/`, `corporate/`, `weddings/`; console confirms kept/dropped
  sections per cut (corporate drops `dates`; weddings drops `dates`+`billing`).
- `assets/tw.css` smoke tokens (`4 6 13`, `255 122 61`, `Oswald`, `font-weight:600`,
  `text-wrap:balance`) all ≥1; new router utility (`lg:grid-cols-4`) purged in.
- No dead in-body anchors to dropped sections in any cut; router excluded from all cuts.
- All JSON-LD blocks parse on all four pages; per-cut `variant` hidden field + budget handling correct.
- **Not verifiable in-sandbox (no browser):** live Bandsintown render + empty-state swap, mobile
  Lighthouse — carried to §5.
