import Head from "next/head";
import {
  absoluteUrl,
  contactEmail,
  employer,
  jobTitle,
  knowsAbout,
  name,
  offers,
  sameAs,
  siteDescription,
  siteTitle,
  siteUrl,
} from "../lib/site";

export const PERSON_ID = `${siteUrl}/#person`;
export const WEBSITE_ID = `${siteUrl}/#website`;

/**
 * The Person and WebSite nodes, emitted on every page.
 *
 * Both carry a stable `@id`, so page-level nodes below can reference the same
 * entity by id instead of restating it. Restating is what produces duplicate,
 * competing entities in a knowledge graph; referencing consolidates them.
 */
const PERSON = {
  "@type": "Person",
  "@id": PERSON_ID,
  name,
  url: siteUrl,
  image: absoluteUrl("/images/profile.jpg"),
  email: `mailto:${contactEmail}`,
  jobTitle,
  description: siteDescription,
  worksFor: { "@type": "Organization", name: employer.name, url: employer.url },
  knowsAbout,
  sameAs,
  makesOffer: offers.map(({ name: offerName, description }) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: offerName, description },
  })),
};

const WEBSITE = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: siteUrl,
  name: siteTitle,
  description: siteDescription,
  inLanguage: "en-GB",
  publisher: { "@id": PERSON_ID },
};

/**
 * @param {string}  [title]        Page-specific title. Omit for the homepage.
 * @param {string}  [description]  Page-specific description; falls back to site.
 * @param {string}  [path]         Path for canonical and og:url.
 * @param {string}  [type]         Open Graph type.
 * @param {object[]}[jsonLd]       Extra nodes appended to the @graph.
 * @param {boolean} [noindex]      Keep the page out of the index.
 */
export default function Seo({
  title,
  description = siteDescription,
  path = "/",
  type = "website",
  image = "/images/og.jpg",
  imageAlt = "Mashhood Rastgar speaking on stage",
  jsonLd = [],
  noindex = false,
}) {
  const fullTitle = title ? `${title} · ${name}` : siteTitle;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [PERSON, WEBSITE, ...jsonLd],
  };

  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={url} />
      {noindex && <meta key="robots" name="robots" content="noindex, follow" />}

      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:site_name" property="og:site_name" content={name} />
      <meta key="og:locale" property="og:locale" content="en_GB" />
      <meta key="og:image" property="og:image" content={imageUrl} />
      <meta key="og:image:width" property="og:image:width" content="1200" />
      <meta key="og:image:height" property="og:image:height" content="630" />
      <meta key="og:image:alt" property="og:image:alt" content={imageAlt} />

      <meta key="tw:card" name="twitter:card" content="summary_large_image" />
      <meta key="tw:title" name="twitter:title" content={fullTitle} />
      <meta key="tw:description" name="twitter:description" content={description} />
      <meta key="tw:image" name="twitter:image" content={imageUrl} />
      <meta key="tw:creator" name="twitter:creator" content="@mashhoodr" />

      {/* Answer engines read the rendered DOM, so this must be server-rendered
          markup, not injected on the client. */}
      <script
        key="jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
    </Head>
  );
}

/** Breadcrumbs for anything below the root. */
export function breadcrumb(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
