import Parser from "rss-parser";

const parser = new Parser();

export async function getGoodReadsData() {
  const feed = await parser.parseURL("https://www.goodreads.com/review/list_rss/12569798?key=ywAt57wTHuLgaZ2sqPGG4-ZXQoERTHGeDjXaw_3Ewc_moWGp&shelf=read");
  return feed.items.map(item => {
      const id = item.guid || item.link || Math.random() * 100 * Date.now();
      const reg = new RegExp("(name|book published|average rating|read at|date added|shelves|review):.+<br/>\\n", "g");
      const description = (item.content || "").replaceAll(reg, '');
      return {
        id,
        title: item.title,
        description
      };
  });
}
