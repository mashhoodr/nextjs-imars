const Feed = require("rss-to-json");

export async function getGoodReadsData() {
  const rss = await Feed.load("https://www.goodreads.com/review/list_rss/12569798?key=ywAt57wTHuLgaZ2sqPGG4-ZXQoERTHGeDjXaw_3Ewc_moWGp&shelf=read");
  return rss["items"].map(item => {
      delete item['author'];
      if(item['id'] === undefined) {
          item['id'] = Math.random() * 100 * Date.now()
      }
      const reg = new RegExp("(name|book published|average rating|read at|date added|shelves):.+<br/>\\n", "g");
      item['description'] = item['description'].replaceAll(reg, '');
      return item;
  });
}
