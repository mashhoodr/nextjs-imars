#!/usr/bin/env node
/**
 * One-off-ish import: Substack RSS -> writing/*.md
 *
 *   node scripts/import-substack.mjs            # dry run, prints what it would write
 *   node scripts/import-substack.mjs --write    # actually writes
 *
 * Converts to Markdown rather than storing Substack's HTML. The point of
 * bringing the writing home is to own it in an editable form; a blob of
 * platform HTML with their class names is not that.
 *
 * Existing files are never overwritten, so hand edits survive re-runs.
 */
import fs from "node:fs";
import path from "node:path";
import Parser from "rss-parser";

const FEED = "https://mashhoodr.substack.com/feed";
const OUT = path.join(process.cwd(), "writing");
const WRITE = process.argv.includes("--write");

/** Posts too short to stand as an article — link notes, one-liners. */
const MIN_CHARS = 700;

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

/**
 * Substack emits a small, predictable tag set, so a targeted converter beats a
 * general-purpose one here: fewer dependencies and no surprise output.
 */
function toMarkdown(html, images) {
  let s = html;

  // Figures first, and destructively. Substack nests each image five levels deep
  // inside an anchor, a picture, several <source srcset> variants and an expand
  // button. Trying to unwrap that with tag-level rules leaves debris, so instead
  // the whole <figure> is replaced by the one <img> and caption it contains.
  s = s.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_, inner) => {
    const src = (inner.match(/<img[^>]*?src="([^"]+)"/i) || [])[1];
    const alt = (inner.match(/<img[^>]*?alt="([^"]*)"/i) || [])[1] || "";
    const caption = (inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || [])[1];
    if (!src) return "\n\n";
    const local = images.claim(src);
    const cap = caption ? `\n*${decode(caption.replace(/<[^>]+>/g, "").trim())}*\n` : "";
    return `\n\n![${decode(alt)}](${local})\n${cap}\n`;
  });
  s = s.replace(/<div class="captioned-image-container">([\s\S]*?)<\/div>/gi, "$1");
  s = s.replace(/<source[^>]*>/gi, "");

  // Any stray images left outside a figure.
  s = s.replace(/<a[^>]*>\s*(<img[^>]*>)\s*<\/a>/gi, "$1");
  s = s.replace(/<img[^>]*?alt="([^"]*)"[^>]*?src="([^"]+)"[^>]*>/gi,
    (_, alt, src) => `![${alt}](${images.claim(src)})\n\n`);
  s = s.replace(/<img[^>]*?src="([^"]+)"[^>]*>/gi,
    (_, src) => `![](${images.claim(src)})\n\n`);

  s = s.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_, code) => `\n\`\`\`\n${decode(code.replace(/<[^>]+>/g, ""))}\n\`\`\`\n\n`);
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n## $1\n\n");   // demoted: the
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n\n");   // page <h1> is
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n\n");  // the title
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n\n");

  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (_, inner) => "\n" + inner.replace(/<[^>]+>/g, "").trim().split("\n")
      .map((l) => `> ${l.trim()}`).join("\n") + "\n\n");

  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, i) => `- ${i.replace(/<\/?p[^>]*>/gi, "").trim()}\n`);
  s = s.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

  s = s.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  s = s.replace(/<hr[^>]*>/gi, "\n---\n\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");

  s = s.replace(/<[^>]+>/g, "");           // anything left is chrome
  s = decode(s);
  return s.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+$/gm, "").trim();
}

const slugify = (t) =>
  t.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "").slice(0, 70);

