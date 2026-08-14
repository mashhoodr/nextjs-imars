---
title: "Code review when the agent wrote the code"
date: "2026-04-15"
updated: "2026-08-14"
description: "Clean code, passing tests, and a linear scan where a binary search belonged. What actually changes about code review when an agent writes the code, and what to look at instead."
references:
  - url: "https://bits.logic.inc/p/ai-is-forcing-us-to-write-good-code"
    title: "AI is forcing us to write good code"
    host: "bits.logic.inc"
tags:
  - agentic engineering
  - code review
  - AI generated code
  - engineering leadership
---

I shipped a search feature last month. Clean code. Tests passed.

The implementation was a linear scan where a binary search should have been. O(n) instead of O(log n).

That is the gap between plausible and correct, and it is the thing code review now exists to catch.

The agent saw "implement search" and delivered exactly that. It had no way to know I needed sub-100ms latency on 100,000 rows, because I never told it. Nothing in the diff looked wrong. Every line was defensible. The tests I asked for passed, because they tested what I asked about, which was behaviour, not cost.

## Why review has to change

Code reviews are here to stay, for now. But how we do them needs to change.

Gone are the days when you could expect a small pull request and go through it line by line. Between the plan, the tests, the prompt updates and the code changes, a single piece of work now easily runs from a few hundred to a few thousand lines of diff.

You cannot read that the way you read a 40-line PR. If you try, one of two things happens. Either review becomes the bottleneck that removes the entire speed advantage, or — far more common — the reviewer skims, sees clean code and green tests, and approves. That second failure is worse, because it looks exactly like a functioning process.

The volume is not the interesting part, though. The interesting part is that **the errors have moved**.

## What is worth reviewing now

It is surely not syntax errors and style changes. That is a solved problem, and it was solved before agents arrived — linters and formatters took it years ago.

The focus shifts to **solution correctness** and **mental alignment**.

![Two columns comparing what code review used to catch, such as syntax and style, with what it must catch now, such as solution correctness and mental alignment.](/writing-images/review-shift.png)

*The left column was automated years ago. The right column is what is left.*

Solution correctness is the binary search question. Does this implementation actually satisfy the constraint I care about, which may never have been written down? Mental alignment is the quieter one: does this code do what I thought I was asking for? An agent will resolve an ambiguous instruction confidently and silently. A junior engineer would have asked. That question the junior would have asked is now your job to ask, after the fact, while reading.

So spend the review on the important bits rather than on everything. In practice, for me, that means going straight to the parts of a diff where a *decision* was made — a data structure chosen, a boundary drawn, an error swallowed, a default picked — and skimming the parts where the work was mechanical.

A useful filter: for each decision point, ask what the agent could not have known. It did not know your latency budget, your traffic shape, which of two similar-looking services is the one that is actually load-bearing, or that the previous team tried this and reverted it. Those gaps are where the plausible-but-wrong lives, and they are invisible if you read the diff line by line instead of decision by decision.

## Give the agent something to verify against

The review problem is partly a review problem and partly an upstream one. Three things matter.

**Define acceptance criteria before you prompt.** Not "implement search". Say "implement search that scales O(log n) on 100,000 records". Now the agent has something concrete to verify against, and so do you. This matters much less when you are prototyping or vibe coding, and it matters enormously the moment the code is going to live somewhere.

**Measure what you care about.** Benchmark a thousand lookups and the O(n) becomes visible immediately. The failure in my search feature was invisible in review and obvious in a benchmark. If a property matters, it needs a number attached to it, or it is not a requirement, it is a hope.

**Have the agent write the tests before it writes the code.** The order is doing real work here. Tests written after the implementation tend to test the implementation, which is how you end up with a passing suite around an O(n) scan.

## The practices that stopped being optional

For years, I knew the theory behind clean code, test-driven development, and thoughtful architecture. But in the heat of a deadline, these often felt like optional luxuries, something to defer. A little technical debt here, a quick fix there. We have all been there.

Then agents entered the workflow, and what was once a discipline you aspired to became non-negotiable infrastructure.

That is not a loss. It is forcing us to build software with a clarity and precision that benefits every human on the team, not just the machines. What it looks like in practice:

- **Treat test coverage as a contract, not a metric.** Every line needs a clear, testable contract. That is how an agent validates and integrates without breaking critical paths.
- **Architect file structures deliberately.** Treat your directory layout as an API for the agent. Small, focused files with semantic names prevent context truncation when something is trying to understand intent.
- **Automate enforcement mercilessly.** Linters, formatters, type checkers. These are not about style. They remove degrees of freedom, narrow the decision space, and eliminate entire categories of illegal state before review ever happens.
- **Keep the dev loop fast.** Agents thrive on rapid iteration. Cheap, ephemeral environments that spin up in seconds turn a review conversation into a feedback loop.

Every one of these makes the code more reviewable by humans too. That is the part worth noticing: the things that make a codebase legible to an agent are the same things that made it legible to a new joiner. We just never had a forcing function before.

## What the job actually is now

Tony Hoare, in his 1980 Turing Award lecture, drew the distinction that matters here: a design can be so simple that it has "obviously no deficiencies", or so complicated that it has "no obvious deficiencies".

Agent-written code lands in the second category by default. It is fluent, well-formatted, and confident. Nothing about its surface tells you which category it is in.

Our job is no longer writing code. It is **defining correctness and verifying that the output actually meets it**.

The engineers who win will not be the ones who write the best code. They will be the ones who know when code is wrong.

---

*If your team is somewhere in this transition — shipping more, and less sure whether it is better — that is the problem I work on. [Tell me where your team sits](mailto:hello@karachiwala.dev).*
