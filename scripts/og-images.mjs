/**
 * Builds the social preview image for every page, into public/og/.
 *
 * Before this existed, all 58 pages shared one photo of him on stage. Titles
 * differed in the preview card; the picture never did, so three links in a row
 * looked like the same post and the image carried no information at all.
 *
 * Two kinds of image come out of here:
 *
 *   ART   — pages that already have a real diagram or photograph use it. A
 *           chart previews far better in a feed than a text card, and the
 *           work of making it is already done.
 *   CARD  — everything else gets a typeset card: kicker, title, byline.
 *
 * Only art that is roughly landscape qualifies. Several of the older post
 * images are portrait (one is 1171x1876), and a portrait image in a 1.91:1
 * preview slot is cropped to a meaningless band through its middle. Those fall
 * back to a card. See MIN_RATIO/MAX_RATIO.
 *
 * Everything is emitted at exactly 1200x630, which is what components/seo.js
 * declares in og:image:width/height. Normalising here is what lets those
 * numbers stay honest — they used to be hardcoded next to an image nothing
 * could override.
 *
 * Run deliberately, like `talks:images`, and commit the result:
 *   npm run og:images
 *
 * Deliberate rather than a build hook so the output is reviewable in a diff,
 * and so a deploy can never produce different previews than the ones checked.
 *
 * Fonts: ImageResponse ships its own, and it never reaches a browser — this is
 * a build-time rasteriser. The site's no-webfont rule is about page weight and
 * is untouched by it.
 */
import { ImageResponse } from "next/og.js";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "og");

const W = 1200;
const H = 630;

/** Landscape enough to survive a 1.91:1 crop. Target ratio is 1.905. */
const MIN_RATIO = 1.5;
const MAX_RATIO = 2.4;

// House tokens, mirrored from styles/global.css. Kept as literals because this
// runs outside the bundler and cannot read CSS custom properties.
const INK = "#18181b";
const INK_SOFT = "rgba(0,0,0,0.68)";
const INK_FAINT = "rgba(0,0,0,0.56)";
const RULE = "#e4e4e7";
const BG = "#ffffff";

const FRONTMATTER = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function readDoc(file) {
  const raw = fs.readFileSync(file, "utf8");
  const m = FRONTMATTER.exec(raw);
  return {
    data: m ? parseYaml(m[1]) ?? {} : {},
    body: m ? raw.slice(m[0].length) : raw,
  };
}

/** Minimal PNG/JPEG header reader, same approach as lib/writing.js. */
function imageSize(file) {
  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return null;
  }
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

/** First local image referenced in the body, if it is landscape enough. */
function usableArt(body, frontmatter) {
  const candidates = [];
  // A video poster is a deliberate, well-cropped still — prefer it.
  if (frontmatter?.video?.poster) candidates.push(frontmatter.video.poster);
  for (const m of body.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)) candidates.push(m[1]);

  for (const src of candidates) {
    const file = path.join(ROOT, "public", src);
    const size = imageSize(file);
    if (!size) continue;
    const ratio = size.w / size.h;
    if (ratio < MIN_RATIO || ratio > MAX_RATIO) continue;
    return { src, file, ...size, ratio };
  }
  return null;
}

const el = (type, props, ...children) => ({
  type,
  props: { ...props, children: children.length > 1 ? children : children[0] },
});

/**
 * The typeset card. Hierarchy comes from size and space, not from weight or
 * rules — the same constraint the site itself works under.
 */
function card({ kicker, title, footer }) {
  // Long titles need to step down or they overflow the box. Three stops rather
  // than a continuous scale, so the result stays predictable.
  const size = title.length > 78 ? 58 : title.length > 46 ? 70 : 84;

  return el(
    "div",
    {
      style: {
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", background: BG, padding: "76px 80px",
      },
    },
    el("div", {
      style: {
        fontSize: 26, letterSpacing: "0.16em", color: INK_FAINT,
        textTransform: "uppercase", display: "flex",
      },
    }, kicker),
    el("div", {
      style: {
        fontSize: size, lineHeight: 1.12, letterSpacing: "-0.02em",
        color: INK, display: "flex", maxWidth: 1000,
      },
    }, title),
    el("div", {
      style: {
        display: "flex", alignItems: "center", gap: 18,
        borderTop: `1px solid ${RULE}`, paddingTop: 26,
        fontSize: 26, color: INK_SOFT,
      },
    }, footer),
  );
}

