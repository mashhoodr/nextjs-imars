import Parser from "rss-parser";

/**
 * Anchor's feed carries per-episode artwork in `itunes:image`, which the old
 * fetcher dropped. All 69 episodes have one and the recent ones are genuinely
 * distinct, so it is real information rather than the show art repeated.
 */
const parser = new Parser({
  customFields: {
    item: [["itunes:image", "image", { keepArray: false }]],
  },
});

export async function getPodcastData() {
  try {
    const feed = await parser.parseURL("https://anchor.fm/s/22de9c80/podcast/rss");
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
  } catch (err) {
    // A feed outage must not fail the build. The section renders empty instead.
    console.warn("podcast feed unavailable:", err.message);
    return [];
  }
}
