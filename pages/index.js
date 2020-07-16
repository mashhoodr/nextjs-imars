import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import { getPodcastData } from "../lib/podcast";
import allTalksData from "../lib/talks.json";
import Link from "next/link";
import DateUtil from "../components/date";

export default function Home({ allPostsData, allPodcastData, allTalksData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hello, I’m <strong>Mashhood</strong>. I’m a software engineer and a community leader.
        </p>
        <p>I am also a Google Developer Expert for Web and Angular.</p>
        <p>
          You can contact me on:
          <ul>
            <li>
              <a href="https://twitter.com/mashhoodr">Twitter</a>
            </li>
            <li>
              <a href="https://twitter.com/mashhoodr">Facebook</a>
            </li>
            <li>
              <a href="https://twitter.com/mashhoodr">LinkedIn</a>
            </li>
            <li>
              <a href="https://twitter.com/mashhoodr">Upwork</a>
            </li>
          </ul>
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Podcast: Karachi Wala Developer</h2>
        <ul className={utilStyles.list}>
          {allPodcastData.map(({ id, created, title, link, description }, index) =>
            index < 3 ? (
              <li className={utilStyles.listItem} key={id}>
                <Link href="" as={link}>
                  <a>{title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <DateUtil dateString={new Date(created).toISOString()} />
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </small>
              </li>
            ) : (
              ""
            )
          )}
          <li className={utilStyles.listItem}>
            <Link href="https://anchor.fm/mashhoodr">
              <a>
                <small>> Listen to the rest all of them here.</small>
              </a>
            </Link>
          </li>
        </ul>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Talks</h2>
        <ul className={utilStyles.list}>
          {allTalksData.map(({ id, created, title, location, slides, video }) => (
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

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <DateUtil dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const allPodcastData = await getPodcastData();
  return {
    props: {
      allPostsData,
      allPodcastData,
      allTalksData,
    },
  };
}
