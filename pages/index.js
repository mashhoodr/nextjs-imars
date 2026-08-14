import Link from "next/link";
import Layout, { Section, siteTitle, siteUrl, contactEmail } from "../components/layout";
import Seo, { PERSON_ID, WEBSITE_ID } from "../components/seo";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import { getPodcastData } from "../lib/podcast";
import { getGoodReadsData } from "../lib/goodreads";
import { getAllWriting } from "../lib/writing";
import allTalksData from "../lib/talks.json";
import DateUtil from "../components/date";

// Talks before this date are framework/web-performance era. Splitting them keeps
// the older catalogue visible without it arguing against the current positioning.
// TODO: talks.json currently ends at Feb 2023. The recent AI talks (Harness
// Engineering, Future of Software Engineering, Loop Engineering, LUMS CS4602,
// TEDx 2026) still need dates, venues and links before the Recent group appears.
const RECENT_TALKS_FROM = "2023-06-01";

const OFFERS = [
  {
    name: "Keynotes and talks",
    body: "What is actually changing in engineering, and what it means for the room.",
  },
  {
    name: "Team workshops",
    body: "Three days, hands on, with your codebase and your tickets.",
  },
  {
    name: "Advisory",
    body: "Ongoing, for leaders making this shift at org level. A small number at a time.",
  },
];

// Logos live in public/logos/. `logo` omitted falls back to a text wordmark in
// the same tile, so the grid stays intact if an asset is ever missing.
// `tall` marks stacked lockups, which need more vertical room to match the wide
// wordmarks optically.
const COMPANIES = [
  { name: "Taleemabad", href: "https://taleemabad.com/", logo: "/logos/taleemabad.png" },
  { name: "Sastaticket.pk", href: "https://www.sastaticket.pk/", logo: "/logos/sastaticket.svg" },
  { name: "Novo Nordisk", href: "https://www.novonordisk.com/", logo: "/logos/novo-nordisk.png", tall: true },
  { name: "Contour Software", href: "https://contour-software.com/", logo: "/logos/contour.svg" },
  { name: "Arbisoft", href: "https://arbisoft.com/", logo: "/logos/arbisoft.svg" },
  { name: "Metamorphic AI", href: "https://metamorphic-ai.com", logo: "/logos/metamorphic.png" },
  { name: "LUMS", href: "https://www.lums.edu.pk/", logo: "/logos/lums.png", tall: true },
  {
    name: "Google Developer Expert (GDE)",
    href: "https://developers.google.com/community/experts",
    logo: "/logos/google-developers.svg",
  },
];

const SOCIALS = [
  ["Twitter", "https://twitter.com/mashhoodr"],
  ["LinkedIn", "http://linkedin.com/in/mashhoodr"],
  ["GitHub", "https://github.com/mashhoodr"],
  ["Instagram", "https://instagram.com/mashhoodr"],
  ["Strava", "https://www.strava.com/athletes/51580844"],
];

