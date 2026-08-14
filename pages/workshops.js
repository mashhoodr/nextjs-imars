import Link from "next/link";
import Layout from "../components/layout";
import Seo, { breadcrumb, PERSON_ID } from "../components/seo";
import { absoluteUrl, contactEmail, siteUrl } from "../lib/site";
import utilStyles from "../styles/utils.module.css";

/**
 * The page the L&D buyer needs.
 *
 * Executives search the problem ("is AI actually making my team faster").
 * L&D searches the category and the logistics — duration, format, group size,
 * whether it runs on our stack, what people can do afterwards. The homepage
 * spoke only executive, so half the buying committee had nothing to read.
 *
 * Copy devices borrowed from jugnu.academy (the same house voice): "the gap
 * isn't X — it's Y", the "Not X. Not Y. Z." triad, and opening on the reader's
 * situation rather than the offer. Jugnu's *argument* is deliberately not
 * borrowed: it positions against training budgets, which would be
 * self-defeating here.
 */

const DAYS = [
  {
    label: "Day one",
    title: "Where the team actually is",
    body:
      "We measure before we change anything. Intervention rate — how often a human had to step in before a task was done — on real tickets from your backlog. Most teams discover the number is not what they assumed, and that different squads are in completely different places.",
  },
  {
    label: "Day two",
    title: "Building the harness",
    body:
      "The scaffolding, guardrails and feedback loops. Research and planning as written artefacts rather than chat. Specifications that compile into tests. Hooks that enforce quality deterministically, so nothing depends on anyone remembering. All of it in your repository, on your CI.",
  },
  {
    label: "Day three",
    title: "Trusting the output",
    body:
      "What review is for when the agent wrote the code, and why clean code with passing tests can still be wrong. Turning each failure into a skill with tests behind it, so it cannot recur. The team leaves with the loop running and the habits installed.",
  },
];

const OUTCOMES = [
  ["A number you can track", "Intervention rate, measured on your own work, with a baseline taken on day one and a way to keep measuring after we finish."],
  ["Working scaffolding in your repo", "Not slides. Plans, specs, hooks and tests that were written during the three days and are still there on Monday."],
  ["A shared vocabulary", "The whole team describing the same problems the same way, which is most of what makes a practice stick."],
  ["Habits formed early", "The patterns get set in the first few months of agent use. Setting them deliberately is far cheaper than correcting them later."],
];

const FAQ = [
  {
    q: "How long is it, and can it be shorter?",
    a: "Three days is the full version, and it is the one I recommend, because day three is where the habits actually set. I also run a three-hour hands-on session and a half-day version for larger groups — those work well as a way to build the internal case before committing a team for three days.",
  },
  {
    q: "Is it remote or in person?",
    a: "Both. In person is better for a single co-located team, because the side conversations are half the value. Remote works well for distributed teams and for running the same session across time zones.",
  },
  {
    q: "Do you use our codebase, or examples?",
    a: "Yours. We work against your repository and your backlog, because the failures that matter are the ones your code produces, not the ones a sample project produces. A toy example teaches the idea and leaves the transfer to chance.",
  },
  {
    q: "What do people need to know beforehand?",
    a: "Working engineers who can read and review code in your stack. No prior agent experience is required, and mixed levels are usually an advantage — the teams who are already ahead end up teaching the rest, which is exactly the transfer you want.",
  },
  {
    q: "Who should attend?",
    a: "The engineers doing the work, plus whoever will own the practice afterwards. An engineering manager or staff engineer in the room makes the difference between a good three days and a change that survives.",
  },
  {
    q: "Can it be customised?",
    a: "It has to be. The shape stays the same; the content depends on your stack, your review culture and where the team currently sits. We agree that on a call before anything is scheduled.",
  },
  {
    q: "How do we know it worked?",
    a: "The baseline from day one. Intervention rate is the measure, and it is deliberately unflattering: it counts how often a human had to rescue the work. Velocity will look good whether or not anything improved, which is why it is the wrong measure.",
  },
];

