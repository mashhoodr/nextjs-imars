---
title: "The tests your agent writes for itself"
date: "2026-10-08"
description: "Banning an agent from writing tests cost nothing on 111 DeepSWE tasks, and saved 6% of the time and 9% of the spend. But a single-task benchmark cannot see what a regression suite is for — and underneath that sits a problem nobody is naming."
sourceUrl: "https://x.com/kunchenguid/status/2108030810691629403"
sourceTitle: "Kun Chen on agent-written tests, DeepSWE v1.1"
sourceHost: "x.com"
references:
  - url: "https://x.com/kunchenguid/status/2108030810691629403"
    title: "Kun Chen: AI-written unit and integration tests are empirically unhelpful"
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

He went further: on a 44-task subset he disabled running even the tests that already existed. 59% versus 59%. No difference at all.

## Why this is less surprising than it sounds

We have leaned on unit and integration tests to tell us whether what got written is correct. In most codebases the test code runs to about 50% of the implementation, sometimes more. With an agent, that is 50% more tokens generated and 50% more time spent, on every task.

So the question worth asking is what we were buying with it.

Kun Chen's own read is the sharp one: the implementation and the tests are both the agent's interpretation of your intent. The tests are not more accurate than the implementation, because they come from the same understanding. If that understanding was wrong, you now have a wrong implementation and a passing test suite that agrees with it.

That is the agent marking its own homework. And once you put it that way, a result of "no measurable benefit" stops being a surprise and starts being the obvious outcome.

## What I would not conclude

"Stop writing tests" is the wrong lesson to draw from this, and I think it will be the popular one.

What the study shows is that *these* tests, written *this* way, bought nothing. It does not show that testing is dead. It shows that volume is not the thing that was ever working.

If we doubled down on making sure the right tests get written, I think there is a much better suite on the other side of this. Two techniques matter more than they currently get credit for:

- **Mutation testing.** Deliberately break the implementation and see whether the suite notices. This measures whether a test can actually detect a fault, which is the only property a test has that matters. A suite that passes a mutation run is doing work; one that does not was always decoration.
- **Complexity as a guide to coverage.** Point the testing effort at the parts of the system where the logic is genuinely hard, instead of spreading it evenly across code that was never going to break.

Both of those produce a *smaller* suite that is better integrated with the system. That is a different goal from the one the agent is currently optimising for, which is coverage as a quantity.

Worth noting what the study explicitly does not cover: the agent wrote almost no end-to-end tests. Seventeen, against more than three thousand unit and integration tests. So none of this says anything about e2e, in either direction.

## The measurement problem

Julian Harris made the objection that I think lands hardest, and it is not a quibble about methodology — it is about what this kind of benchmark is able to see at all.

A test is protection against the unintended side effects of code you already wrote. Its value shows up on the *next* change, and the one after that. It is a claim about the future of a codebase.

DeepSWE measures single-task success. Each run is one task, done once. So a regression suite has no opportunity to pay for itself inside the measurement window — not because it is worthless, but because the thing it protects against has not happened yet. You would get this same result from a suite of genuinely excellent tests.

That is not an argument that the finding is wrong. The time and token costs are real, and they are measured correctly. It is an argument about what the finding covers: it tells you what tests cost to produce, and almost nothing about what they save.

Harris is running the benchmark that would actually answer it — an "implement full MVP" setup where the tests run repeatedly across nine stories, with builds that sometimes take more than two days. That shape can see regressions. A single-task eval structurally cannot. His notes are at [boxabirds/awesome-local-ai](https://github.com/boxabirds/awesome-local-ai), and his aside is worth repeating: in his runs, Qwen 3.8 and its peers are the first generation of local models that can hold a job of that length together at all.

## The second-order problem

Here is the part I have not seen discussed, and I think it matters more than the headline.

A test is not only a cost at the moment it is written. It is a cost every time the implementation needs to change.

When a change breaks a test, the agent has more work to do. And if the agent is running on a low-effort setting, it will often not do that work. It will look for the shortcut that avoids breaking the test in the first place — a narrower change, a special case, a carve-out — rather than making the correct change and then repairing the test.

So the test did not catch a defect. It *shaped the implementation*, and it shaped it toward the thing that was easiest to leave the suite green. You get a suboptimal result and a passing build, which is the worst available combination because it looks exactly like success.

Put that next to Harris's point and the pair is more interesting than either alone. He is right that a test earns its keep when the implementation changes. I am saying that is the exact moment a low-effort agent is most likely to subvert it. The payoff and the failure mode arrive on the same event.

This is a behaviour, not a law. It is the kind of thing we will train and skill our way out of — a model that is better at recognising "this test is now wrong and should be rewritten" rather than treating every red test as an obstacle to route around.

But that is a future-tense fix, and the behaviour is present-tense.

## What to do on Monday

Sort your work by what it would cost to be wrong.

For anything genuinely high-risk, the obligation has not changed and the study does not let you off: **understand what the implementation actually does.** Not whether the tests pass — they were written by the same thing that wrote the code. Read the diff. Be able to explain the decision. Treat "I cannot explain this" as the blocker.

And if you are vibe coding something where the cost of being wrong is an afternoon — just code away. The whole point of sorting by risk is that most work does not need the ceremony, and pretending otherwise is how the ceremony got so expensive in the first place.

The uncomfortable summary is that the tests were never the thing providing the assurance. They were standing in for a judgement someone was supposed to make, and an agent writing both halves makes that substitution visible in a way it was easy to ignore when people wrote both halves.
