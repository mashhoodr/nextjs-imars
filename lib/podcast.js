import Parser from "rss-parser";
import snapshot from "./podcast-episodes.json";

/**
 * Anchor's feed carries per-episode artwork in `itunes:image`, which the old
 * fetcher dropped. All 69 episodes have one and the recent ones are genuinely
 * distinct, so it is real information rather than the show art repeated.
 *
 * The live feed is preferred, so ISR shows a new episode within a day.
 * `podcast-episodes.json` is a committed snapshot of the newest episodes, used
 * whenever the feed fails or comes back empty; `npm run podcast:refresh`
 * rewrites it (weekly in CI). An empty section is a build error now (see
 * lib/section-checks.js), so without the snapshot an Anchor outage would
 * block every deploy.
 */
export const FEED = "https://anchor.fm/s/22de9c80/podcast/rss";

/** How many episodes the snapshot keeps. The homepage shows 3. */
export const SNAPSHOT_SIZE = 10;
const parser = new Parser({
  customFields: {
    item: [["itunes:image", "image", { keepArray: false }]],
  },
});

/** The episode list, live. scripts/podcast-refresh.mjs imports this. */
export async function fetchEpisodes() {
  const feed = await parser.parseURL(FEED);
  return feed.items.map((item) => ({
    id: item.guid || item.link,
    title: item.title,
    link: item.link,
    description: item.contentSnippet || item.content || "",
    created: item.pubDate,
    // rss-parser hands back either the href string or the attribute object
    // depending on how the element is written, so normalise to a URL.
    image: item.image?.$?.href || item.image?.href || (typeof item.image === "string" ? item.image : null),
  }));
}

export async function getPodcastData() {
  let episodes = [];
  try {
    episodes = await fetchEpisodes();
  } catch (err) {
    // A feed outage must not fail the build, or empty the section.
    console.warn("podcast live fetch failed, using the snapshot:", err.message);
  }
  return episodes.length ? episodes : snapshot.episodes || [];
}
