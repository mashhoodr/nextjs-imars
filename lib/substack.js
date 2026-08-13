import Parser from "rss-parser";

const parser = new Parser();

export async function getSubstackData() {
  try {
    const feed = await parser.parseURL("https://mashhoodr.substack.com/feed");
    return feed.items.map(item => ({
      id: item.guid || item.link,
      title: item.title,
      link: item.link,
      description: item.contentSnippet || item.content || "",
      created: item.pubDate
    }));
  } catch (err) {
    // A feed outage must not fail the build. The section renders empty instead.
    console.warn("substack feed unavailable:", err.message);
    return [];
  }
}
