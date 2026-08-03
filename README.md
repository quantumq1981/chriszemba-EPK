# chriszemba-EPK

Electronic press kit for Zemba Music Co (Chris Zemba).

- `index.html` — the full EPK and the **single source of truth**.
- `songs.html` — filterable repertoire directory.
- `venues/index.html` — generated "venues, bars & restaurants" cut (agent-ready).
- Audience cuts are generated from `index.html`; edit content once, run `npm run build`.

```bash
npm install
npm run build     # regenerate audience cuts from index.html + rebuild assets/tw.css
```

See [HOSTING.md](HOSTING.md) for how the cuts are built and how to wire up subdomains.
