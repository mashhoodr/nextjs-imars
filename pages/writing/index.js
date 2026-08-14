import Link from "next/link";
import Layout from "../../components/layout";
import Seo, { breadcrumb, PERSON_ID, WEBSITE_ID } from "../../components/seo";
import { absoluteUrl, siteUrl } from "../../lib/site";
import { getAllWriting } from "../../lib/writing";
import DateUtil from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

export default function Writing({ articles }) {
  return (
    <Layout>
      <Seo
        title="Writing"
        description="Essays on agentic engineering, AI transformation and what changes in engineering practice when agents write the code."
        path="/writing"
        jsonLd={[
          {
            "@type": "Blog",
            "@id": `${siteUrl}/writing#blog`,
            url: absoluteUrl("/writing"),
            name: "Writing — Mashhood Rastgar",
            description:
              "Essays on agentic engineering, AI transformation and engineering leadership.",
            isPartOf: { "@id": WEBSITE_ID },
            author: { "@id": PERSON_ID },
            inLanguage: "en-GB",
            blogPost: articles.map(({ slug, title, date, description }) => ({
              "@type": "BlogPosting",
              "@id": `${absoluteUrl(`/writing/${slug}`)}#article`,
              headline: title,
              url: absoluteUrl(`/writing/${slug}`),
              datePublished: date,
              description,
              author: { "@id": PERSON_ID },
            })),
          },
          breadcrumb([{ name: "Writing", path: "/writing" }]),
        ]}
      />

      <section className={utilStyles.section}>
        <p className={utilStyles.sectionLabel}>Writing</p>
        <h1 className={utilStyles.articleTitle}>What I am thinking about.</h1>
        <p className={utilStyles.lede}>
          Longer pieces on agentic engineering and what changes in engineering practice when
          agents write the code. Shorter notes go out on the newsletter.
        </p>

        {articles.length === 0 ? (
          <p className={utilStyles.meta}>Nothing published here yet.</p>
        ) : (
          <ul className={utilStyles.list}>
            {articles.map(({ slug, title, date, description }) => (
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
        )}

        <a
          className={utilStyles.more}
          href="https://mashhoodr.substack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          [subscribe to the newsletter]
        </a>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return { props: { articles: getAllWriting() } };
}
