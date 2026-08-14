import Layout from "../components/layout";
import Seo, { breadcrumb, PERSON_ID, WEBSITE_ID } from "../components/seo";
import { absoluteUrl, siteUrl } from "../lib/site";
import allTalksData from "../lib/talks.json";
import utilStyles from "../styles/utils.module.css";
import DateUtil from "../components/date";


export default function Talks() {
  return (
    <Layout>
      <Seo
        title="Talks and conference appearances"
        description="Every conference keynote, workshop and community talk Mashhood Rastgar has given, with slides and video where available."
        path="/talks"
        jsonLd={[
          {
            "@type": "CollectionPage",
            "@id": `${siteUrl}/talks#collection`,
            url: absoluteUrl("/talks"),
            name: "Talks and conference appearances",
            isPartOf: { "@id": WEBSITE_ID },
            about: { "@id": PERSON_ID },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: allTalksData.length,
              itemListElement: allTalksData.map(({ title, created, location, slides }, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Event",
                  name: title,
                  startDate: created,
                  eventStatus: "https://schema.org/EventScheduled",
                  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                  location: { "@type": "Place", name: location },
                  performer: { "@id": PERSON_ID },
                  ...(slides ? { url: slides } : {}),
                },
              })),
            },
          },
          breadcrumb([{ name: "Talks", path: "/talks" }]),
        ]}
      />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h1 className={utilStyles.headingLg}>All my conference / community event talks</h1>
        <p>I have been an active community speaker over the last several years. I have collected all my talks here, linked to their presentations and videos where possible.</p>
        <p>If you have any questions, or would like to invite me to a conference please reach out to me via my social media accounts.</p>
        <ul className={utilStyles.list}>
          {allTalksData
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
      </section>
    </Layout>
  );
}
