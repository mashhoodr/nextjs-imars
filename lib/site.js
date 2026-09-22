/**
 * Single source of truth for identity, URLs and the entity description.
 *
 * Everything that describes the site to a machine — <title>, meta description,
 * Open Graph, JSON-LD, the sitemap — reads from here, so the three can never
 * drift apart. Drift is the usual cause of an entity being read as two people.
 */

export const siteUrl = "https://karachiwala.dev";
export const name = "Mashhood Rastgar";
export const contactEmail = "hello@karachiwala.dev";

export const siteTitle =
  "Mashhood Rastgar — helping engineering organisations become agent-native";

export const siteDescription =
  "Harness engineering and agentic transformation for engineering organisations. Keynotes, team workshops and advisory.";

/**
 * ADPList mentor handle. The profile URL in `sameAs` below is built from it,
 * and lib/adplist.js resolves the review feed through it, so the handle is
 * stated once here rather than in three places.
 */
export const adplistSlug = "mashhood-rastgar";

/** Job title and employer, stated once. Used in JSON-LD and the About copy. */
export const jobTitle = "Head of Engineering";
export const employer = { name: "Taleemabad", url: "https://taleemabad.com/" };

/**
 * Every profile that resolves to the same person. `sameAs` is how search and
 * answer engines merge these into one entity rather than several weak ones,
 * so an omission here costs authority everywhere.
 */
export const sameAs = [
  "https://www.linkedin.com/in/mashhoodr",
  "https://twitter.com/mashhoodr",
  "https://github.com/mashhoodr",
  "https://mashhoodr.substack.com",
  "https://www.instagram.com/mashhoodr",
  "https://www.goodreads.com/user/show/12569798-mashhood",
  `https://adplist.org/mentors/${adplistSlug}`,
  "https://www.strava.com/athletes/51580844",
];

/**
 * Public profiles, with the labels used to render them. `sameAs` above is the
 * machine-readable list; this is the human-facing one, and both are here so a
 * profile cannot be added to one and forgotten in the other.
 *
 * Rendered in two places — the About section and the left rail — which is why
 * it no longer lives in pages/index.js.
 */
export const socials = [
  ["Twitter", "https://twitter.com/mashhoodr"],
  // Was http:// and without the www, which redirects twice before landing.
  // The canonical form is the one in sameAs above.
  ["LinkedIn", "https://www.linkedin.com/in/mashhoodr"],
  ["GitHub", "https://github.com/mashhoodr"],
  ["Instagram", "https://www.instagram.com/mashhoodr"],
  ["Strava", "https://www.strava.com/athletes/51580844"],
  ["ADPList", `https://adplist.org/mentors/${adplistSlug}`],
];

/** Topics the entity is an authority on. Plain nouns, not marketing phrases. */
export const knowsAbout = [
  "Agentic engineering",
  "Harness engineering",
  "AI adoption in engineering organisations",
  "Engineering leadership",
  "Developer productivity",
  "Software engineering",
  "Artificial intelligence",
];

/** The three offers, stated once for both the page and `makesOffer`. */
export const offers = [
  {
    name: "Keynotes and talks",
    description:
      "What is actually changing in engineering, and what it means for the room.",
  },
  {
    name: "Team workshops",
    description:
      "Three days, hands on, with your codebase and your tickets.",
  },
  {
    name: "Advisory",
    description:
      "Ongoing, for leaders making this shift at org level. A small number at a time.",
  },
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