/** Real art, normalised onto the 1200x630 canvas. */
function artCard(art) {
  const data = fs.readFileSync(art.file).toString("base64");
  const mime = art.src.endsWith(".png") ? "image/png" : "image/jpeg";
  return el(
    "div",
    { style: { width: "100%", height: "100%", display: "flex", background: BG } },
    el("img", {
      src: `data:${mime};base64,${data}`,
      width: W, height: H,
      // The diagrams are 1.79 and the slot is 1.905, so `cover` trims a few
      // percent off the top and bottom rather than letterboxing on white.
      style: { width: "100%", height: "100%", objectFit: "cover" },
    }),
  );
}

/**
 * ImageResponse only emits PNG, which is right for a flat card of text and
 * badly wrong for a photograph — the two photo-derived images came out at
 * 1.7MB and 1.4MB before this. Anything built from art is re-encoded to JPEG,
 * which takes those to a few tens of KB with no visible loss at preview size.
 *
 * Uses macOS `sips`, as scripts/talk-images.py already does for HEIC. This is
 * a deliberate local tool, not part of the deploy.
 */
async function write(name, node, { photo = false } = {}) {
  const res = new ImageResponse(node, { width: W, height: H });
  const png = path.join(OUT, `${name}.png`);
  fs.writeFileSync(png, Buffer.from(await res.arrayBuffer()));

  if (!photo) return { file: `${name}.png`, bytes: fs.statSync(png).size };

  const jpg = path.join(OUT, `${name}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", png, "--out", jpg],
    { stdio: "ignore" });
  fs.unlinkSync(png);
  return { file: `${name}.jpg`, bytes: fs.statSync(jpg).size };
}

function listing(dir) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, ""), file: path.join(d, f) }));
}

const SECTIONS = [
  { name: "home", kicker: "Mashhood Rastgar", title: "Helping engineering organisations become agent-native." },
  { name: "writing", kicker: "Writing", title: "What I am thinking about." },
  { name: "talks", kicker: "Talks", title: "Talks and conference appearances" },
  { name: "workshops", kicker: "Workshops", title: "AI and agentic engineering workshops for engineering teams" },
  { name: "blog", kicker: "Archive", title: "Blog archive" },
  { name: "privacy", kicker: "Privacy", title: "Privacy policy" },
];

const BYLINE = "karachiwala.dev";

async function main() {
  // Rebuilt from scratch each run, so a renamed or deleted page cannot leave a
  // stale preview behind for something that no longer exists.
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const manifest = {};
  let art = 0, cards = 0, bytes = 0;

  for (const s of SECTIONS) {
    const r = await write(s.name, card({ kicker: s.kicker, title: s.title, footer: BYLINE }));
    manifest[s.name] = `/og/${r.file}`;
    bytes += r.bytes;
    cards++;
  }

  for (const [dir, kicker] of [["writing", "Writing"], ["posts", "Archive"]]) {
    for (const { slug, file } of listing(dir)) {
      const { data, body } = readDoc(file);
      if (data.draft) continue;
      const found = usableArt(body, data);
      const name = `${dir === "posts" ? "post-" : ""}${slug}`;
      let r;
      if (found) {
        r = await write(name, artCard(found), { photo: true });
        art++;
        console.log(`  art   ${name}  <- ${found.src} (${found.w}x${found.h}, ${Math.round(r.bytes / 1024)}KB)`);
      } else {
        r = await write(name, card({
          kicker,
          title: data.title ?? slug,
          footer: `Mashhood Rastgar · ${BYLINE}`,
        }));
        cards++;
      }
      manifest[name] = `/og/${r.file}`;
      bytes += r.bytes;
    }
  }

  // components/seo.js reads this. A manifest rather than a filename convention
  // because art and cards end up with different extensions, and because a page
  // with no entry should fall back to the site image rather than 404.
  fs.writeFileSync(
    path.join(ROOT, "lib", "og-images.json"),
    JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + "\n",
  );

  console.log(`\n${art} from art, ${cards} cards, ${(bytes / 1024 / 1024).toFixed(2)} MB total -> public/og/`);
  console.log(`manifest -> lib/og-images.json (${Object.keys(manifest).length} entries)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
