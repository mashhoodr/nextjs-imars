import snapshot from "./goodreads-books.json";

/**
 * Goodreads "read" shelf, served from a committed JSON file.
 *
 * The site never calls Goodreads. `goodreads-books.json` is the only source, and
 * `npm run goodreads:refresh` (scripts/goodreads-refresh.mjs) rewrites it from
 * the RSS feed. A GitHub Action runs that weekly and commits any change, which
 * redeploys the site.
 *
 * Why not fetch at build time: in Nov 2026 Goodreads began answering every
 * request with a CloudFront 403 ("Request blocked"), browsers included, and the
 * Reading section silently vanished. A failed refresh now leaves the file as it
 * was, so an outage can only make the shelf stale, never empty.
 *
 * Feed notes (the mapping lives in the refresh script): only 4 of 33 books had
 * a review when this was written, so the publisher blurb is dropped rather than
 * standing in for one; `user_read_at` is always empty, so `added` is the date.
 */
export function getGoodReadsData() {
  return snapshot.books || [];
}
