# Chris Zemba EPK — Audit v2 (post-implementation review)
**Reviewed:** `Zemba-epk-post-audit.html` — 1,295 lines / 105 KB (was 882 / 73 KB)
**Method:** same criteria, same checklist, same four lenses as v1. Contrast re-measured. Tailwind config re-compiled and verified locally.
**Known-in-flight per your note:** 702 number, dated calendar entries, permanent domain. Scored as *in progress*, not as failures.

---

## 0. Verdict

**This is a serious revision, not a cosmetic pass.** 31 of the 42 discrete items in v1 shipped, and several shipped better than specified — the honeypot on the form, the YouTube badge on the facades, and making the trust bar a link to `#specs` were all your additions, and all three are correct.

**Score movement:**

| | v1 | v2 |
|---|---|---|
| Tier-1 non-negotiables | 6 / 9 | **9 / 9** *(with one caveat, §2)* |
| Tier-2 differentiators | 1 / 8 | **6 / 8** |
| Measured contrast failures | 2 token classes | **1, decorative-adjacent** |
| Accent-inflation ratio | 0% addressed | **~22% addressed** |
| Live iframes at first paint | 6 | **0** |

**But there is now one item that outranks everything else on this page**, and it did not exist in v1: you deleted the inline `tailwind.config` block and replaced it with `assets/tw.css`. Every brand color, every font family, and every `font-500`/`font-600` on this page lived in that deleted config. **If `tw.css` was not generated from a config carrying those tokens, this page renders with no palette at all** — white background, Times New Roman, no layout. That is the entire audit until it's verified. §2 gives you a config I compiled and confirmed.

---

## 1. Checklist re-scored

### Tier 1 — cost you the booking if missing

| Requirement | v1 | v2 | Note |
|---|---|---|---|
| Above-fold positioning | ✅ | ✅ | Unchanged, still clean |
| Live performance video | ✅✅ | ✅✅ | Now behind facades — same content, none of the weight |
| Named press with links | ✅✅ | ✅✅ | |
| Named venues / properties | ✅✅ | ✅✅ | |
| Tech rider + stage plot + input list | ✅✅ | ✅✅ | |
| Insurance / W-9 / COI | ✅✅ | ✅✅✅ | **Now above the fold.** Best single change in the revision |
| Lead-capturing contact path | ❌ | ✅ | Form shipped. Two wiring defects — §3.3, §3.4 |
| Mobile performance | ❌ | ⚠️ | Iframes and hero solved. **Blocked on `tw.css` verification** |
| Short + long bio, paste-ready | ⚠️ | ⚠️ | Long bio rewritten and improved. **Short bio still missing — and the JS for it is already in the file** (§4.5) |

### Tier 2 — considered → shortlisted

| Requirement | v1 | v2 | Note |
|---|---|---|---|
| Upcoming / recent dates | ❌ | ⚠️ | Section shipped; content is recurring residencies, not dates. Component critique in §5.2 |
| Investment signal | ❌ | ✅ | Budget dropdown, exactly the red-team compromise. Correct call |
| One-sheet PDF | ❌ | ⚠️ | Link shipped and well-labeled. Verify the PDF exists |
| Named testimonials + role/org | ⚠️ | ⚠️ | Unchanged — still two, still "Barnett Wedding Party" |
| High-res photo pack, both orientations | ⚠️ | ⚠️ | Still an unexplained `.zip` |
| Custom domain + branded email | ❌ | ✅ | `booking@zembamusicco.com` throughout, canonical + OG updated |
| Structured data | ❌ | ✅ | Shipped. One semantic error — §5.3 |
| CTA analytics | ❌ | ⚠️ | Plausible loaded; the custom event is inert — §3.3 |

### Tier 3 — polish

Focus states ✅ · print sheet ✅ · reduced motion ✅ · dynamic year + "Updated July 2026" ✅ · `scroll-mt-24` on all sections ✅ · how-booking-works ✅ · `?act=` deep-link ✅ · art-directed `<picture>` crops ❌ · video testimonial ❌