export default function Workshops() {
  const path = "/workshops";

  return (
    <Layout>
      <Seo
        title="AI and agentic engineering workshops for engineering teams"
        description="A three-day hands-on workshop that makes an engineering team agent-native, run on your own codebase and backlog. Remote or in person, customised to your stack."
        path={path}
        jsonLd={[
          {
            "@type": "Service",
            "@id": `${siteUrl}/workshops#service`,
            name: "Agentic engineering team workshop",
            serviceType: "Engineering team training",
            description:
              "A three-day hands-on workshop that takes an engineering team from using AI as autocomplete to running agents on real work, measured by intervention rate. Delivered against the client's own codebase and backlog, remote or in person.",
            provider: { "@id": PERSON_ID },
            url: absoluteUrl(path),
            areaServed: "Worldwide",
            audience: {
              "@type": "Audience",
              audienceType:
                "Engineering teams, engineering leadership, learning and development",
            },
          },
          {
            // Real questions an L&D buyer asks, answered on the page. FAQPage is
            // one of the few schema types answer engines quote from directly.
            "@type": "FAQPage",
            "@id": `${siteUrl}/workshops#faq`,
            mainEntity: FAQ.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          },
          breadcrumb([{ name: "Workshops", path }]),
        ]}
      />

      <section className={utilStyles.hero}>
        <p className={utilStyles.sectionLabel}>Team workshops</p>
        <h1 className={utilStyles.articleTitle}>
          Your team has the tools. Nobody has shown them what good looks like.
        </h1>
        <p className={utilStyles.lede}>
          Three days, hands on, in your codebase. The team leaves with agents doing real work,
          a number to track it by, and the scaffolding still sitting in your repository.
        </p>
        <p>
          <a className={utilStyles.more} href={`mailto:${contactEmail}`}>
            [ask about a workshop]
          </a>
        </p>
      </section>

      <section className={utilStyles.section}>
        <p className={utilStyles.sectionLabel}>The gap</p>
        <h2 className={utilStyles.sectionTitle}>The gap isn&rsquo;t the budget.</h2>
        <p className={utilStyles.sectionIntro}>
          Most organisations have already bought the licences. Usage is up, output is up, and
          nobody can say whether the work is getting better. The gap isn&rsquo;t training
          spend and it isn&rsquo;t effort — it&rsquo;s that no one has told the team what good
          looks like, in their codebase, on their work.
        </p>
        <p className={utilStyles.sectionIntro}>
          It is also getting more expensive to leave. Habits set in the first few months of
          agent use, and they set whether or not anyone designs them. Correcting a practice is
          slower than forming one.
        </p>
      </section>

      <section className={utilStyles.section}>
        <p className={utilStyles.sectionLabel}>The three days</p>
        <h2 className={utilStyles.sectionTitle}>What actually happens.</h2>
        <ul className={utilStyles.entryList}>
          {DAYS.map(({ label, title, body }) => (
            <li className={utilStyles.entry} key={label}>
              <div>
                <div className={utilStyles.entryName}>{title}</div>
                <div className={utilStyles.meta}>{label}</div>
              </div>
              <p className={utilStyles.entryBody}>{body}</p>
            </li>
          ))}
        </ul>
        <p className={utilStyles.sectionIntro}>
          Not a course. Not a keynote with exercises bolted on. Three days of your team&rsquo;s
          real work, with the practice built while they do it.
        </p>
      </section>

      <section className={utilStyles.section}>
        <p className={utilStyles.sectionLabel}>Outcomes</p>
        <h2 className={utilStyles.sectionTitle}>What you have on Monday.</h2>
        <ul className={utilStyles.entryList}>
          {OUTCOMES.map(([name, body]) => (
            <li className={utilStyles.entry} key={name}>
              <div className={utilStyles.entryName}>{name}</div>
              <p className={utilStyles.entryBody}>{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={utilStyles.section}>
        <p className={utilStyles.sectionLabel}>Practical</p>
        <h2 className={utilStyles.sectionTitle}>The questions you actually need answered.</h2>
        <ul className={utilStyles.entryList}>
          {FAQ.map(({ q, a }) => (
            <li className={utilStyles.entry} key={q}>
              <div className={utilStyles.entryName}>{q}</div>
              <p className={utilStyles.entryBody}>{a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={utilStyles.section}>
        <p className={utilStyles.sectionLabel}>Next step</p>
        <h2 className={utilStyles.sectionTitle}>Tell me where your team sits.</h2>
        <p className={utilStyles.sectionIntro}>
          Team size, stack, and roughly how people are using AI today. I will tell you which
          version fits and what it would cost — and if a workshop is the wrong intervention,
          I will say so. The first conversation is free.
        </p>
        <p>
          <a className={utilStyles.more} href={`mailto:${contactEmail}`}>
            [write me a short note]
          </a>
        </p>
        <p className={utilStyles.sectionIntro}>
          If you would rather read first:{" "}
          <Link href="/writing/what-actually-works-with-ai-coding-tools">
            what actually works with AI coding tools
          </Link>
          ,{" "}
          <Link href="/writing/dont-outsource-your-thinking">
            why AI assistance can cut coding mastery by 17%
          </Link>
          , and{" "}
          <Link href="/writing/code-review-when-the-agent-wrote-the-code">
            code review when the agent wrote the code
          </Link>
          .
        </p>
      </section>
    </Layout>
  );
}
