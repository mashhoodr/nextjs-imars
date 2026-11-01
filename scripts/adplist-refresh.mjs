// Refresh lib/adplist-reviews.json, the committed fallback for the ADPList section.
// Run: npm run adplist:refresh   (then commit the JSON)
//
// Plain Node can't import lib/adplist.js (Next resolves its extensionless imports),
// so the fetch is repeated here. Keep the trimmed fields in step with fetchRawReviews().
import { readFileSync, writeFileSync } from "node:fs";

const site = readFileSync(new URL("../lib/site.js", import.meta.url), "utf8");
const slug = site.match(/adplistSlug = "([^"]+)"/)[1];
const res = await fetch(
  `https://api.adplist.org/users/review?slug=${slug}&type=mentor&target=for&limit=99`,
  { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) }
);
if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
const raw = (await res.json())?.data?.reviews;
if (!Array.isArray(raw) || !raw.length) {
  console.error("ADPList returned no reviews; snapshot left unchanged.");
  process.exit(1);
}
const reviews = raw.map((r) => ({
  status: r.status,
  review: r.review,
  ratings: r.ratings,
  createdOn: r.createdOn,
  reviewedBy: r.reviewedBy,
  reviewedByUser: {
    name: r.reviewedByUser?.name || null,
    title: r.reviewedByUser?.title || null,
    organization: r.reviewedByUser?.organization || null,
  },
}));
writeFileSync(
  new URL("../lib/adplist-reviews.json", import.meta.url),
  JSON.stringify({ fetchedAt: new Date().toISOString(), reviews }, null, 2) + "\n"
);
console.log(`lib/adplist-reviews.json: ${reviews.length} reviews`);
