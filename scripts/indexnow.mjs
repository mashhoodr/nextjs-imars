#!/usr/bin/env node
/**
 * Ping IndexNow with every URL in the sitemap.
 *
 *   node scripts/indexnow.mjs           # submit
 *   node scripts/indexnow.mjs --dry     # print what would be submitted
 *
 * Run this after a deploy that adds or changes pages.
 *
 * Bing, Yandex, Naver and Seznam accept IndexNow and share submissions between
 * them, so one call reaches all of them. Google does not participate and still
 * wants Search Console plus the sitemap.
 *
 * Bing is not a nice-to-have here: ChatGPT Search retrieves through Bing's
 * index, so Bing freshness is a direct input to AI visibility.
 *
 * The key is public by design. IndexNow proves ownership by requiring the key
 * to be readable at https://<host>/<key>.txt, which is why it is committed.
 */
const KEY = "bcc00a79708dad2952ea1094ed81c2ee";
const HOST = "karachiwala.dev";
const DRY = process.argv.includes("--dry");

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urlList.length) {
  console.error("No URLs found in sitemap — aborting rather than submitting nothing.");
  process.exit(1);
}

console.log(`${urlList.length} URLs from https://${HOST}/sitemap.xml`);
if (DRY) {
  urlList.forEach((u) => console.log("  " + u));
  console.log("\nDry run. Re-run without --dry to submit.");
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

// 200 accepted, 202 accepted but key still validating. Both are success.
console.log(`IndexNow responded ${res.status} ${res.statusText}`);
if (![200, 202].includes(res.status)) {
  console.error(await res.text());
  process.exit(1);
}
console.log("Submitted. Bing, Yandex, Naver and Seznam share this submission.");