---

## 2. 🚨 Blocking — verify before this URL goes to anyone

### 2.1 — `assets/tw.css` must carry your custom theme

The deleted `<script>tailwind.config = {…}</script>` was the sole definition of `midnight-*`, `fire-*`, `azure-*`, `font-heavy`, `font-display`, and the numeric `font-400/500/600/700` weights. Tailwind's default palette has none of them.

I compiled this config against your markup and confirmed every token emits correctly:

```js
// tailwind.config.js
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        midnight: { 950:'#04060d', 900:'#080d1a', 850:'#0c1322', 800:'#111a2e', 750:'#17223a', 700:'#1e2b48' },
        fire:     { 300:'#ff9d5f', 400:'#ff7a3d', 500:'#ee5a20', 600:'#cf470f', 700:'#a5360a' },
        azure:    { 200:'#bcd4f5', 300:'#8fb8ee', 400:'#5f97e2', 500:'#3d7fd6' },
        ember: '#e0332a'
      },
      fontFamily: {
        heavy:   ['Anton','system-ui','sans-serif'],
        display: ['Oswald','system-ui','sans-serif'],
        sans:    ['Inter','system-ui','sans-serif']
      },
      fontWeight: { '400':'400','500':'500','600':'600','700':'700' }
    }
  }
}
```

```bash
# src/input.css  →  @tailwind base; @tailwind components; @tailwind utilities;
npx tailwindcss@3 -c tailwind.config.js -i ./src/input.css -o ./assets/tw.css --minify
```

**Smoke test — run this after every build:**

```bash
grep -c "4 6 13"      assets/tw.css   # bg-midnight-950  → must be ≥1
grep -c "255 122 61"  assets/tw.css   # text-fire-400    → must be ≥1
grep -c "Oswald"      assets/tw.css   # font-display     → must be ≥1
grep -c "font-weight:600\|font-weight: 600" assets/tw.css   # font-600 → must be ≥1
grep -c "text-wrap:balance\|text-wrap: balance" assets/tw.css  # text-balance → must be ≥1
```

Two notes from compiling it:

- **Use Tailwind ≥ 3.4.** `text-balance` appears on eight headings and doesn't exist before 3.4.
- Your `text-[clamp(1.875rem,1.1rem+3.4vw,3.5rem)]` classes are only valid *because Tailwind normalizes math operators inside `clamp()`* — it emits `1.1rem + 3.4vw` with the whitespace CSS requires. I verified this against 3.4.19. **Don't hand-copy those class strings into a raw `.css` file**; without Tailwind processing them, `1.1rem+3.4vw` is invalid CSS and the whole declaration is dropped. Not a bug today. A landmine if anyone refactors.

### 2.2 — Six asset paths are new in v2. Confirm each exists.

| Path | Consequence if missing |
|---|---|
| `assets/tw.css` | Total style failure |
| `assets/photos/hero-city-street-800.webp` | Silent — phones pull the 1920px file |
| `assets/photos/hero-city-street-1400.webp` | Silent — same |
| `assets/photos/hero-foodie-fest.webp` | Broken facade poster on the festival reel |
| `assets/downloads/chris-zemba-one-sheet.pdf` | 404 from your most committee-forwardable link |
| `assets/photos/portrait-chris.webp` | **Probable typo** — the body uses `portrait-studio.webp` and `portrait-chris` appears only in the JSON-LD. Invalid structured-data image |

```bash
grep -o 'assets/[A-Za-z0-9/_.-]*' Zemba-epk-post-audit.html | sort -u | while read -r f; do
  [ -e "$f" ] || echo "MISSING  $f"
done
```

---

## 3. Defects introduced in v2

### 3.1 — The booking form is squeezed into half the panel it sits in

