import { adplistSlug } from "./site";

/**
 * ADPList mentorship reviews, fetched at build time.
 *
 * ADPList publishes an embeddable widget. It is an iframe, and loading it costs
 * four Circular Std .otf webfonts, Amplitude analytics, twenty-odd S3 avatars
 * and about fourteen JS chunks. This site loads 68 bytes of third-party code.
 * So the data comes in through the front door instead, the same way the podcast
 * and Goodreads feeds do, and renders as ordinary HTML that search engines can
 * actually read — which an iframe's contents never are.
 *
 * Two unauthenticated endpoints, discovered from the widget's own network
 * traffic. They are undocumented, so treat them as liable to change and let the
 * catch below do its job.
 */
const API = "https://api.adplist.org";
const TIMEOUT_MS = 8000;

/** How many make it onto the homepage. The rest are one click away. */
const SHOWN = 9;

/**
 * A review earns a card if it says something and the reviewer meant it.
 *
 * MIN_CHARS filters out the one-liners ("Great session, thanks!"). They are
 * genuine but they fill a card without paying for it.
 *
 * MIN_SUBRATING reads the per-skill scores rather than the headline `rating`,
 * and that is deliberate. Four of the twenty-five reviews report `rating: 3`
 * while every sub-rating is 5 and the text is plainly warm — the headline field
 * is an ADPList form default that reviewers leave untouched, not a judgement.
 * Scoring on it would bury the reviews it misreports. The sub-ratings do catch
 * the one genuinely lukewarm review, which scores 1s and is excluded.
 *
 * This is why no star rating is rendered anywhere, and why there is no
 * AggregateRating in the JSON-LD: the number is not trustworthy enough to
 * publish, and self-serving review markup is ineligible for rich results.
 */
const MIN_CHARS = 120;
const MIN_SUBRATING = 4;

async function getJson(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

function meanSubRating(review) {
  const values = Object.values(review?.ratings || {}).filter(
    (n) => typeof n === "number"
  );
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Returns `{ reviews, total, profileUrl }`.
 *
 * `total` is every active review on the profile, not the number shown, so the
 * "read all N" link cannot drift from reality the way a hardcoded count would.
 * An outage returns an empty list and the section renders nothing, matching the
 * podcast and Goodreads fetchers — a third party being down must not fail the
 * build.
 */
export async function getAdplistReviews() {
  const profileUrl = `https://adplist.org/mentors/${adplistSlug}`;

  try {
    // The reviews endpoint keys off an internal userId, not the public slug,
    // so the profile has to be resolved first.
    const profile = await getJson(`${API}/users/profile/mentor/${adplistSlug}`);
    const userId = profile?.data?.userId;
    if (!userId) throw new Error("no userId on the mentor profile");

    const payload = await getJson(
      `${API}/users/review?userId=${userId}&type=mentor&target=for&limit=99`
    );
    const all = (payload?.data?.reviews || []).filter(
      (r) => r?.status === "active" && (r.review || "").trim()
    );

    const reviews = all
      .filter((r) => {
        const sub = meanSubRating(r);
        return (
          r.review.trim().length >= MIN_CHARS &&
          (sub === null || sub >= MIN_SUBRATING)
        );
      })
      // Newest first. Recency is the only ordering that is not a judgement
      // about whose praise is worth more.
      .sort((a, b) => (b.createdOn || 0) - (a.createdOn || 0))
      .slice(0, SHOWN)
      .map((r) => ({
        id: `${r.reviewedBy}-${r.createdOn}`,
        quote: r.review.trim(),
        // Several reviews stop mid-sentence in ADPList's own data — one ends
        // on "I highly recommend booking a session with them if". The words are
        // recorded verbatim either way; this flag lets the card show an ellipsis
        // so a reader attributes the break to the source rather than assuming
        // this site chopped the quote.
        trails: !/[.!?\u2026]$/.test(r.review.trim()),
        name: r.reviewedByUser?.name || "A mentee",
        title: r.reviewedByUser?.title || null,
        organization: r.reviewedByUser?.organization || null,
        created: r.createdOn ? new Date(r.createdOn).toISOString() : null,
      }));

    return { reviews, total: all.length, profileUrl };
  } catch (err) {
    console.warn("adplist reviews unavailable:", err.message);
    return { reviews: [], total: 0, profileUrl };
  }
}
