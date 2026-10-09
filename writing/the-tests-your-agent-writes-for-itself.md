---
title: "The tests your agent writes for itself"
date: "2026-10-08"
updated: "2026-10-09"
description: "Banning an agent from writing tests cost nothing across 111 DeepSWE tasks, and saved 6% of the time and 9% of the spend. The finding is narrower than the headline and more uncomfortable than the pushback: it is about the tests nobody asked for."
sourceUrl: "https://x.com/kunchenguid/status/2108030810691629403"
sourceTitle: "Kun Chen on agent-written tests, DeepSWE v1.1"
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

Kun Chen ran the experiment properly and published the numbers. On the DeepSWE v1.1 eval set — 111 real-world coding tasks, 444 runs — he banned Sonnet 5.5 from writing any tests at all, and compared.

Success went *up* slightly, 65.3% to 66.2%, which he is careful to say is not statistically significant. Time and spend went down, and those are significant: 6% less time, 9% less money.

![Grey bars show the agent allowed to write tests, blue bars show it told to write none. Tasks solved 65.3% versus 66.2%, agent time 62.0 hours versus 58.0, spend $304 versus $278.](/writing-images/tests-the-agent-writes.png)

*Taking the tests away cost nothing. That is a finding about the tests, not about testing.*

He then went further: on a 44-task subset he disabled running even the tests that already existed. 59% versus 59%. No difference at all.

## Why this is less surprising than it sounds

We have leaned on unit and integration tests to tell us whether what got written is correct. In most codebases the test code runs to about 50% of the implementation, sometimes more. With an agent, that is 50% more tokens generated and 50% more time spent, on every task.

So the question worth asking is what we were buying with it.

Kun Chen's own read is the sharp one: the implementation and the tests are both the agent's interpretation of your intent. The tests are not more accurate than the implementation, because they come from the same understanding. If that understanding was wrong, you now have a wrong implementation and a passing test suite that agrees with it.

That is the agent marking its own homework. Once you put it that way, "no measurable benefit" stops being a surprise and starts being the obvious outcome.

## The distinction the headline loses

The thread that followed was loud, and most of it argued with a claim nobody made.

This is not a result about tests. It is a result about **tests nobody asked for** — the ones your agent writes unprompted, as a reflex, when you asked it to make a change.

Kun Chen draws the line himself using Bun, whose large rewrite leaned heavily on its test suite. That suite was a deliberate human asset, curated over years to encode the desired behaviour of the system. Nothing in this eval touches it. The comparison is not "tests versus no tests"; it is "tests a human specified versus tests a model volunteered."

Those two things share a file extension and almost nothing else.

He also dispatches the comfortable objection that this is really a codebase-quality problem. DeepSWE runs on repositories like FastAPI. If the theory is that agents write bad tests because the surrounding code is bad, that theory has to explain FastAPI.

## The regression objection, and the answer

Julian Harris raised the strongest challenge: a test protects against the unintended side effects of code you already wrote, so its value shows up on the *next* change. A single-task benchmark would be structurally blind to that.

It is the right question, and it turns out it was already covered. The 44-task subset is exactly that experiment — the existing suite disabled wholesale, and the agents caused no more regressions than when it ran.

Kun Chen pushes back on the premise too, and I think he is right to. Tests were never only for regressions. TDD was genuinely useful to humans during first-pass development, for years. The interesting thing is not that tests stopped working; it is that **agents do not seem to inherit the benefit humans got from them.** That is worth understanding rather than explaining away.

## Mutation testing is an eval, not a fix

This is where I want to be careful, because Kun Chen pre-empted the move I was about to make — and he is right about the part he is addressing.

His argument: mutation testing makes your tests sensitive to change, but it cannot tell you whether a change was *intended*. When a test fails, and no human ever asked for that test, you cannot tell whether the code broke the test or the test was wrong. The agent can fix it from either end. Something has to adjudicate, and an LLM-written test is not more trusted than the LLM-written implementation sitting next to it.

That is correct, and it kills mutation testing as a *source of truth*.

It does not kill it as an **eval**. Those are different jobs.

Point a mutation run at a suite and it answers one narrow question: if I break the implementation, does anything in here notice? A suite that survives deliberate breakage is provably decoration — it is not testing, it is reassurance. That is worth knowing, cheaply and mechanically, and it is knowable without resolving what the correct behaviour is.

So: mutation testing tells you whether a suite is doing *any* work. It cannot tell you whether the work is the *right* work. Use it to delete, not to trust. Pair it with pointing coverage at genuine complexity rather than spreading it evenly, and you end up with a smaller suite that at least earns its runtime.

Worth noting what none of this covers: the agent wrote almost no end-to-end tests. Seventeen, against more than three thousand unit and integration tests. Kun Chen has an e2e eval running, and until it lands, nobody should claim this says anything about that layer.

## The real problem is the source of truth

Strip everything else away and this is what is left.

A test is an intermediate representation of what you wanted. It is useful precisely to the degree that it encodes an intent that came from somewhere more trustworthy than the code it is checking.

When a human writes the test, that chain holds: intent lives in a person, the test records it, the implementation is measured against it. When the agent writes both halves unprompted, the chain is a loop. You have two artefacts expressing one guess, and a green build that confirms they agree with each other.

Kun Chen's phrasing is blunter than mine: if your source of truth is tests written by agents that nobody asked for or certified, you are in a deep hole.

## What to do on Monday

Sort your work by what it would cost to be wrong.

**Stop accepting tests you did not ask for.** If the agent volunteered it, it is not evidence. Either specify the test yourself — because you can articulate the intent better as a case than as a sentence of requirements — or do not carry it.

**For anything high-risk, understand what the implementation does.** Not whether the tests pass; they were written by the same thing that wrote the code. Read the diff. Be able to explain the decision. Treat "I cannot explain this" as the blocker.

**Run mutation testing to find the dead weight**, and delete what it exposes. A smaller suite you trust beats a large one you have never interrogated.

And if you are vibe coding something where the cost of being wrong is an afternoon — just code away. The whole point of sorting by risk is that most work does not need the ceremony, and pretending otherwise is how the ceremony got so expensive in the first place.

The uncomfortable summary is that the tests were never the thing providing the assurance. They were standing in for a judgement someone was supposed to make, and an agent writing both halves makes that substitution visible in a way it was easy to ignore when people wrote both halves.