`#book` → `<div class="relative z-10 p-6 sm:p-8 md:p-14 max-w-2xl">` now contains an eight-field two-column form. At `md:p-14` inside `max-w-2xl`, the content box is **560px**, so each form column is ≈ 270px — and meanwhile the right 45% of a photo-backed hero panel sits empty. You built the best-looking container on the page and then crammed the most important component into the left third of it.

Split the panel:

```html
<div class="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 md:p-12 lg:p-14">

  <!-- Pitch + direct contact -->
  <div class="lg:col-span-5">
    <p class="eyebrow text-[11px] font-display font-600 uppercase text-fire-400 mb-3">Now booking 2026 &amp; 2027</p>
    <h2 class="font-heavy uppercase text-white text-balance
               text-[clamp(2.25rem,1.4rem+3.6vw,4rem)] leading-[0.95] tracking-[-0.01em]">
      Let's put your date <span class="text-forge">on the calendar</span>
    </h2>
    <hr class="neon-rule w-40 mt-6">
    <p class="text-slate-300 mt-6 leading-relaxed text-[15px]">Weddings, corporate galas, private
      parties, festivals, and casino residencies across Las Vegas, Henderson, Boulder City, and
      Southern Nevada.</p>
    <div class="mt-8 space-y-3 text-sm">
      <a href="mailto:booking@zembamusicco.com"
         class="flex items-center gap-3 text-slate-300 hover:text-white transition">
        <i class="fa-solid fa-envelope text-fire-400 w-4"></i> booking@zembamusicco.com
      </a>
      <p class="flex items-center gap-3 text-slate-400">
        <i class="fa-solid fa-location-dot text-fire-400 w-4"></i> Las Vegas, NV
      </p>
    </div>
  </div>

  <!-- Form gets its own glass card and the full remaining width -->
  <div class="lg:col-span-7 rounded-2xl card-surface p-5 sm:p-7">
    <form …>…</form>
  </div>
</div>
```

Also drop `sm:col-span-1` from the six half-width fields — it's the default in a 2-col grid and it's noise.

### 3.2 — Formspree will take the buyer off your site at peak intent

Default Formspree behavior redirects to a formspree.io confirmation page. At the exact moment a talent buyer commits, they land on a third-party page with your branding nowhere in sight.

**Minimum:**
```html
<input type="hidden" name="_next" value="https://zembamusicco.com/thanks.html">
```

**Better — inline success, no navigation:**
```html
<script>
document.querySelector('form[action*="formspree"]').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, btn = f.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error();
    if (window.plausible) plausible('Booking Inquiry');
    f.innerHTML = '<div class="sm:col-span-2 rounded-xl border border-fire-500/30 bg-fire-500/10 p-6 text-center">'
      + '<i class="fa-solid fa-circle-check text-fire-400 text-2xl mb-3"></i>'
      + '<p class="font-display font-600 uppercase tracking-wide text-white">Inquiry received</p>'
      + '<p class="text-[15px] text-slate-300 mt-2">You\'ll hear back within one business day.</p></div>';
  } catch {
    btn.disabled = false;
    btn.textContent = 'Send booking inquiry';
    f.insertAdjacentHTML('beforeend',
      '<p class="sm:col-span-2 text-[13px] text-fire-300 text-center">That didn\'t send. '
      + 'Email <a class="link-underline" href="mailto:booking@zembamusicco.com">booking@zembamusicco.com</a> and I\'ll pick it up there.</p>');
  }
});
</script>
```

The error path matters: a silently failed form is worse than no form, because you don't know it happened.

### 3.3 — The Plausible custom event is inert

You tagged the submit button `plausible-event-name=Booking+Inquiry`. Plausible's class-based tracking is delivered by a **script extension** that detects clicks on tagged elements — and your script is `script.file-downloads.outbound-links.js`, which doesn't include it. The class currently does nothing.

```html
<script defer data-domain="zembamusicco.com"
        src="https://plausible.io/js/script.file-downloads.outbound-links.tagged-events.js"></script>
```

