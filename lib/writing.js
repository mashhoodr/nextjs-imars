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
    contentHtml,
    readingMinutes: readingTime(content),
  }
}

/** 220 wpm, rounded up. Displayed, and used for `timeRequired` in JSON-LD. */
function readingTime(markdown) {
  const words = markdown.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 220))
}
