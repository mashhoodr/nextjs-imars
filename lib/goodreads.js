import Parser from "rss-parser";

const parser = new Parser();

export async function getGoodReadsData() {
  try {
    const feed = await parser.parseURL("https://www.goodreads.com/review/list_rss/12569798?key=ywAt57wTHuLgaZ2sqPGG4-ZXQoERTHGeDjXaw_3Ewc_moWGp&shelf=read");
    return feed.items.map(item => {
      const id = item.guid || item.link || Math.random() * 100 * Date.now();
      const reg = new RegExp("(name|book published|average rating|read at|date added|shelves|review):.+<br/>\\n", "g");
      const description = (item.content || "")
        .replaceAll(reg, '')
        // Goodreads wraps each cover in <a><img/></a>. The CSS hides the image,
        // which left an anchor with no accessible name — a WCAG 2.4.4 failure
        // and four of Lighthouse's `link-name` errors. Drop the whole link.
        .replace(/<a[^>]*>\s*<img[^>]*>\s*<\/a>/gi, '');
      return {
        id,
        title: item.title,
        description
      };
    });
  } catch (err) {
    // A feed outage must not fail the build. The section renders empty instead.
    console.warn("goodreads feed unavailable:", err.message);
    return [];
  }
}
