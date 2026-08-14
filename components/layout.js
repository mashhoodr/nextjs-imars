import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";

// Identity now lives in lib/site.js so the sitemap and JSON-LD can read the same
// values. Re-exported here because pages already import them from this module.
export {
  name,
  siteTitle,
  siteDescription,
  siteUrl,
  contactEmail,
} from "../lib/site";
// `export ... from` re-exports without binding the names locally, so anything
// this component actually renders has to be imported too.
import { name, contactEmail } from "../lib/site";

// Rail order mirrors the section order on the homepage.
export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "proof", label: "Track record" },
  { id: "writing", label: "Writing" },
  { id: "podcast", label: "Podcast" },
  { id: "talks", label: "Talks" },
  { id: "about", label: "About" },
];

/**
 * Marks the rail item for whichever section is currently nearest the top of the
 * viewport. Only runs on the homepage, where the anchors actually exist.
 */
function useActiveSection(enabled) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const targets = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;

    let frame = 0;

    // The active section is the last one whose top has crossed a trigger line a
    // quarter down the viewport. IntersectionObserver is a poor fit here: these
    // sections are taller than the viewport, so several are "intersecting" at
    // once and the marker sticks on whichever entered first.
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.25;
      let current = null;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      // The final section is often too short to reach the line, so claim it once
      // the page is scrolled to the bottom.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? targets[targets.length - 1].id : current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return active;
}

export default function Layout({ children, home }) {
  const active = useActiveSection(home);

  return (
    <div className={styles.shell}>
      {/* Everything else that belongs in <head> is emitted by <Seo>, which each
          page renders with its own title, description and canonical. Keeping it
          out of here is what stopped /blog and /talks sharing one title. */}
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" type="application/rss+xml" title="Harness Engineering — Substack" href="https://mashhoodr.substack.com/feed" />
      </Head>

      <aside className={styles.rail}>
        <div className={styles.railTop}>
          <Link href="/">
            <img src="/images/profile.jpg" className={styles.avatar} alt={name} />
          </Link>
          <p className={styles.wordmark}>
            <Link href="/">{name}</Link>
          </p>
        </div>

        <nav className={styles.nav}>
          {SECTIONS.map(({ id, label }) => (
            <Link
              key={id}
              href={`/#${id}`}
              className={`${styles.navLink} ${active === id ? styles.navLinkActive : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.railFoot}>
          <a className={styles.noteLink} href={`mailto:${contactEmail}`}>
            [write me a short note]
          </a>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.inner}>
          {children}
          {!home && (
            <div className={styles.backToHome}>
              <Link href="/">[back to home]</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** Section label + heading, the r4b rhythm. */
export function Section({ id, label, title, children }) {
  return (
    <section id={id} className={utilStyles.section}>
      {label && <p className={utilStyles.sectionLabel}>{label}</p>}
      {title && <h2 className={utilStyles.sectionTitle}>{title}</h2>}
      {children}
    </section>
  );
}