Even with the right script, class-based tracking on a *submitting* button races the navigation. If you take the fetch approach in §3.2, drop the class entirely and keep the explicit `plausible('Booking Inquiry')` call — it fires reliably and you control when.

### 3.4 — Orphaned code: the copy-button JS has no markup

Lines 1274–1286 wire up `.copy-btn` with `data-copy-target`. **Neither selector appears anywhere in the HTML.** The paste-ready short bio (P1.3) never got built; only its plumbing did. Either ship the block or delete the listener — dead code in a single-file deliverable is how the next revision breaks.

```html
<!-- Drop into #about, under the long bio -->
<div class="mt-7 rounded-2xl card-surface p-6">
  <div class="flex items-start justify-between gap-4 mb-3">
    <p class="font-display font-600 uppercase tracking-[0.14em] text-slate-400 text-[11px]">
      Short bio &middot; third person &middot; ready to paste
    </p>
    <button type="button" class="copy-btn shrink-0 text-[11px] font-display font-600 uppercase
                   tracking-wider bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12]
                   px-3 py-1.5 rounded-lg transition" data-copy-target="short-bio">
      <i class="fa-regular fa-copy mr-1.5"></i><span class="copy-label">Copy</span>
    </button>
  </div>
  <p id="short-bio" class="text-[15px] text-slate-300 leading-[1.7]">
    Chris Zemba is a Las Vegas guitarist, vocalist, and bandleader with more than 25 years on stage.
    He performs solo acoustic through full band, blending Blues Rock, R&amp;B, Soul, and Top 40 for
    weddings, corporate galas, private events, and casino residencies. He has held residencies at
    Caesars Entertainment, Station Casinos, and Boyd Gaming properties, and has been featured on
    FOX5 Las Vegas and in the Las Vegas Review-Journal.
  </p>
</div>
```

That's the paragraph a banquet manager pastes into their event listing. Right now they'd write their own.

---

## 4. Not-yet-implemented from v1

### 4.1 — Sticky mobile action bar (§5.6) — **zero occurrences**

Still the largest open conversion gap. On a phone your nav is logo + "Book Now", and once the buyer scrolls past the hero there is no persistent path to the form. Code is unchanged from v1 §5.6; add `pb-24 md:pb-0` to `<body>`.

Since the 702 line isn't live, ship it two-up as **Email / Check your date** and swap Email → Call the day the number activates.

### 4.2 — Nav glass (§4.4) — still `backdrop-blur-md bg-midnight-950/80`

The saturation boost is what separates expensive glass from grey haze. One-line swap:

```html
<nav class="sticky top-0 z-50 border-b border-white/[0.06]
            bg-midnight-950/85 backdrop-blur-xl backdrop-saturate-150
            supports-[backdrop-filter]:bg-midnight-950/60 transition-colors duration-300">
```

Also: `#how` and `#specs` aren't in the nav, and six items at `gap-7` will wrap on a 1280px laptop. Consider dropping "Repertoire" from the nav — it's linked from the body — and adding "Logistics" (`#specs`), which is what a production manager is hunting for.

### 4.3 — Hero CTAs never got the §5.3 button treatment

The gradient / press-state / sweep treatment shipped **only** on the form submit — which sits at the bottom of the page. The hero "Check your date," the nav "Book Now," and the secondary buttons are still flat `bg-fire-500` with `transition`. Your least-seen button is your most polished one. Apply the §5.3 snippet to the hero primary at minimum.

### 4.4 — `.bleed-wide` (§2.4) — not implemented

On Stage is still boxed at 1152px. Lower priority than everything above, but it's the one section where width *is* the argument.

### 4.5 — Accent inflation — ~22% addressed

Measured: **50 icons still `text-fire-400`**, 14 demoted to `text-slate-400` + `group-hover:text-fire-400`.

And above the fold it got *worse*: the trust bar added four more fire icons directly beneath three fire hero chips and a fire CTA — **eight fire elements in the first viewport.** The trust bar's job is calm institutional authority. Fire reads as excitement, which is the wrong register for insurance and W-9s.

