import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import { getPodcastData } from "../lib/podcast";
import { getGoodReadsData } from "../lib/goodreads";
import { getSubstackData } from "../lib/substack";
import allTalksData from "../lib/talks.json";
import Link from "next/link";
import DateUtil from "../components/date";

export default function Home({ allPostsData, allPodcastData, allBooksReadData, allBlogData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hello, I’m <strong>Mashhood</strong>. I’m a software engineer and a community leader.
        </p>
        <p>
          Currently, I am leading the engineering team at <a href="https://sastaticket.pk">Sastaticket.pk</a>, the largest travel platform in Pakistan.
        </p>
        <p>
          Previously I was the founder and technical lead at <a href="http://recurship.com">Recurship</a>, a boutique development studio for startups.
        </p>
        <p>I am also a <a href="https://developers.google.com/community/experts">Google Developer Expert</a> for Web and Angular.</p>
        <p>I enjoy reading <a href="https://www.goodreads.com/user/show/12569798-mashhood" target="_blank">books</a> and educating my local community using <Link href="/blog"><a>blog posts</a></Link>, <a href="https://anchor.fm/mashhoodr" target="_blank">my podcast</a> and <Link href="/talks"><a>talks at community events.</a></Link></p>
        <p>When Im not working, you will find me <a href="https://www.strava.com/athletes/51580844" target="_blank">working on my fitness</a> - currently cycling, running and swimming as time permits. Hoping to become a tri-athelete in the coming years.</p>
        <p>I have recently joined ADPList as a mentor. <a href="https://adplist.org/mentors/mashhood-rastgar" target="_blank">You may book a session with me from here.</a></p>
        <p>&nbsp;</p>
        <p>You can find me at:</p>
        <ul>
          <li>
            <a target="_blank" href="https://twitter.com/mashhoodr">Twitter</a>
          </li>
          <li>
            <a target="_blank" href="https://facebook.com/mashhoodr">Facebook</a>
          </li>
          <li>
            <a target="_blank" href="http://linkedin.com/in/mashhoodr">LinkedIn</a>
          </li>
          <li>
            <a target="_blank" href="https://github.com/mashhoodr">Github</a>
          </li>
          <li>
            <a target="_blank" href="https://instagram.com/mashhoodr">Instagram</a>
          </li>
          <li>
            <a target="_blank" href="https://www.strava.com/athletes/51580844">Strava</a>
          </li>
        </ul>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>
          Latest from my podcast
        </h2>
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
            ) : null
          )}
          <li className={utilStyles.listItem}></li>
        </ul>
        <a href="https://anchor.fm/mashhoodr" target="_blank">
          <small className={utilStyles.smallHeading}>[listen to all the episodes here]</small>
        </a>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>
          What am I thinking about...
        </h2>
        <ul className={utilStyles.list}>
          {allBlogData.map(({ id, created, title, link, description }, index) =>
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
            ) : null
          )}
          <li className={utilStyles.listItem}></li>
        </ul>
        <a href="https://mashhoodr.substack.com">
          <small className={utilStyles.smallHeading}>[read all the posts here]</small>
        </a>
      </section>



      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Most recent (featured) talks</h2>
        <ul className={utilStyles.list}>
          {allTalksData
            .slice(0, 8)
            .filter(({ featured }) => featured)
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
        <Link href="/talks">
          <a>
            <small className={utilStyles.smallHeading}>[all the talks here]</small>
          </a>
        </Link>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>
          Recently read / reviewed books
        </h2>
        <ul className={`${utilStyles.list} ${utilStyles.bookReviewImages}`}>
          {allBooksReadData.slice(0, 5).map(({ id, title, description }) =>
            <li className={utilStyles.listItem} key={id}>
              {title}
              <small className={utilStyles.lightText}>
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </small>
            </li>
          )}
          <li className={utilStyles.listItem}></li>
        </ul>
        <Link href="https://www.goodreads.com/user/show/12569798-mashhood">
          <a>
            <small className={utilStyles.smallHeading}>[check out my book reviews]</small>
          </a>
        </Link>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Archived blog posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.slice(0, 5).map(
            ({ id, date, title }) =>
              id && (
                <li className={utilStyles.listItem} key={id}>
                  <Link href="/posts/[id]" as={`/posts/${id}`}>
                    <a>{title}</a>
                  </Link>
                  <br />
                  <small className={utilStyles.lightText}>{date ? <DateUtil dateString={date} /> : null}</small>
                </li>
              )
          )}
        </ul>
        <Link href="/blog">
          <a>
            <small className={utilStyles.smallHeading}>[all the blog posts here]</small>
          </a>
        </Link>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const allPodcastData = await getPodcastData();
  const allBooksReadData = await getGoodReadsData();
  const allBlogData = await getSubstackData();
  return {
    props: {
      allPostsData,
      allPodcastData,
      allBooksReadData,
      allBlogData,
    },
  };
}
