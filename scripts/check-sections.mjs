// Check the rendered homepage: every sidebar section exists and has content.
// Run: npm run check:sections -- [url]   (default https://karachiwala.dev)
// Daily and after each deployment via .github/workflows/check-sections.yml.
//
// This complements lib/section-checks.js, which checks the data at build time.
// It catches what that can't: markup that hides a section while its data is fine,
// and a stale ISR page that the build-time check kept serving.
import { readFileSync } from "node:fs";

// Minimum <li> items between a section's id and the next section's id.
// Sections with no list (work, about) only need to exist.
const MIN_ITEMS = { proof: 5, writing: 3, podcast: 3, talks: 3, mentorship: 3, books: 6 };

const url = process.argv[2] || "https://karachiwala.dev";
const layout = readFileSync(new URL("../components/layout.js", import.meta.url), "utf8");
const ids = [...layout.matchAll(/\{ id: "([^"]+)", label:/g)].map((m) => m[1]);

const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
if (!res.ok) {
  console.error(`FAIL ${url}: HTTP ${res.status}`);
  process.exit(1);
}
const html = await res.text();
const at = ids.map((id) => [id, html.indexOf(` id="${id}"`)]);

let failed = 0;
for (const [i, [id, start]] of at.entries()) {
  if (start < 0) {
    console.log(`FAIL ${id}: missing from the page`);
    failed++;
    continue;
  }
  const next = at.slice(i + 1).map(([, s]) => s).filter((s) => s > start);
  const segment = html.slice(start, next.length ? Math.min(...next) : undefined);
  const items = (segment.match(/<li[\s>]/g) || []).length;
  const min = MIN_ITEMS[id] || 0;
  const ok = items >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${id}: ${items} item(s)${min ? `, needs ${min}` : ""}`);
}
console.log(`${failed ? "FAILED" : "OK"}: ${ids.length - failed}/${ids.length} sections on ${url}`);
process.exit(failed ? 1 : 0);
