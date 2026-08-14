# CLAUDE.md

Guidance for Claude Code working in this repository. Deployed to karachiwala.dev via Vercel on push to `master`.

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm start        # Serve the production build
```

`node`/`npm` are not on the non-interactive PATH. Prefix commands with:
`export PATH="$HOME/.nvm/versions/node/v24.11.1/bin:$PATH"`

## Architecture

Next.js 16 (Pages Router) + React 19. Everything is prerendered — SSG for pages,
ISR (`revalidate: 3600`) on the homepage so external feeds do not freeze at deploy time.
The only non-static route is `/sitemap.xml`, which is edge-cached for a day.

### Content sources

| Source | Path | Notes |
|---|---|---|
| **Current writing** | `writing/*.md` | The active corpus. Frontmatter contract is documented in `lib/writing.js` |
| **Blog archive** | `posts/*.md` | 2009–2015, kept for the record. Deliberately low priority in the sitemap |
| **Talks** | `lib/talks.json` | ⚠️ Ends Feb 2023; the AI-era talks are still missing |
| **Podcast / Books / Newsletter** | RSS at build time | Anchor.fm, Goodreads, Substack. Each fetcher swallows errors and returns `[]` so a feed outage cannot fail the build |

Markdown is parsed by a small local `matter()` (regex + the `yaml` package) rather than
gray-matter, which pinned a vulnerable js-yaml 3.x. Rendering is remark + remark-html.

### Key files

- `lib/site.js` — **single source of identity.** Metadata, sitemap and JSON-LD all read from
  it so they cannot drift. Change names, URLs and offers here, nowhere else.
- `components/seo.js` — per-page title, description, canonical, OG, Twitter, and a linked
  schema.org `@graph`. `Person` and `WebSite` have stable `@id`s that page nodes reference
  rather than restate. Every page must render `<Seo>`; `Layout` no longer emits meta.
- `components/layout.js` — fixed left rail, collapses to a header at 900px. Scroll-spy uses a
  rAF scroll handler, not IntersectionObserver: sections are taller than the viewport, so
  several intersect at once and the marker sticks.
- `pages/writing/[slug].js` — articles, with `Article` schema and reading time.
- `pages/sitemap.xml.js` — generated from `writing/` and `posts/`, never hand-edited.

## Conventions

- **British English** throughout (`lang="en-GB"`). Em dashes are house style on the site;
  the LinkedIn drafts in `notes/` avoid them on purpose.
- **Accessibility is a gate, not a nice-to-have.** Every page scores 100 on all four
  Lighthouse categories. Verify before shipping; do not regress it.
- **No third-party scripts.** The site loads 68 bytes of third-party code and has an LCP of
  ~124ms. Embeds (Instagram, Strava, analytics widgets) would undo that — see
  `notes/seo-geo-strategy.md` §7 for the reasoning and the cheap alternative.
- `notes/` and `design/` are gitignored working material and must stay unpublished.

## Known issues

- `lib/goodreads.js` has an API key in the feed URL, in a public repo. Worth rotating.
- `lib/talks.json` ends Feb 2023, so the talks section argues against the current positioning.
- The site says "led engineering" at Sastaticket; LinkedIn says CTO. Pick one.
