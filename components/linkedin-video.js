import { useState } from "react";
import utilStyles from "../styles/utils.module.css";

/**
 * A LinkedIn video, without the cost of a LinkedIn embed.
 *
 * This site loads 68 bytes of third-party code and scores 100 on all four
 * Lighthouse categories. A standard LinkedIn `<iframe>` would put their player
 * and their cookies on every page view, which ends both of those properties for
 * the sake of a video most readers will not play.
 *
 * So the iframe is not in the initial markup at all. What ships is a local
 * poster image and a link; the frame is injected into state on click. Readers
 * who watch pay for the player, readers who do not pay nothing, and the
 * measured page load is unchanged because nothing third-party is requested
 * until a human asks for it.
 *
 * PROGRESSIVE ENHANCEMENT — the reason this is an <a> and not a <button>.
 *
 * Every page here is prerendered, so the HTML must be useful before React
 * hydrates and useful if React never arrives. An <a href> pointing at the post
 * satisfies both: with no JS it is simply a link to LinkedIn, which is the
 * correct fallback. Hydration then intercepts the click. A <button> would have
 * been inert in exactly the case the fallback exists for.
 *
 * Modified clicks (cmd, ctrl, shift, middle) are deliberately NOT intercepted,
 * so "open in new tab" keeps working the way the anchor promises.
 *
 * `video` frontmatter contract, read by videoOf() in lib/writing.js:
 *
 *   embedUrl   required, the linkedin.com/embed/feed/update/... URL
 *   url        required, the human-facing post URL — the no-JS fallback
 *   poster     optional path under /public. Absent is fine; the frame then
 *              renders as a plain surface with the play mark
 *   posterAlt  optional; also used as the iframe's accessible name
 *   caption    optional, rendered as a <figcaption>
 *   width      video pixel width, used for the frame's aspect-ratio
 *   height     video pixel height
 *
 * Poster width/height are NOT taken from frontmatter — videoOf() reads them off
 * the file at build time, so they cannot drift from the asset the way
 * hand-written attributes do.
 */
export default function LinkedInVideo({
  embedUrl,
  url,
  poster,
  posterAlt,
  caption,
  width,
  height,
}) {
  const [playing, setPlaying] = useState(false);

  // The frame reserves the video's shape before anything loads, so swapping the
  // poster for the iframe cannot shift the page. The site's CLS is 0.00.
  const ratio = width && height ? `${width} / ${height}` : "16 / 9";
  const label = posterAlt || "LinkedIn video";

  return (
    <figure className={utilStyles.videoFigure}>
      <div className={utilStyles.videoFrame} style={{ aspectRatio: ratio }}>
        {playing ? (
          <iframe
            className={utilStyles.videoEmbed}
            src={embedUrl}
            title={label}
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a
            className={utilStyles.videoPlay}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Leave modified clicks to the browser — see the note above.
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              setPlaying(true);
            }}
          >
            {poster && (
              <img
                src={poster.src}
                alt=""
                width={poster.width}
                height={poster.height}
                loading="lazy"
                decoding="async"
              />
            )}
            {/* Drawn, not typed. A "▶" character renders as a colour emoji on
                several platforms, and emoji as interface iconography is an
                escalation trigger in the house design system. */}
            <span className={utilStyles.videoPlayMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
                <path d="M9 7.5v9l7-4.5-7-4.5z" fill="currentColor" />
              </svg>
            </span>
            {/* The accessible name. The poster is decorative once this exists —
                describing the image twice would announce it twice. */}
            <span className={utilStyles.srOnly}>Play video: {label}</span>
          </a>
        )}
      </div>
      {caption && <figcaption className={utilStyles.videoCaption}>{caption}</figcaption>}
    </figure>
  );
}
