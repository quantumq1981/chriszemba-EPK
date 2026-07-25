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

## Phase 2 — Visual hierarchy & perceived rate — NOT STARTED (gated behind Phase 1)

## Phase 3 — Shortlisting & shelf life — NOT STARTED (content-bound, coordinate with Chris)

---

_Log updated as each task completes._
