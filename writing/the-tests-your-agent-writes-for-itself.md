---
title: "The tests your agent writes for itself"
date: "2026-10-08"
updated: "2026-10-09"
description: "Banning an agent from writing tests cost nothing across 111 DeepSWE tasks, and saved 6% of the time and 9% of the spend. What the experiment actually shows, the case for it, and the case against."
sourceUrl: "https://x.com/kunchenguid/status/2108030810691629403"
sourceTitle: "DeepSWE v1.1: banning agent-written tests"
sourceHost: "x.com"
references:
  - url: "https://x.com/kunchenguid/status/2108030810691629403"
    title: "Kun Chen: AI-written unit and integration tests are empirically unhelpful"
    host: "x.com"
  - url: "https://x.com/kunchenguid/status/2108244512808243470"
    title: "Kun Chen: answering the pushback, and what a source of truth has to be"
    host: "x.com"
  - url: "https://x.com/julianharris/status/2108111666785198129"
    title: "Julian Harris: a test protects against side effects of previously written code"
    host: "x.com"
tags:
  - agentic engineering
  - software testing
  - engineering leadership
  - AI generated code
---

## What the experiment shows

On the DeepSWE v1.1 eval set — 111 real-world coding tasks, 444 runs — Sonnet 5.5 was banned from writing any tests, and the runs were compared against a baseline that could write as many as it liked.

![Grey bars show the agent allowed to write tests, blue bars show it told to write none. Tasks solved 65.3% versus 66.2%, agent time 62.0 hours versus 58.0, spend $304 versus $278.](/writing-images/tests-the-agent-writes.png)

Success went up slightly, 65.3% to 66.2%, which is not statistically significant. Time and spend went down, and those are: 6% less time, 9% less money.

A second cut went further. On a 44-task subset, running the tests that *already existed* was disabled wholesale. 59% versus 59%, and no more regressions than when the suite ran.

So: taking the tests away cost nothing, and saved something.

## The case for taking it seriously

**The agent is marking its own homework.** The implementation and the tests are both the model's interpretation of your intent. A test written from the same understanding as the code is not independent evidence about that code. If the understanding was wrong, you get a wrong implementation and a green suite agreeing with it.

**It is not a finding about tests.** It is a finding about tests *nobody asked for* — the ones written unprompted, as a reflex, because you asked for a change. Bun's rewrite leaned hard on its suite, and that suite was a human asset curated over years to encode intended behaviour. Nothing here touches that. The comparison is tests a human specified against tests a model volunteered.

**It is not a codebase-quality problem.** The convenient objection is that agents write bad tests because the surrounding code is bad. The eval runs on repositories like FastAPI. That theory has to explain FastAPI.

## The case against

**"Tests are for regressions, and this cannot see them."** The strongest objection, and the one already answered: the 44-task subset is precisely that experiment, and disabling the suite produced no extra regressions.

**"Then tests never worked."** Too strong, and the data does not say it. TDD was genuinely useful to humans for years during first-pass development. The finding is narrower and stranger — agents do not appear to inherit the benefit humans got. That is worth investigating, not celebrating.

**"Mutation testing fixes this."** Half right. Mutation testing cannot tell an intended change from an unintended one, so when a test nobody asked for fails, it cannot say whether the code broke the test or the test was wrong. It is not a source of truth. It is still a perfectly good **eval**: break the implementation deliberately and see whether anything notices. A suite that survives is provably decoration. Use it to delete, not to trust.

**"This settles testing."** It does not. The agents wrote 17 end-to-end tests against more than 3,000 unit and integration tests. Nothing here says anything about that layer, in either direction.

## Where that leaves me

A test is worth exactly what the intent behind it is worth. It is an intermediate representation of something a person decided. When the agent writes both the code and the check, that chain stops being a chain and becomes a loop: two artefacts expressing one guess, and a build that goes green when they agree with each other.

So stop accepting tests you did not ask for. Specify the ones where you can express intent better as a case than as a sentence of requirements. Run mutation testing to find the dead weight and delete it. On high-risk paths, read the diff yourself, because the suite was written by the same thing that wrote the code.

And if the cost of being wrong is an afternoon, just code away. Most work does not need the ceremony, and pretending otherwise is how the ceremony got so expensive.