```html
<!-- Trust bar icons → neutral. Keep the separators fire, at low opacity. -->
<li class="flex items-center gap-2"><i class="fa-solid fa-shield-halved text-slate-400"></i> Fully insured</li>
```

Then work down the remaining 50 with the group-hover pattern you've already established. Highest-value targets: the specs list icons, repertoire bullets, and the social grid.

### 4.6 — Named testimonials (P1.4) — unchanged

Content-bound, so no code fix. But it is now the weakest block on a page whose every other proof element is third-party verifiable. Three asks, by email, this week: the Bally's entertainment contact, the Primm/Extreme Live promoter, and one wedding planner. Title + property, one sentence each.

---

## 5. Reviewing the *new* sections against the original criteria

### 5.1 — Trust bar ✅ Best change in the revision

Above the marquee, clickable to `#specs`, honest content, `aria-label` on the wrapper. Contrast measures **13.06:1**. Only note is the icon color in §4.5.

### 5.2 — Dates section ⚠️ The component is fighting its own content

The row design is anchored by a 56px date badge — that's the visual logic that makes a dates list scan. With no dates yet, the badge reads **FRI / LIVE**, **WKLY / LIVE**, **RES / LIVE**: the word "LIVE" stacked three times vertically, and "RES" and "WKLY" aren't information anyone can act on. Three of three rows are also the same act, which quietly contradicts the "three acts, one brand" story two sections up.

Until real dates exist, make the badge carry information that's actually true:

```html
<div class="flex items-center gap-5 px-5 py-4 md:px-6 md:py-5 hover:bg-white/[0.03] transition">
  <div class="shrink-0 w-16 text-center">
    <p class="font-heavy text-xl leading-none text-white uppercase">Fri</p>
    <p class="font-display font-600 uppercase text-[10px] tracking-[0.18em] text-fire-400 mt-1">Weekly</p>
  </div>
  <div class="min-w-0 flex-1">
    <p class="font-display font-600 uppercase tracking-wide text-slate-100 text-sm">Indigo Lounge &middot; Bally's Las Vegas</p>
    <p class="text-[13px] text-slate-400 mt-0.5">Chris Zemba &amp; The Late Shift Band &middot; No cover</p>
  </div>
  <span class="hidden sm:inline-flex shrink-0 text-[11px] font-display font-600 uppercase tracking-wider
               bg-fire-500/10 text-fire-300 border border-fire-500/20 px-3 py-1 rounded-full">Public</span>
</div>
```

Day on top, cadence underneath, act in the sub-line. Reads as a residency schedule instead of a dates list with the dates missing. Swap in `AUG / 15` badges as one-offs land, and add at least one Chris Zemba Band or ZembAcoustics row so all three acts appear.

### 5.3 — JSON-LD ✅ shipped, one semantic error

You've modeled Late Shift Band and ZembAcoustics as `alternateName` of The Chris Zemba Band. Those aren't aliases — they're three distinct acts with different lineups, repertoire, and rooms, which is the whole thesis of your `#acts` section. Search engines will collapse them into one entity.

```json
{
  "@type": "Organization",
  "@id": "https://zembamusicco.com/#org",
  "name": "Zemba Music Co",
  "url": "https://zembamusicco.com/",
  "founder": { "@id": "https://zembamusicco.com/#chris" },
  "areaServed": { "@type": "AdministrativeArea", "name": "Las Vegas Valley, Nevada" },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Booking",
    "email": "booking@zembamusicco.com",
    "availableLanguage": "English"
  },
  "subOrganization": [
    { "@type": "MusicGroup", "@id": "https://zembamusicco.com/#band",
      "name": "The Chris Zemba Band",
      "genre": ["Blues Rock","R&B","Soul","Top 40"],
      "member": { "@id": "https://zembamusicco.com/#chris" } },
    { "@type": "MusicGroup", "@id": "https://zembamusicco.com/#lateshift",
      "name": "Chris Zemba & The Late Shift Band",
      "genre": ["Classic Rock","Blues","Soul","Funk","Jazz"],
      "member": { "@id": "https://zembamusicco.com/#chris" } },
    { "@type": "MusicGroup", "@id": "https://zembamusicco.com/#acoustic",
      "name": "ZembAcoustics",
      "genre": ["Acoustic","Pop","Soul"],
      "member": { "@id": "https://zembamusicco.com/#chris" } }
  ]
}
```

