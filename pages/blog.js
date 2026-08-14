import Layout from "../components/layout";
import Seo, { breadcrumb, PERSON_ID, WEBSITE_ID } from "../components/seo";
import { absoluteUrl, siteUrl } from "../lib/site";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import DateUtil from "../components/date";

export default function Blog({ allPostsData }) {
  return (
    <Layout>
      <Seo
        title="Blog archive"
        description="An archive of Mashhood Rastgar's early engineering blog posts, 2009 to 2015. Current writing is on the Harness Engineering newsletter."
        path="/blog"
        jsonLd={[
          {
            "@type": "CollectionPage",
            "@id": `${siteUrl}/blog#collection`,
            url: absoluteUrl("/blog"),
            name: "Blog archive",
            isPartOf: { "@id": WEBSITE_ID },
            author: { "@id": PERSON_ID },
            hasPart: allPostsData
              .filter(({ id }) => id)
              .map(({ id, title, date }) => ({
                "@type": "BlogPosting",
                "@id": `${absoluteUrl(`/posts/${id}`)}#post`,
                headline: title,
                url: absoluteUrl(`/posts/${id}`),
                datePublished: date,
                author: { "@id": PERSON_ID },
              })),
          },
          breadcrumb([{ name: "Blog archive", path: "/blog" }]),
        ]}
      />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h1 className={utilStyles.headingLg}>All Blog Posts.</h1>
        <p>I used to blog in my early days - these are all very old posts just kept here mainly for the record. I will be updating my newsletter on Substack going forward.</p>
        <ul className={utilStyles.list}>
          {allPostsData.map(
            ({ id, date, title }) =>
              id && (
                <li className={utilStyles.listItem} key={id}>
                  <Link href={`/posts/${id}`}>{title}</Link>
                  <br />
                  <small className={utilStyles.lightText}>{date ? <DateUtil dateString={date} /> : null}</small>
                </li>
              )
          )}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    },
  };
}
