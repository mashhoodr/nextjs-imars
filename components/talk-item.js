import utilStyles from "../styles/utils.module.css";
import DateUtil from "./date";

/**
 * One talk, rendered identically on the homepage and on /talks.
 *
 * The two pages used to hand-roll their own markup — the homepage with
 * `.itemTitle` and `.meta`, /talks with a `<br>` and `.lightText` — so the same
 * record was drawn two different ways depending on where you found it. They are
 * peers, so they get one component.
 *
 * Talk shape in `lib/talks.json`:
 *
 *   id            string, unique
 *   title         string
 *   created       YYYY-MM-DD
 *   location      optional string — venue and city, or "Online"
 *   description   optional one-line write-up
 *   audience      optional number
 *   audienceType  "attended" | "trained" — a workshop is not a talk, and the
 *                 distinction is real information rather than a label choice
 *   slides        optional URL
 *   link          optional URL — event page or recap, used when there are no
 *                 slides to link to
 *   video         optional URL
 *   featured      optional boolean, controls whether it appears on the homepage
 *   image         optional path under /public, e.g. "/talks/tedx-2026.jpg"
 *   imageAlt      optional string; falls back to the title and location
 *
 * `image` is not yet set on any entry, so every talk currently renders the
 * placeholder. Adding the key is all that is needed to light one up.
 */

/** 16:9. Stated on the element so the box is reserved before CSS arrives. */
const THUMB_W = 160;
const THUMB_H = 90;

export default function TalkItem({
  title,
  location,
  created,
  description,
  audience,
  audienceType,
  slides,
  link,
  video,
  image,
  imageAlt,
}) {
  // Slides where they exist, otherwise the event page or recap. Older entries
  // carry slides; the ones imported from the GDE record carry a recap link.
  const href = slides || link;
  // Built as a list so a missing venue or audience does not leave a stray
  // separator behind.
  const meta = [
    location || null,
    created ? <DateUtil key="d" dateString={created} /> : null,
    audience ? `${audience.toLocaleString("en-GB")} ${audienceType || "attended"}` : null,
  ].filter(Boolean);

  return (
    <li className={`${utilStyles.listItem} ${utilStyles.talk}`}>
      <div className={utilStyles.talkThumb}>
        {image ? (
          <img
            src={image}
            alt={imageAlt || `${title}${location ? `, ${location}` : ""}`}
            width={THUMB_W}
            height={THUMB_H}
            // Talks run to 36 entries on /talks. Nothing below the fold should
            // cost a request until it is scrolled to.
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={utilStyles.talkThumbFallback} aria-hidden="true">
            {(created || "").slice(0, 4)}
          </span>
        )}
      </div>

      <div className={utilStyles.talkBody}>
        {/* Not every talk has somewhere to link to. Without this the title
            became an anchor with no href, which is focusable, announced as a
            link, and goes nowhere. */}
        {href ? (
          <a
            className={utilStyles.itemTitle}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </a>
        ) : (
          <span className={utilStyles.itemTitle}>{title}</span>
        )}{" "}
        {video && (
          <a
            className={utilStyles.videoLink}
            href={video}
            target="_blank"
            rel="noopener noreferrer"
          >
            <small>[video]</small>
          </a>
        )}
        <small className={utilStyles.meta}>
          {meta.map((part, i) => (
            <span key={i}>
              {i > 0 ? " · " : ""}
              {part}
            </span>
          ))}
        </small>
        {description && <p className={utilStyles.excerpt}>{description}</p>}
      </div>
    </li>
  );
}
