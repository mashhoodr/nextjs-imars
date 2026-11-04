// Refresh lib/goodreads-books.json, the only source for the Reading section.
// Run: npm run goodreads:refresh   (weekly by .github/workflows/refresh-feeds.yml)
//
// The site never calls Goodreads; this script is the one place the feed is read.
// On any failure it exits 1 and leaves the file untouched, so the shelf goes
// stale rather than empty. It only rewrites the file when the books changed.
import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

// The shelves are public; the key does not gate anything (see CLAUDE.md, Known issues).
const feedUrl =
  "https://www.goodreads.com/review/list_rss/12569798?key=ywAt57wTHuLgaZ2sqPGG4-ZXQoERTHGeDjXaw_3Ewc_moWGp&shelf=read";
const file = new URL("../lib/goodreads-books.json", import.meta.url);
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
const current = JSON.parse(readFileSync(file, "utf8")).books;
if (JSON.stringify(current) === JSON.stringify(books)) {
  console.log(`lib/goodreads-books.json: unchanged (${books.length} books)`);
  process.exit(0);
}
writeFileSync(
  file,
  JSON.stringify({ fetchedAt: new Date().toISOString(), source: "goodreads rss", books }, null, 2) + "\n"
);
console.log(`lib/goodreads-books.json: ${books.length} books`);
