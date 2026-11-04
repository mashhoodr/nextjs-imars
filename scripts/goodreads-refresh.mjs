// Refresh lib/goodreads-books.json, the committed fallback for the Reading section.
// Run: npm run goodreads:refresh   (then commit the JSON)
//
// Plain Node can't import lib/goodreads.js (it imports JSON the Next way), so the
// fetch and mapping are repeated here. Keep them in step with fetchBooks().
import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

const lib = readFileSync(new URL("../lib/goodreads.js", import.meta.url), "utf8");
const feedUrl = lib.match(/"(https:\/\/www\.goodreads\.com\/review\/list_rss\/[^"]+)"/)[1];
const parser = new Parser({
  customFields: {
    item: [
      ["book_id", "bookId"],
      ["book_large_image_url", "coverLarge"],
      ["book_medium_image_url", "coverMedium"],
      ["author_name", "author"],
      ["user_rating", "rating"],
      ["user_review", "review"],
      ["user_date_added", "added"],
    ],
  },
});
const plain = (html) =>
  (html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

let feed;
try {
  feed = await parser.parseURL(feedUrl);
} catch (err) {
  console.error(`Goodreads feed failed (${err.message}); snapshot left unchanged.`);
  process.exit(1);
}
const books = feed.items.map((item) => ({
  id: item.bookId || item.guid || item.link,
  title: (item.title || "").trim(),
  author: (item.author || "").trim(),
  cover: item.coverLarge || item.coverMedium || null,
  rating: Number.parseInt(item.rating, 10) || 0,
  review: plain(item.review),
  link: (item.link || "").split("?")[0],
  added: item.added || null,
}));
if (!books.length) {
  console.error("Goodreads returned no books; snapshot left unchanged.");
  process.exit(1);
}
writeFileSync(
  new URL("../lib/goodreads-books.json", import.meta.url),
  JSON.stringify({ fetchedAt: new Date().toISOString(), source: "goodreads rss", books }, null, 2) + "\n"
);
console.log(`lib/goodreads-books.json: ${books.length} books`);
