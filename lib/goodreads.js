import Parser from "rss-parser";
import snapshot from "./goodreads-books.json";

/**
 * Goodreads "read" shelf.
 *
 * The feed carries far more than the previous version used. Notably it has
 * `user_review` (his own words) and `book_description` (the publisher's blurb).
 * The old code rendered the blurb, which read as if it were his opinion. Only 4
 * of 33 books actually have a review, so the blurb is now dropped entirely
 * rather than standing in for one.
 *
 * `user_read_at` is empty on every item, so `user_date_added` is the only usable
 * date. The feed is already ordered by it, newest first.
 *
 * In Nov 2026 Goodreads began answering every request with a CloudFront 403
 * ("Request blocked"), browsers included, and the Reading section silently
 * vanished. `goodreads-books.json` is a committed snapshot, refreshed with
 * `npm run goodreads:refresh`. The live feed is preferred; the snapshot renders
 * whenever it fails or comes back empty, as with the ADPList reviews.
 */
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
      ["average_rating", "averageRating"],
    ],
  },
});

const FEED =
  "https://www.goodreads.com/review/list_rss/12569798?key=ywAt57wTHuLgaZ2sqPGG4-ZXQoERTHGeDjXaw_3Ewc_moWGp&shelf=read";

/** Goodreads wraps review text in HTML; the display is plain text. */
export function plain(html) {
  return (html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The review URL, minus Goodreads' RSS tracking parameters. */
export function cleanLink(link) {
  return (link || "").split("?")[0];
}

/** The read shelf, live. scripts/goodreads-refresh.mjs repeats this mapping; keep the two in step. */
export async function fetchBooks() {
  const feed = await parser.parseURL(FEED);
  return feed.items.map((item) => {
    const rating = Number.parseInt(item.rating, 10) || 0;
    return {
      id: item.bookId || item.guid || item.link,
      title: (item.title || "").trim(),
      author: (item.author || "").trim(),
      // Goodreads serves the same file at several sizes; the large one is
      // still only a few tens of KB and is proxied and resized by next/image.
      cover: item.coverLarge || item.coverMedium || null,
      rating,
      review: plain(item.review),
      link: cleanLink(item.link),
      added: item.added || null,
    };
  });
}

export async function getGoodReadsData() {
  let books = [];
  try {
    books = await fetchBooks();
  } catch (err) {
    // A feed outage must not fail the build, or empty the section.
    console.warn("goodreads live fetch failed, using the snapshot:", err.message);
  }
  return books.length ? books : snapshot.books || [];
}
