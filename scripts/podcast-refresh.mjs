// Refresh lib/podcast-episodes.json, the committed fallback for the Podcast section.
// Run: npm run podcast:refresh   (weekly by .github/workflows/refresh-feeds.yml)
//
// Writes only when the episodes changed. On failure it exits 1 and leaves the file alone.
import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

const lib = readFileSync(new URL("../lib/podcast.js", import.meta.url), "utf8");
const feedUrl = lib.match(/FEED = "([^"]+)"/)[1];
const size = Number(lib.match(/SNAPSHOT_SIZE = (\d+)/)[1]);
const parser = new Parser({ customFields: { item: [["itunes:image", "image", { keepArray: false }]] } });

let feed;
try {
  feed = await parser.parseURL(feedUrl);
} catch (err) {
  console.error(`Podcast feed failed (${err.message}); snapshot left unchanged.`);
  process.exit(1);
}
// Same mapping as fetchEpisodes() in lib/podcast.js; keep the two in step.
const episodes = feed.items.slice(0, size).map((item) => ({
  id: item.guid || item.link,
  title: item.title,
  link: item.link,
  description: item.contentSnippet || item.content || "",
  created: item.pubDate,
  image: item.image?.$?.href || item.image?.href || (typeof item.image === "string" ? item.image : null),
}));
if (!episodes.length) {
  console.error("Podcast feed returned no episodes; snapshot left unchanged.");
  process.exit(1);
}
const file = new URL("../lib/podcast-episodes.json", import.meta.url);
if (JSON.stringify(JSON.parse(readFileSync(file, "utf8")).episodes) === JSON.stringify(episodes)) {
  console.log(`lib/podcast-episodes.json: unchanged (${episodes.length} episodes)`);
  process.exit(0);
}
writeFileSync(file, JSON.stringify({ fetchedAt: new Date().toISOString(), episodes }, null, 2) + "\n");
console.log(`lib/podcast-episodes.json: ${episodes.length} episodes`);
