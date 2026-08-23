import Layout from "../components/layout";
import Seo, { breadcrumb, PERSON_ID, WEBSITE_ID } from "../components/seo";
import { absoluteUrl, siteUrl } from "../lib/site";
import allTalksData from "../lib/talks.json";
import utilStyles from "../styles/utils.module.css";
import TalkItem from "../components/talk-item";


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
              itemListElement: allTalksData.map(
                ({ title, created, location, slides, image }, i) => {
                  // Several entries are delivered remotely and were all being
                  // declared as in-person. A Place node for something called
                  // "Online" is wrong twice over: the mode and the location
                  // type. VirtualLocation is the correct node for those.
                  const online = /^online$/i.test((location || "").trim());
                  return {
                    "@type": "ListItem",
                    position: i + 1,
                    item: {
                      "@type": "Event",
                      name: title,
                      startDate: created,
                      eventStatus: "https://schema.org/EventScheduled",
                      eventAttendanceMode: online
                        ? "https://schema.org/OnlineEventAttendanceMode"
                        : "https://schema.org/OfflineEventAttendanceMode",
                      location: online
                        ? { "@type": "VirtualLocation", ...(slides ? { url: slides } : {}) }
                        : { "@type": "Place", name: location },
                      performer: { "@id": PERSON_ID },
                      // Event rich results want an image; absolute URLs only.
                      ...(image ? { image: absoluteUrl(image) } : {}),
                      ...(slides ? { url: slides } : {}),
                    },
                  };
                }
              ),
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
          {allTalksData.map((talk) => (
            <TalkItem key={talk.id} {...talk} />
          ))}
        </ul>
      </section>
    </Layout>
  );
}
