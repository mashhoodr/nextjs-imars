import Layout from "../components/layout";
import Seo, { breadcrumb, PERSON_ID, WEBSITE_ID } from "../components/seo";
import { absoluteUrl, contactEmail, siteUrl } from "../lib/site";
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
                ({ title, created, location, slides, link, image, description, audience }, i) => {
                  // Several entries are delivered remotely and were all being
                  // declared as in-person. A Place node for something called
                  // "Online" is wrong twice over: the mode and the location
                  // type. VirtualLocation is the correct node for those.
                  const online = /^online$/i.test((location || "").trim());
                  const url = slides || link;
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
                      // A few entries have no recorded venue. Emitting a Place
                      // with an empty name is worse than emitting nothing.
                      ...(online
                        ? { location: { "@type": "VirtualLocation", ...(url ? { url } : {}) } }
                        : location
                        ? { location: { "@type": "Place", name: location } }
                        : {}),
                      performer: { "@id": PERSON_ID },
                      ...(description ? { description } : {}),
                      // How many people were actually in the room. This is the
                      // one number on the page a conference organiser is
                      // looking for, so it is machine-readable too.
                      ...(audience ? { maximumAttendeeCapacity: audience } : {}),
                      // Event rich results want an image; absolute URLs only.
                      ...(image ? { image: absoluteUrl(image) } : {}),
                      ...(url ? { url } : {}),
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
        <p>
          I have been an active community speaker for over a decade. Everything is collected
          here, newest first, linked to slides, recordings or the event itself where those
          exist. The recent sessions are mostly about agentic engineering, Gemini CLI and what
          AI is doing to the way software gets built; the earlier ones are from a career spent
          on the web platform and performance.
        </p>
        <p>
          If you would like me to speak at your conference or run a session for your team,{" "}
          <a href={`mailto:${contactEmail}`}>write me a short note</a>.
        </p>
        <ul className={utilStyles.list}>
          {allTalksData.map((talk) => (
            <TalkItem key={talk.id} {...talk} />
          ))}
        </ul>
      </section>
    </Layout>
  );
}
