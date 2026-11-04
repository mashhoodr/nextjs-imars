/**
 * Homepage section checks, run inside getStaticProps on every build and every
 * ISR regeneration.
 *
 * The ADPList (Oct 2026) and Goodreads (Nov 2026) outages both blanked a section
 * silently: the fetcher returned [], the page rebuilt and the gap went live.
 * Throwing here turns that into a failed Vercel build (the previous deploy stays
 * live, Vercel emails), and during ISR Next keeps serving the last good page.
 *
 * Floors are "not empty", plus the count the page shows where the source can't
 * legitimately drop below it. The rendered page is checked separately, after
 * each production deployment, by scripts/check-sections.mjs.
 */
export const MINIMUMS = {
  "proof (LinkedIn recommendations)": [(p) => p.linkedinRecs?.recommendations, 1],
  writing: [(p) => p.ownWriting, 1],
  podcast: [(p) => p.allPodcastData, 3],
  talks: [(p) => p.recentTalks, 1],
  mentorship: [(p) => p.adplist?.reviews, 1],
  books: [(p) => p.allBooksReadData, 6],
  "blog archive": [(p) => p.allPostsData, 3],
};

/** Throws one error naming every section below its floor. */
export function assertSections(props) {
  const failures = Object.entries(MINIMUMS)
    .map(([name, [pick, min]]) => {
      const n = Array.isArray(pick(props)) ? pick(props).length : 0;
      return n < min ? `${name}: ${n} item(s), needs ${min}` : null;
    })
    .filter(Boolean);
  if (failures.length) {
    throw new Error(`Homepage section check failed:\n  - ${failures.join("\n  - ")}`);
  }
}
