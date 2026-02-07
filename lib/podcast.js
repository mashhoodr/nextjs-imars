import Parser from "rss-parser";

const parser = new Parser();

export async function getPodcastData() {
  const feed = await parser.parseURL("https://anchor.fm/s/22de9c80/podcast/rss");
  return feed.items.map(item => ({
    id: item.guid || item.link,
    title: item.title,
    link: item.link,
    description: item.contentSnippet || item.content || "",
    created: item.pubDate
  }));
}
