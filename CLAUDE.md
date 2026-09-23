# CLAUDE.md

Guidance for Claude Code working in this repository. Deployed to karachiwala.dev via Vercel on push to `master`.

## Commands

```bash
npm run dev             # Dev server
npm run build           # Production build
npm start               # Serve the production build
npm run talks:images    # Process talks-inbox/ into public/talks/ + lib/talks.json
npm run talks:missing   # List talks that still have no photo
npm run talks:find -- <words>   # Search all talks; prints the filename to use
npm run og:images       # Rebuild every social preview into public/og/
```

**Adding a talk photo:** drop it in `talks-inbox/` named after the talk's date
(`2025-05-24.jpg`), or its id where two talks share a date (`62.jpg`), then run
`npm run talks:images`. It crops square at 256px, re-encodes and sets the `image`
key. Accepts HEIC. `talks-inbox/` is gitignored — empty it after the run.

**Social previews:** `npm run og:images` rebuilds all 58 into `public/og/` plus
`lib/og-images.json`, by hand like `talks:images`, and the output is committed.
Landscape art (ratio 1.5–2.4) is used where a page has it; everything else gets
a typeset card. Rerun after adding a page or changing a title. Needs `sips`.

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
| **Talks** | `lib/talks.json` | 85 entries, newest first. 38 carry a photo. The 2023–2026 AI sessions were imported from the Google Developer Expert activity export; frontmatter contract is in `components/talk-item.js` |
| **Podcast / Books / Newsletter** | RSS at build time | Anchor.fm, Goodreads, Substack. Each fetcher swallows errors and returns `[]` so a feed outage cannot fail the build |

Markdown is parsed by a small local `matter()` (regex + the `yaml` package) rather than
gray-matter, which pinned a vulnerable js-yaml 3.x. Rendering is remark + remark-html.

### Key files

- `lib/site.js` — **single source of identity.** Metadata, sitemap and JSON-LD all read from
  it so they cannot drift. Change names, URLs and offers here, nowhere else.
- `components/seo.js` — per-page title, description, canonical, OG, Twitter, and a linked
  schema.org `@graph`. `Person`/`WebSite` have stable `@id`s page nodes reference rather
  than restate. Every page must render `<Seo>` with an `ogKey`; `Layout` emits no meta.
- `components/layout.js` — fixed left rail, collapses to a header at 900px. Scroll-spy uses
  rAF, not IntersectionObserver: sections exceed the viewport so several intersect at once.
- `pages/writing/[slug].js` — articles, with `Article` schema and reading time.
- `pages/sitemap.xml.js` — generated from `writing/` and `posts/`, never hand-edited.

## Conventions

- **British English** (`lang="en-GB"`). Em dashes are house style here; the LinkedIn
  drafts in `notes/` avoid them on purpose.
- **Accessibility is a gate.** Every page scores 100 on all four Lighthouse categories
  on desktop (mobile Performance sits at ~93). Verify before shipping.
- **No third-party scripts.** 68 bytes of third-party code, LCP ~124ms. Embeds would
  undo that — see `notes/seo-geo-strategy.md` §7. The one sanctioned exception is the
  **click-to-load facade** in `components/linkedin-video.js`: a local poster ships, the
  iframe is injected on click (0 third-party requests on load, CLS 0). Any future embed
  uses that pattern or none.
- **Images ship at the size they render at.** Lighthouse's mobile run simulates
  slow 4G, so total byte weight sets LCP more than anything on the main thread.
  The homepage was 485 KiB because `profile.jpg` was 768px for a 144px box and
  the logos were 24-bit PNGs up to 6x oversized; resizing and palette-quantising
  took it to 294 KiB and mobile Performance from 93 to 97. Check an asset's
  pixel size against its rendered size before adding it. Two traps: the logo wall
  is greyscaled by CSS but `:hover` restores colour, so do **not** bake greyscale
  in; and `contour.svg` is a base64 raster in an SVG wrapper.
- `notes/` and `design/` are gitignored working material and must stay unpublished.

## Known issues

- `lib/goodreads.js` carries a `key=` in the feed URL. It looks like a secret and is not:
  the shelves are public, and the feed returns byte-identical bytes with the real key, no
  key, or a junk key. Nothing to rotate (Goodreads retired its API in Dec 2020).
- The site says "led engineering" at Sastaticket; LinkedIn says CTO. Pick one.
- Talk photos are 256x256 and the originals are gone, so mobile cards (~348px) upscale
  and look soft. Re-pulling from Advocu is the only fix.
- 47 of the 85 talks still have no photo; `npm run talks:missing` lists them.
- No `remark-gfm`, so markdown tables in `writing/*.md` render as literal pipes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

Breaking changes from your training data. Read `node_modules/next/dist/docs/` before writing code.

Re-added by `next dev` (`node_modules/next/dist/server/lib/generate-agent-files.js`); commit it with your work to keep the tree clean.

<!-- END:nextjs-agent-rules -->
