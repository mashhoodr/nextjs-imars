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
  "https://adplist.org/mentors/mashhood-rastgar",
  "https://www.strava.com/athletes/51580844",
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
