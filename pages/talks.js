import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import allTalksData from "../lib/talks.json";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import DateUtil from "../components/date";


export default function Talks() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>All my conference / community event talks</h2>
        <p>I have been an active community speaker over the last several years. I have collected all my talks here, linked to their presentations and videos where possible.</p>
        <p>If you have any questions, or would like to invite me to a conference please reach out to me via my social media accounts.</p>
        <ul className={utilStyles.list}>
          {allTalksData
            .map(({ id, created, title, location, slides, video }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href="" as={slides}>
                  <a>{title}</a>
                </Link>{" "}
                {video ? (
                  <Link href="" as={video}>
                    <a>
                      <small>[Video]</small>
                    </a>
                  </Link>
                ) : null}
                <br />
                <small className={utilStyles.lightText}>
                  {location} - <DateUtil dateString={created} />
                </small>
              </li>
            ))}
        </ul>
      </section>
    </Layout>
  );
}