/** First real sentence(s), for the meta description. */
function describe(md, limit = 158) {
  const text = md
    .replace(/^#.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/https?:\/\/\S+/g, "")   // bare URLs read as noise in a snippet
    // Image captions are emitted as a lone italic line. They read as a non
    // sequitur at the head of a search snippet, so drop them.
    .replace(/^\s*\*[^*\n]+\*\s*$/gm, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*`>_-]/g, "")
    .replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, text.lastIndexOf(" ", limit))}…`;
}

const yamlStr = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

/** Links that are plumbing rather than the subject of the post. */
const NOT_A_SOURCE =
  /substack\.com|linkedin\.com\/feed\/hashtag|linkedin\.com\/company|linkedin\.com\/in\/|karachiwala\.dev|twitter\.com|x\.com/i;

/**
 * Most of these posts are a response to something someone else wrote, and open
 * by linking it. Surfacing that link is the difference between a page that
 * looks like an orphaned opinion and one that reads as part of a conversation.
 */
function findSource(md) {
  // Only look at the opening: a link in the closing paragraph is usually an
  // aside, not the thing being discussed.
  const opening = md.slice(0, 1200);
  const candidates = [
    ...[...opening.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map((m) => ({
      title: m[1].trim(),
      url: m[2],
    })),
    ...[...opening.matchAll(/(?<!\()\bhttps?:\/\/[^\s)\]]+/g)].map((m) => ({
      title: null,
      url: m[0],
    })),
  ];

  const hit = candidates.find((c) => !NOT_A_SOURCE.test(c.url));
  if (!hit) return null;

  const url = hit.url.replace(/[.,)]+$/, "");
  let { host, pathname } = new URL(url);
  host = host.replace(/^www\./, "");

  // Prefer the anchor text; otherwise de-slugify the last path segment, which
  // for the blogs linked here is nearly always the headline.
  let title = hit.title;
  if (!title || /^https?:/.test(title)) {
    const seg = pathname.split("/").filter(Boolean).pop() || "";
    const words = seg.replace(/\.\w+$/, "").replace(/[-_]+/g, " ").trim();
    title = words.split(" ").length >= 3
      ? words.charAt(0).toUpperCase() + words.slice(1)
      : host;
  }
  return { url, title, host };
}

/** Substack appends share/subscribe furniture to every emailed post. */
function stripPlatformFurniture(md) {
  return md
    .replace(/\[[^\]]*\]\(https:\/\/[^)]*substack\.com\/(subscribe|p\/[^)]*action=share)[^)]*\)/gi, "")
    .replace(/\[([^\]]+)\]\(https:\/\/www\.linkedin\.com\/feed\/hashtag[^)]*\)/gi, "$1")
    .replace(/^\s*(Share|Leave a comment|Subscribe now|Thanks for reading[^\n]*)\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Collects remote image URLs during conversion and downloads them afterwards.
 *
 * Hotlinking substackcdn.com would leave the canonical copy of the writing
 * depending on the platform we are trying to stop depending on, and would add a
 * third-party origin to pages that currently load 68 bytes of third-party code.
 */
function imageCollector(slug) {
  const pending = [];
  return {
    pending,
    claim(url) {
      // Substack proxies through its CDN; the real file is the encoded tail.
      const decoded = decodeURIComponent((url.match(/https%3A[^"\s]+/) || [url])[0]);
      const ext = (decoded.match(/\.(png|jpe?g|gif|webp|svg)/i) || [".png"])[0].toLowerCase();
      const name = `${slug}-${pending.length + 1}${ext}`;
      pending.push({ url, file: name });
      return `/writing-images/${name}`;
    },
  };
}

async function download(items, dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const { url, file } of items) {
    const target = path.join(dir, file);
    if (fs.existsSync(target)) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fs.writeFileSync(target, Buffer.from(await res.arrayBuffer()));
      console.log(`      image -> ${file}`);
    } catch (err) {
      console.warn(`      image FAILED ${file}: ${err.message}`);
    }
  }
}

const feed = await new Parser({
  customFields: { item: [["content:encoded", "full"]] },
}).parseURL(FEED);

fs.mkdirSync(OUT, { recursive: true });
let written = 0, skipped = 0, existing = 0;

const IMG_DIR = path.join(process.cwd(), "public", "writing-images");

for (const item of feed.items) {
  const title = (item.title || "").trim();
  const slug = slugify(title);
  const images = imageCollector(slug);
  const md = stripPlatformFurniture(toMarkdown(item.full || item.content || "", images));
  const source = findSource(md);

  if (md.length < MIN_CHARS) {
    console.log(`  skip (${md.length} chars, too short): ${title.slice(0, 60)}`);
    skipped++;
    continue;
  }

  const file = path.join(OUT, `${slug}.md`);
  if (fs.existsSync(file)) {
    console.log(`  exists, left alone: ${slug}`);
    existing++;
    continue;
  }

  if (WRITE && images.pending.length) await download(images.pending, IMG_DIR);

  const date = new Date(item.pubDate).toISOString().slice(0, 10);
  // The source URL usually opens the post as a bare link. It moves into the
  // header, so remove the duplicate from the body.
  const bodyMd = source
    ? md.replace(source.url, "").replace(/^\s*\n/, "").trim()
    : md;

  const body = [
    "---",
    `title: ${yamlStr(title)}`,
    `date: "${date}"`,
    `description: ${yamlStr(describe(md))}`,
    // Recorded so the syndication relationship stays visible. These posts were
    // published on Substack first, so its canonical needs repointing here.
    `originallyPublishedAt: "${item.link}"`,
    ...(source
      ? [`sourceUrl: "${source.url}"`, `sourceTitle: ${yamlStr(source.title)}`, `sourceHost: "${source.host}"`]
      : []),
    "tags:",
    "  - engineering leadership",
    "---",
    "",
    bodyMd,
    "",
  ].join("\n");

  console.log(`  ${WRITE ? "write" : "would write"}: ${slug}.md  (${md.length} chars, ${date})`);
  if (WRITE) fs.writeFileSync(file, body);
  written++;
}

console.log(`\n${WRITE ? "Wrote" : "Would write"} ${written}; skipped ${skipped} short; ${existing} already present.`);
if (!WRITE) console.log("Re-run with --write to apply.");
