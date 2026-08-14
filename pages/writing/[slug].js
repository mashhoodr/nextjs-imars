import Link from "next/link";
import Layout from "../../components/layout";
import Seo, { breadcrumb, PERSON_ID } from "../../components/seo";
import { absoluteUrl, contactEmail } from "../../lib/site";
import { getWriting, getWritingSlugs } from "../../lib/writing";
import DateUtil from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

export default function Article({ article }) {
  const path = `/writing/${article.slug}`;

  return (
    <Layout>
      <Seo
        title={article.title}
        description={article.description}
        path={path}
        type="article"
        jsonLd={[
          {
            "@type": "Article",
            "@id": `${absoluteUrl(path)}#article`,
            headline: article.title,
            description: article.description,
            url: absoluteUrl(path),
            datePublished: article.date,
            // Freshness is a real retrieval signal, so this reflects the file
            // rather than defaulting to "now".
            dateModified: article.updated || article.date,
            author: { "@id": PERSON_ID },
            publisher: { "@id": PERSON_ID },
            mainEntityOfPage: absoluteUrl(path),
            inLanguage: "en-GB",
            timeRequired: `PT${article.readingMinutes}M`,
            ...(article.tags.length ? { keywords: article.tags.join(", ") } : {}),
            // Declares the conversation this piece sits in. Answer engines use
            // it to relate sources rather than treating the page as isolated.
            ...(article.source
              ? {
                  isBasedOn: {
                    "@type": "CreativeWork",
                    name: article.source.title,
                    url: article.source.url,
                  },
                }
              : {}),
          },
          breadcrumb([
            { name: "Writing", path: "/writing" },
            { name: article.title, path },
          ]),
        ]}
      />

      <article className={utilStyles.article}>
        <p className={utilStyles.sectionLabel}>Writing</p>
        <h1 className={utilStyles.articleTitle}>{article.title}</h1>

        <p className={utilStyles.meta}>
          {article.date && <DateUtil dateString={article.date} />}
          {" · "}
          {article.readingMinutes} min read
          {article.updated && article.updated !== article.date && (
            <>
              {" · updated "}
              <DateUtil dateString={article.updated} />
            </>
          )}
        </p>

        {/* The thing being responded to, before the response. Placed above the
            body because it is context the reader needs first, not a footnote. */}
        {article.source && (
          <p className={utilStyles.sourceNote}>
            <span className={utilStyles.sourceLabel}>In response to</span>
            <a href={article.source.url} target="_blank" rel="noopener noreferrer">
              {article.source.title}
            </a>
            <span className={utilStyles.sourceHost}>{article.source.host}</span>
          </p>
        )}

        <div
          className={utilStyles.prose}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        <hr className={utilStyles.articleRule} />

        <p className={utilStyles.articleFoot}>
          Written by Mashhood Rastgar, who helps engineering organisations become agent-native.
          If this is your situation,{" "}
          <a href={`mailto:${contactEmail}`}>tell me where your team sits</a>.
          {article.originallyPublishedAt && (
            <>
              {" "}
              <a href={article.originallyPublishedAt} target="_blank" rel="noopener noreferrer">
                Also on the newsletter
              </a>
              .
            </>
          )}
        </p>

        <p>
          <Link className={utilStyles.more} href="/writing">
            [all writing]
          </Link>
        </p>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  return { paths: getWritingSlugs(), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { article: await getWriting(params.slug) } };
}