Also fix the `portrait-chris.webp` reference (§2.2), and validate at `search.google.com/test/rich-results` before publishing.

### 5.4 — How booking works ✅

Numbered markers are correct here — this genuinely is a sequence, so the numbers carry information rather than decorating. Content answers the real corporate objection (paperwork). No notes.

### 5.5 — Media facades ✅✅

All five YouTube plus SoundCloud, `youtube-nocookie`, keyboard handlers, `aria-label` reused as iframe title, a YouTube badge so the buyer knows what a click loads. Better than the spec. First paint went from six iframes to zero.

One small thing: the reduced-motion rule `.group:hover img { transform: none !important }` also freezes the facade poster scale. That's fine — but it means the *only* hover affordance left for reduced-motion users is the overlay lightening. Add a border cue:

```css
@media (prefers-reduced-motion: reduce) {
  .yt:hover, .sc:hover { border-color: rgba(238,90,32,.5); }
}
```

---

## 6. Color & contrast — re-measured

| Element | v1 | v2 | Verdict |
|---|---|---|---|
| Venue marquee | 3.90 ❌ | **10.66** | Fixed |
| Footer copyright | 2.67 ❌ | **7.90** | Fixed |
| Trust bar (new) | — | **13.06** | ✅ |
| Card body on `card-surface` | 7.24 | **13.06** | Big improvement |
| **"Updated July 2026"** (`slate-500`, 11px) | — | **4.26** | ❌ **fails AA** |
| Form placeholders (`slate-500` on `white/5`) | — | **3.92** | ⚠️ below AA |

`text-slate-600` is fully eliminated. Two small residuals:

```html
<!-- footer -->
<p class="text-slate-400 text-[11px] mt-1 uppercase tracking-[0.16em] font-display">Updated July 2026</p>

<!-- form inputs — placeholders are the only in-field guidance you give -->
placeholder:text-slate-400
```

Everything else still on `slate-500` is genuinely decorative — separator glyphs, external-link arrows — and stays.

**Surface rollout is partial:** `card-surface` is used 9 times, flat `bg-midnight-900` still 35 times. The gradient-glass treatment is doing its job where it's applied; the press cards, the About formats stack, and the spec rows are still flat paint next to it, which makes the inconsistency visible. Finish the pass or roll it back — half-applied reads as an accident.

---

## 7. Red-team pass

**🎤 Talent buyer — "The dates section makes it worse, not better."**
**Lands.** A buyer who scrolls to "Live dates & residencies" expecting a date and finds `RES / LIVE` learns something specific: this act doesn't keep a current calendar. That's a sharper negative than having no section. Either populate two real dates this week or retitle the section **"Where to catch us live"** and use the §5.2 row structure, which promises a residency schedule and delivers one. Don't leave a dates component with no dates in it.

**📋 Corporate planner — "Nothing tells me you've done my event."**
**Lands, and I missed it in v1.** Every proof element on this page is a *venue* credential — casinos, lounges, flyers, a residency. Your `#events` section claims award dinners, brand launches, and conference after-parties, and there is not one photo, quote, or named client backing that claim anywhere. A planner books the person who has demonstrably done their event type. Two corporate photos and one named corporate reference would be worth more than any remaining item in this report. **This is now the highest-value content gap on the page, ahead of testimonials generally.**

