import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";

export const name = "Mashhood Rastgar";
export const siteTitle =
  "Mashhood Rastgar — helping engineering organisations become agent-native";
export const siteDescription =
  "Harness engineering and agentic transformation for engineering organisations. Keynotes, team workshops and advisory.";
export const siteUrl = "https://karachiwala.dev";
export const contactEmail = "hello@karachiwala.dev";

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
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={siteDescription} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/images/og.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mashhood Rastgar speaking on stage" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/og.jpg`} />
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
