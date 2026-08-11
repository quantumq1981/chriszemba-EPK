# chriszemba-EPK

Electronic press kit for Zemba Music Co (Chris Zemba).

- `index.html` — the full EPK and the **single source of truth**.
- `songs.html` — filterable repertoire directory.
- `venues/index.html` — generated "venues, bars & restaurants" cut (agent-ready).
- `solo-duo/index.html` — standalone **ZembAcoustics** solo & duo acoustic page (its own sub-brand,
  logo, photos, and azure theme; hand-maintained, not generated from `index.html`). Agent-ready.
- `epk.json` — generated public sync manifest (from `src/site.json`): booking contact, the venue-cut
  URL, and asset download links. The Setlist-Generator venue-outreach app fetches it to stay in sync.
- Audience cuts are generated from `index.html`; edit content once, run `npm run build`.

### Outreach integration

Links the outreach app sends carry `?act=<format>&track=<venue-token>` (older links: `?ref=<slug>`)
plus `utm_*`. The EPK captures those on load: it fires a Plausible **EPK Visit** custom event naming
the pitched venue, persists the tag, and injects hidden `epk_venue` / `epk_act` / `epk_campaign`
fields into the booking form — so a submitted inquiry says exactly which venue/outreach produced it,
and the **Booking Inquiry** goal is attributed too. No backend required.

```bash
npm install
npm run build     # regenerate audience cuts from index.html + rebuild assets/tw.css
```

See [HOSTING.md](HOSTING.md) for how the cuts are built and how to wire up subdomains.
