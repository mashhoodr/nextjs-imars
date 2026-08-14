import { absoluteUrl } from "../lib/site";
import { getSortedPostsData } from "../lib/posts";

/**
 * Generated rather than hand-written, so a new post in /posts is in the sitemap
 * the moment it builds. A stale hand-maintained sitemap is worse than none:
 * it teaches the crawler that the file is not worth re-fetching.
 *
 * Served through getServerSideProps because the response is XML, not a React
 * page. It is cached at the edge for a day, so this is not a per-request cost.
 */
function url({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${absoluteUrl(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

function iso(date) {
  const d = new Date(date);
  return Number.isNaN(d.valueOf()) ? null : d.toISOString().slice(0, 10);
}

export async function getServerSideProps({ res }) {
  const posts = getSortedPostsData().filter(({ id }) => id);
  const today = new Date().toISOString().slice(0, 10);

  const entries = [
    // The homepage carries every section anchor, so it is the only page that
    // needs a high priority. Anchors themselves are deliberately not listed:
    // duplicate URLs for one document dilute rather than help.
    { loc: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
    { loc: "/talks", lastmod: today, changefreq: "monthly", priority: "0.8" },
    { loc: "/blog", lastmod: today, changefreq: "monthly", priority: "0.5" },
    ...posts.map(({ id, date }) => ({
      loc: `/posts/${id}`,
      lastmod: iso(date),
      changefreq: "yearly",
      priority: "0.3",
    })),
    { loc: "/privacy", changefreq: "yearly", priority: "0.1" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(url).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate");
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
