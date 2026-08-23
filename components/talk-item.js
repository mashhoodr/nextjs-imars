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
 *   id        string, unique
 *   title     string
 *   created   YYYY-MM-DD
 *   location  string — venue and city, or "Online"
 *   slides    optional URL
 *   video     optional URL
 *   featured  optional boolean, controls whether it appears on the homepage
 *   image     optional path under /public, e.g. "/talks/tedx-2026.jpg"
 *   imageAlt  optional string; falls back to the title and location
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
  slides,
  video,
  image,
  imageAlt,
}) {
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
        {/* Not every talk has slides. Without this the title became an anchor
            with no href, which is focusable, announced as a link, and goes
            nowhere. */}
        {slides ? (
          <a
            className={utilStyles.itemTitle}
            href={slides}
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
          {location}
          {location && created ? " · " : ""}
          {created && <DateUtil dateString={created} />}
        </small>
      </div>
    </li>
  );
}
