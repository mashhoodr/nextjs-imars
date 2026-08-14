import fs from 'fs'
import path from 'path'
import { parse as parseYaml } from 'yaml'
import { remark } from 'remark'
import html from 'remark-html'

/**
 * Current writing, as opposed to `lib/posts.js`, which serves the 2009–2015
 * archive. Kept separate on purpose: the archive is deliberately low-priority
 * and low-signal, and mixing the two would put Ruby gem posts from 2013 in the
 * same collection as the current work.
 *
 * Frontmatter contract:
 *   title       required
 *   date        required, YYYY-MM-DD, the canonical publication date
 *   updated     optional, YYYY-MM-DD. Answer engines weight freshness, so this
 *               is worth setting honestly when a piece is revised
 *   description required, used for meta description and the listing excerpt
 *   tags        optional array, rendered and used for `keywords` in JSON-LD
 *   draft       optional, true keeps it out of every listing and the sitemap
 */
const writingDirectory = path.join(process.cwd(), 'writing')

const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function matter(fileContents) {
  const match = FRONTMATTER.exec(fileContents)
  if (!match) return { data: {}, content: fileContents }
  return {
    data: parseYaml(match[1]) ?? {},
    content: fileContents.slice(match[0].length),
  }
}

function slugsOnDisk() {
  if (!fs.existsSync(writingDirectory)) return []
  return fs
    .readdirSync(writingDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

function read(slug) {
  const fullPath = path.join(writingDirectory, `${slug}.md`)
  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'))
  return { slug, data, content }
}

/** Listing metadata, newest first. Drafts are excluded everywhere. */
export function getAllWriting() {
  return slugsOnDisk()
    .map((slug) => {
      const { data } = read(slug)
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? null,
        updated: data.updated ?? null,
        description: data.description ?? '',
        tags: data.tags ?? [],
        draft: Boolean(data.draft),
        source: sourceOf(data),
        references: referencesOf(data),
      }
    })
    .filter((item) => !item.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getWritingSlugs() {
  return getAllWriting().map(({ slug }) => ({ params: { slug } }))
}

export async function getWriting(slug) {
  const { data, content } = read(slug)
  const processed = await remark().use(html).process(content)
  const contentHtml = processed.toString()

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? null,
    updated: data.updated ?? null,
    description: data.description ?? '',
    tags: data.tags ?? [],
    source: sourceOf(data),
    references: referencesOf(data),
    originallyPublishedAt: data.originallyPublishedAt ?? null,
    contentHtml,
    readingMinutes: readingTime(content),
  }
}

/**
 * The piece of writing this one responds to. Most of the imported posts are a
 * reaction to someone else's article, and a page that hides that reads as an
 * orphaned opinion rather than part of a conversation.
 */
function sourceOf(data) {
  if (!data.sourceUrl) return null
  return {
    url: data.sourceUrl,
    title: data.sourceTitle ?? data.sourceUrl,
    host: data.sourceHost ?? new URL(data.sourceUrl).host.replace(/^www\./, ''),
  }
}

/**
 * Further reading: everything else the original posts linked to.
 * `source` is the one thing a piece responds to; these are the rest of the
 * evidence, and they are worth carrying because outbound links to primary
 * sources are how a page shows its working.
 */
function referencesOf(data) {
  if (!Array.isArray(data.references)) return []
  return data.references
    .filter((r) => r && r.url)
    .map((r) => ({
      url: r.url,
      title: r.title ?? r.url,
      host: r.host ?? new URL(r.url).host.replace(/^www\./, ''),
    }))
}

/** 220 wpm, rounded up. Displayed, and used for `timeRequired` in JSON-LD. */
function readingTime(markdown) {
  const words = markdown.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 220))
}