function FeedList({ items, limit = 3 }) {
  return (
    <ul className={utilStyles.list}>
      {items.slice(0, limit).map(({ id, created, title, link, description }) => (
        <li className={utilStyles.listItem} key={id}>
          <a className={utilStyles.itemTitle} href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
          <small className={utilStyles.meta}>
            <DateUtil dateString={new Date(created).toISOString()} />
          </small>
          {description && (
            <div
              className={utilStyles.excerpt}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function TalkItem({ title, location, created, slides, video }) {
  return (
    <li className={utilStyles.listItem}>
      <a className={utilStyles.itemTitle} href={slides} target="_blank" rel="noopener noreferrer">
        {title}
      </a>{" "}
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
        {location} · <DateUtil dateString={created} />
      </small>
    </li>
  );
}

export default function Home({
  allPostsData,
  allPodcastData,
  allBooksReadData,
  ownWriting,
  recentTalks,
  earlierTalks,
}) {
  return (
    <Layout home>
      <Seo
        path="/"
        jsonLd={[
          {
            "@type": "ProfilePage",
            "@id": `${siteUrl}/#profilepage`,
            url: siteUrl,
            name: siteTitle,
            isPartOf: { "@id": WEBSITE_ID },
            about: { "@id": PERSON_ID },
            mainEntity: { "@id": PERSON_ID },
          },
        ]}
      />

      <section className={utilStyles.hero}>
        <p className={utilStyles.sectionLabel}>Introduction</p>
        <h1 className={utilStyles.heroTitle}>
          Getting faster isn&rsquo;t the same as getting better.
        </h1>
        <p className={utilStyles.heroLede}>
          Your team ships more every week. Nobody can tell yet whether the work is improving.
        </p>
        <p>
          <a className={utilStyles.more} href={`mailto:${contactEmail}`}>
            [write me a short note]
          </a>
        </p>
      </section>

      <Section id="work" label="Work with me" title="Most teams are somewhere in the middle.">
        <div className={utilStyles.splitRow}>
          <div>
            <div className={utilStyles.splitFigure}>20%</div>
            <p className={utilStyles.splitCaption}>
              already have agents doing real work unsupervised
            </p>
          </div>
          <div>
            <div className={utilStyles.splitFigure}>60%</div>
            <p className={utilStyles.splitCaption}>using AI as a faster autocomplete</p>
          </div>
          <div>
            <div className={utilStyles.splitFigure}>20%</div>
            <p className={utilStyles.splitCaption}>
              holding back, usually for good reasons
            </p>
          </div>
        </div>

        <p className={utilStyles.sectionIntro}>
          The gap isn&rsquo;t effort. It&rsquo;s that nobody tells the middle sixty percent what
          good looks like. My job is moving them, without losing the twenty percent who are right
          to be cautious.
        </p>

        <ul className={utilStyles.offerList}>
          {OFFERS.map(({ name, body }) => (
            <li className={utilStyles.offer} key={name}>
              <div className={utilStyles.offerName}>{name}</div>
              <p className={utilStyles.offerBody}>{body}</p>
            </li>
          ))}
        </ul>

        <p>
          Tell me where your team sits.{" "}
          <a href={`mailto:${contactEmail}`}>The first coffee is on me.</a>
        </p>
      </Section>

      <Section id="proof" label="Track record" title="Where I have done this.">
        <ul className={utilStyles.logoWall}>
          {COMPANIES.map(({ name, href, logo, tall }) => (
            <li className={utilStyles.logoTile} key={name}>
              <a href={href} target="_blank" rel="noopener noreferrer" title={name}>
                {logo ? (
                  <img
                    className={`${utilStyles.logoImg} ${tall ? utilStyles.logoImgTall : ""}`}
                    src={logo}
                    alt={name}
                  />
                ) : (
                  <span className={utilStyles.logoWordmark}>{name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* Own articles only. The newsletter feed used to live here, but every
          post it listed now exists on this domain, so the feed was duplicating
          the section beneath it and sending readers away. Subscribing moved to
          the tail of #about, next to the archive. */}
      <Section id="writing" label="Writing" title="What I am thinking about.">
        <ul className={utilStyles.list}>
          {ownWriting.map(({ slug, title, date, description }) => (
            <li className={utilStyles.listItem} key={slug}>
              <Link className={utilStyles.itemTitle} href={`/writing/${slug}`}>
                {title}
              </Link>
              <small className={utilStyles.meta}>
                {date && <DateUtil dateString={date} />}
              </small>
              {description && <p className={utilStyles.excerpt}>{description}</p>}
            </li>
          ))}
        </ul>
        <Link className={utilStyles.more} href="/writing">
          [all writing]
        </Link>
      </Section>

      <Section id="podcast" label="Podcast" title="KarachiWalaDeveloper.">
        <FeedList items={allPodcastData} />
        <a
          className={utilStyles.more}
          href="https://anchor.fm/mashhoodr"
          target="_blank"
          rel="noopener noreferrer"
        >
          [listen to all the episodes]
        </a>
      </Section>

      <Section id="talks" label="Talks" title="Conferences and community events.">
        {recentTalks.length > 0 && (
          <>
            <p className={utilStyles.subheading}>Recent</p>
            <ul className={utilStyles.list}>
              {recentTalks.map((talk) => (
                <TalkItem key={talk.id} {...talk} />
              ))}
            </ul>
          </>
        )}

        {earlierTalks.length > 0 && (
          <>
            <p className={utilStyles.subheading}>
              {recentTalks.length > 0 ? "Earlier — web performance and frontend" : "Selected"}
            </p>
            <ul className={utilStyles.list}>
              {earlierTalks.map((talk) => (
                <TalkItem key={talk.id} {...talk} />
              ))}
            </ul>
          </>
        )}

        <Link className={utilStyles.more} href="/talks">
          [all the talks]
        </Link>
      </Section>

      <Section id="about" label="About" title="The rest of it.">
        <p>
          I am an engineering and AI leader based in Karachi. Right now I am helping{" "}
          <a href="http://taleemabad.com/">Taleemabad</a>, the largest ed-tech in Pakistan, scale
          to thousands of schools and millions of children, and rebuilding how the organisation
          itself works around agents.
        </p>
        <p>
          I offer free coaching and mentoring sessions on{" "}
          <a href="https://adplist.org/mentors/mashhood-rastgar" target="_blank" rel="noopener noreferrer">
            ADPList
          </a>
          . When I am not working you will find me cycling, running and swimming, slowly working
          towards a triathlon.
        </p>

        <p className={utilStyles.subheading}>Reading</p>
        <ul className={`${utilStyles.list} ${utilStyles.bookReviewImages}`}>
          {allBooksReadData.slice(0, 4).map(({ id, title, description }) => (
            <li className={utilStyles.listItem} key={id}>
              <span className={utilStyles.itemTitle}>{title}</span>
              <div
                className={utilStyles.excerpt}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </li>
          ))}
        </ul>
        <a
          className={utilStyles.more}
          href="https://www.goodreads.com/user/show/12569798-mashhood"
          target="_blank"
          rel="noopener noreferrer"
        >
          [my book reviews]
        </a>

        <p className={utilStyles.subheading}>Elsewhere</p>
        <ul className={utilStyles.inlineList}>
          {SOCIALS.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="me noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className={utilStyles.subheading}>Archive</p>
        <ul className={utilStyles.list}>
          {allPostsData.slice(0, 3).map(
            ({ id, date, title }) =>
              id && (
                <li className={utilStyles.listItem} key={id}>
                  <Link className={utilStyles.itemTitle} href={`/posts/${id}`}>
                    {title}
                  </Link>
                  {date && (
                    <small className={utilStyles.meta}>
                      <DateUtil dateString={date} />
                    </small>
                  )}
                </li>
              )
          )}
        </ul>
        <Link className={utilStyles.more} href="/blog">
          [older posts, 2009 to 2013]
        </Link>

        <p className={utilStyles.subheading}>Newsletter</p>
        <p>
          Everything above goes out by email first. No schedule, no filler.
        </p>
        <a
          className={utilStyles.more}
          href="https://mashhoodr.substack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          [subscribe]
        </a>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const allPodcastData = await getPodcastData();
  const allBooksReadData = await getGoodReadsData();
  const ownWriting = getAllWriting().slice(0, 5);

  // Filter before slicing. The previous order sliced first, so only featured
  // talks that happened to fall in the first 8 entries could ever be shown.
  const featured = allTalksData.filter(({ featured }) => featured);
  const recentTalks = featured.filter(({ created }) => created >= RECENT_TALKS_FROM).slice(0, 6);
  const earlierTalks = featured
    .filter(({ created }) => created < RECENT_TALKS_FROM)
    .slice(0, recentTalks.length > 0 ? 4 : 6);

  return {
    props: {
      allPostsData,
      allPodcastData,
      allBooksReadData,
          ownWriting,
      recentTalks,
      earlierTalks,
    },
    // External feeds are fetched at build time, so without this the podcast and
    // newsletter lists freeze at whenever the site was last deployed.
    revalidate: 3600,
  };
}
