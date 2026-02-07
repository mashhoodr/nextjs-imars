# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm start        # Start production server
```

## Architecture

Personal portfolio site built with Next.js 14 using Pages Router and Static Site Generation (SSG).

### Data Sources

- **Local markdown posts**: `posts/*.md` - parsed with gray-matter + remark
- **External RSS feeds** (fetched at build time via `rss-to-json`):
  - Podcast: Anchor.fm RSS
  - Books: Goodreads RSS
  - Newsletter: Substack RSS
- **Static JSON**: `lib/talks.json` - conference talks data

### Key Files

- `pages/index.js` - Homepage aggregating all data sources via `getStaticProps`
- `pages/posts/[id].js` - Dynamic routes for markdown blog posts
- `lib/posts.js` - Markdown file reading and parsing utilities
- `lib/podcast.js`, `lib/goodreads.js`, `lib/substack.js` - RSS feed fetchers
- `components/layout.js` - Shared layout with site metadata

### Data Flow

All pages use `getStaticProps` for SSG. External feeds are fetched at build time, so rebuilds are needed to update podcast/books/newsletter content.
