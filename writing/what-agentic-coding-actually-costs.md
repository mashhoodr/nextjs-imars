---
title: "What agentic coding actually costs"
date: "2026-02-20"
updated: "2026-08-14"
description: "A $100 seat can consume $2,000 of value, Anthropic burns $19bn against $9bn of revenue, and the cost of generating code is approaching zero. What a CTO should do about all three."
sourceUrl: "https://papercompute.com/blog/true-cost-of-claude-code/"
sourceTitle: "The True Cost of Claude Code"
sourceHost: "papercompute.com"
references:
  - url: "https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents"
    title: "Minions: Stripe's one-shot, end-to-end coding agents"
    host: "stripe.dev"
  - url: "https://www.anthropic.com/engineering/building-c-compiler"
    title: "Building a C compiler with a team of parallel Claudes"
    host: "anthropic.com"
  - url: "https://creators.spotify.com/pod/profile/mashhoodr/episodes/Stop-Reviewing-Code--Start-Reviewing-Tests-TDD-in-the-Age-of-AI-e3hlndt"
    title: "Stop Reviewing Code, Start Reviewing Tests — Karachi Wala Developer"
    host: "creators.spotify.com"
tags:
  - AI transformation
  - engineering leadership
  - agentic engineering
  - AI costs
---

Two things are happening to the cost of software at the same time, and they point in opposite directions.

The cost of *generating* code is approaching zero. The cost of the *tools* that generate it is being subsidised, heavily, by investors — and that will correct.

If you are planning an engineering budget more than a year out, you need a position on both.

## The subsidy phase

Here is the uncomfortable arithmetic. Some of you are paying around $100 a month. If you are using the tool properly, you are consuming closer to $2,000 in value. Anthropic is burning roughly $19bn a year while making $9bn.

This is not charity. It is the Uber playbook: use investor capital to build workflow dependency, then correct pricing once the alternatives have gone and the habits have locked in. Uber subsidised 59% of ride costs in 2015 and had raised prices 92% by 2021.

We are in phase one.

The signals that phase two is coming are already visible: rate limits tightening since August 2025, IPO preparation, the path to cash-flow positive pushed out to 2028.

**But the window is genuinely in your favour right now.** A $100 subscription really does deliver multiples of its cost. Most teams are generating far more value than they are paying for. This is the time to learn through play, to experiment freely, to push at what these tools can do — precisely because someone else is paying for the experiment.

The mistake is not using it. The mistake is using it without instrumentation, so that when pricing reflects reality — likely $300 a month, or strict usage-based — you discover your dependency and your cost at the same time.

### What to do during the subsidy

- **Track token consumption at real API rates**, not at what you are being charged. The gap between those two numbers is your exposure.
- **Build telemetry into agent sessions.** You cannot manage a cost you cannot see, and this one is invisible by default.
- **Optimise model selection.** Do not default to the largest model for everything. Most of what teams route to a frontier model does not need one.
- **Make sure the workflow survives without any single vendor.** Not because you plan to leave, but because a workflow that cannot leave has no negotiating position.

The best time to audit an AI dependency is before the price correction, not after it.

## The other curve: generation is approaching free

While tooling costs are artificially low, the cost of producing implementation code is genuinely collapsing. Look at what has actually shipped:

- A team cloned a **web browser** from scratch, using tests as the specification.
- Anthropic cloned a functional **C compiler** using just tests — Opus replicating in two weeks foundational work that took Stallman three years, for around $20k of compute.
- Cloudflare cloned the **Next.js** project and launched a CMS on top of it.

Read the C compiler result carefully, though, because the caveats are the lesson. The generated code was under-optimised, even against GCC with optimisations off. The binaries were roughly twice the size. The output was not production-grade. The assembler and linker were missing.

It is a proof of concept, not a product. **What it proves is narrower and more useful than "AI can build compilers": AI excels at replicating existing functionality when you have tests and reference output to act as rails.**

That is a blueprint for migration and translation projects, which is where most large engineering organisations actually spend their money.

## What becomes valuable when code is free

If agents can recreate complex software in days for pennies, implementation code stops being an asset. It becomes disposable.

The tell is already showing up: some open-source projects have started taking their **test suites** closed while leaving the implementation open. That is a rational response. When the code can be regenerated for free, the rigorous test suite is the only remaining intellectual property — it is the thing that encodes what "correct" means, and correctness is the part that took years to learn.

The practical consequence for a team is uncomfortable: **stop reviewing code and start reviewing tests.** The code is the cheap artefact now. The specification of correctness is the expensive one.

## This is not a greenfield story

The obvious objection is that none of it applies to a real codebase with fifteen years of history in it. Stripe's Minions system is the counterexample worth knowing about: one-shot, end-to-end coding agents merging around **1,000 pull requests a week** with no human in the loop.

That is against hundreds of millions of lines of proprietary Ruby, Sorbet types, thousands of homegrown libraries no model has ever seen, and a trillion dollars of annual payment volume where mistakes cascade. Not playground territory.

What is instructive is *how* it works, and where it struggles.

It works because it augments existing tooling rather than replacing it — Slack, CLI and web entry points so adoption is frictionless; shift-left linting in five seconds before expensive CI; agents integrated into the workflow engineers already have rather than a parallel AI universe beside it.

It struggles in ways that will sound familiar. Context window constraints make it nearly impossible to develop correct intuitions at that scale. Runs are capped at two CI iterations because of token cost and diminishing returns. And almost all guidance has to be subdirectory-specific, because codebase heterogeneity breaks universal rules.

The meta-lesson: successful agentic systems augment the tooling you have. They do not reimagine it.

## The position I would take

The generation cost curve is real and permanent. The tooling cost curve is real and temporary, and currently pointed the wrong way.

So: **exploit the subsidy deliberately, and build the observability now that makes the correction a budgeting exercise rather than a crisis.** Move your review effort from implementation toward tests, because that is where the durable value is moving. And treat migration and translation — anywhere you have reference output to act as rails — as the highest-confidence place to put agents to work today.

---

*If you are trying to plan an engineering budget through this, that is one of the conversations I have most often. [Tell me where your team sits](mailto:hello@karachiwala.dev).*
