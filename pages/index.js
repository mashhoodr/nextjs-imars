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
          Hello, I’m <strong>Mashhood</strong>. I’m an engineering and AI leader and coach.
        </p>
        <p>
          Currently, I am helping <a href="http://taleemabad.com/">Taleemabad</a>, the largest ed-tech in Pakistan, scale their products to thousands of schools and millions of children. We are using AI to make education more accessible and affordable for everyone.
        </p>
        <p>Taleemabad is on a mission to bring quality education to public schools - where most of Pakistani students are studying. You can learn more about their story <a href="https://www.youtube.com/watch?v=YGwgUCgEWPk">here</a>.</p>
        <p>We are also exploring the future of work with fluid roles and agentic organization. Connect with me if you would like to learn more!</p>
        <p>
          I used to lead the engineering team at <a href="https://sastaticket.pk">Sastaticket.pk</a>, the largest travel platform in Pakistan.
        </p>
        <p>
          Previously I was the founder and technical lead at <a href="http://recurship.com">Recurship</a>, a boutique development studio for startups.
        </p>
        <p>I am also a <a href="https://developers.google.com/community/experts">Google Developer Expert</a> for Machine Learning / AI, and for Web as well.</p>
        <p>I enjoy reading <a href="https://www.goodreads.com/user/show/12569798-mashhood" target="_blank">books</a> and educating my local community using <Link href="/blog">blog posts</Link>, <a href="https://anchor.fm/mashhoodr" target="_blank">my podcast</a> and <Link href="/talks">talks at community events.</Link></p>
        <p>When Im not working, you will find me <a href="https://www.strava.com/athletes/51580844" target="_blank">working on my fitness</a> - currently cycling, running and swimming as time permits. Hoping to become a tri-athelete in the coming years.</p>
        <p>I offer free coaching / mentoring sessions on ADPList. <a href="https://adplist.org/mentors/mashhood-rastgar" target="_blank">You may request a session with me from here.</a></p>
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
                <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
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
                <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
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
                <a href={slides} target="_blank" rel="noopener noreferrer">{title}</a>{" "}
                {video ? (
                  <a href={video} target="_blank" rel="noopener noreferrer">
                    <small>[Video]</small>
                  </a>
                ) : null}
                <br />
                <small className={utilStyles.lightText}>
                  {location} - <DateUtil dateString={created} />
                </small>
              </li>
            ))}
        </ul>
        <Link href="/talks">
          <small className={utilStyles.smallHeading}>[all the talks here]</small>
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
        <a href="https://www.goodreads.com/user/show/12569798-mashhood" target="_blank" rel="noopener noreferrer">
          <small className={utilStyles.smallHeading}>[check out my book reviews]</small>
        </a>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Archived blog posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.slice(0, 5).map(
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
        <Link href="/blog">
          <small className={utilStyles.smallHeading}>[all the blog posts here]</small>
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