**⚡ Performance engineer — "You can't call it fast until you've measured it."**
**Lands.** The architecture is right — zero iframes, preloaded hero, static CSS — but every one of those is a *prediction*. Run Lighthouse mobile on the deployed URL before you send this to anyone, and specifically check that `tw.css` is under ~25 KB (if it's 3 MB, the build wasn't purged, which is the most common way this exact setup fails).

**🎨 Brand designer — "You're over-correcting on the accent."**
**Partially lands, and I'll narrow my own note.** Demoting all 50 fire icons to slate would leave a very grey page — the fire *is* the brand, straight off the logo. The real problem isn't the count, it's the absence of a rule: fire currently means nothing because it marks eyebrows, decoration, structure, and action identically. **Revised recommendation:** keep fire on anything that signals *credibility or action* (trust chips, CTAs, stat numbers, the gradient word). Demote only *structural* icons — the ones sitting inside a `bg-fire-500/15` tile, where the tile already carries the color and the icon is doubling up. That's roughly 20 elements, not 50, and it's a rule you can apply without judgment calls.

**One more, unprompted:** you've written `§2.2`, `§5.4`, `§7` into your HTML comments as references to my v1 report. Great for this week, meaningless to you in eight months and confusing to anyone else who opens the file. Convert them to what they mean — `<!-- Click-to-load facade: keeps iframes off first paint -->`. Comments should explain the decision, not cite the memo.

---

## 8. Ship order v3

| # | Task | Effort | Blocking? |
|---|---|---|---|
| 1 | Verify `tw.css` carries the custom theme (§2.1) | 20 m | **Yes — nothing else matters first** |
| 2 | Asset existence check, six paths (§2.2) | 15 m | **Yes** |
| 3 | Formspree `_next` or fetch handler + error path (§3.2) | 45 m | **Yes** |
| 4 | Plausible `tagged-events` script or manual call (§3.3) | 10 m | Yes |
| 5 | Lighthouse mobile on deployed URL *(red team)* | 20 m | Yes |
| 6 | Sticky mobile action bar (§4.1) | 30 m | No — highest non-blocking |
| 7 | Booking panel two-column split (§3.1) | 45 m | No |
| 8 | Short bio block, un-orphan the JS (§3.4) | 20 m | No |
| 9 | Dates rows restructured, one act per row (§5.2) | 30 m | No |
| 10 | Trust-bar icons neutral + structural-icon demotion (§4.5) | 40 m | No |
| 11 | Nav glass + `#specs` in nav (§4.2) | 15 m | No |
| 12 | Hero CTA gets the §5.3 treatment (§4.3) | 20 m | No |
| 13 | JSON-LD three-act restructure (§5.3) | 30 m | No |
| 14 | Footer + placeholder contrast (§6) | 10 m | No |
| 15 | Finish or revert the `card-surface` rollout (§6) | 45 m | No |
| 16 | **Two corporate photos + one named corporate reference** *(red team)* | content | No — highest value on the list |

Items 1–5 are roughly two hours and they're the difference between a page that works and a page that silently doesn't. Item 16 is the one that changes what you can charge.

---

## 9. What you got right that I want on the record

Because a second audit reads as a list of complaints, and that's not the shape of this revision:

- The trust bar is better than what I specified — making it a link to `#specs` was your call and it's correct.
- The honeypot, `autocomplete` attributes, and real `<label>` elements on the form are details most people skip. Placeholder-only forms are an accessibility failure and you avoided it.
- The budget dropdown implements the red-team compromise precisely: triage data, no public anchor.
- The YouTube badge on the facades solves a problem I didn't flag — a buyer needs to know a click loads a third-party player before they click it.
- `<span id="yr">2026</span>` with JS override is correct progressive enhancement; the year is right even with JS disabled.
- Cutting `neon-rule` from ten uses to two, and `glow-fire` from seven to four, took discipline. Those were your signature devices and you let them go.

The gap between v1 and v2 is larger than the gap between v2 and finished.

- Do not schedule automated check-ins, loops, or triggers to monitor PR merges.


