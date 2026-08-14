---
title: "Skillify: turning agent failures into skills you can test"
date: "2026-04-01"
updated: "2026-08-14"
description: "Every AI framework promises reliability and gives you dashboards. The tools exist; the workflow doesn't. A ten-step checklist for making a failure impossible to repeat."
references:
  - url: "https://builder.aws.com/content/39qVvXF9Bu8U5NwPF5d5n25VEZI/automating-your-workflow-with-claude-code-hooks"
    title: "Automating your workflow with Claude Code hooks"
    host: "builder.aws.com"
  - url: "https://x.com/garrytan/status/2046876981711769720"
    title: "Garry Tan on agent reliability"
    host: "x.com"
tags:
  - agentic engineering
  - AI reliability
  - agent evaluation
  - engineering practice
---

Every AI framework promises to solve reliability. They give you testing tools, eval frameworks, monitoring dashboards.

Then your agent makes the same mistake three weeks later, and you realise: **the tools exist. The workflow doesn't.**

I have been thinking about what separates AI that learns from AI that apologises and repeats. The pattern I keep coming back to is not about models at all.

## Deterministic work should never happen in latent space

When your agent needs to retrieve something from a database, calculate a precise value, or execute a known procedure — that is not a job for reasoning. That is a job for code.

Most agents do exactly the opposite. They spin up a language model to think about something a script could handle in milliseconds, and they get it right most of the time, which is worse than getting it wrong reliably.

**The bug is not the wrong answer. It is doing it in the wrong machine.**

Once you see it this way, "the agent is unreliable" resolves into something much more actionable: work that should have been deterministic was left to inference.

## Skillify

So here is what I call **skillify**: when your agent fails, don't just log it. Transform it.

1. **Write a skill.**
2. **Write the deterministic code** that fixes it.
3. **Write unit tests** on that code.
4. **Write integration tests** that verify the script works on real data.
5. **Write LLM evals** that confirm your agent actually uses the script instead of reasoning about it.
6. **Write a resolver trigger** so the agent knows when this skill applies.

Then audit that the skill is reachable, testable, and won't rot.

That is a checklist. Ten steps, one workflow. Step five is the one people skip and the one that matters: a skill the agent has but does not reach for is not a fix, it is a decoration.

The tools for all of this already exist. What is missing is the opinionated checklist that says: *this is what permanent means.* Not a prompt tweak. Not a bigger system message. A skill with tests that run daily, forever.

## What this looks like when it isn't a workflow

A few months ago my OpenClaw bot — Emmet — shipped untested code. Twice. Same problem both times: it did not remember to write tests.

Not because it couldn't. **Because nothing was forcing it.**

That distinction is the whole argument. I could have written a firmer system prompt asking it to please remember the tests. That is the "apologises and repeats" path, and it works right up until the context gets long or the task gets interesting.

What I did instead was tighten the hook system, so that every commit triggers a safety net that works whether anyone is paying attention or not:

- **Pre-commit hook.** Does this schema change have a corresponding migration? Are there tests for the new functions? Did you update the API docs? If anything is missing, the commit fails. No exceptions.
- **Auto-generated migrations.** Any change to the schema instantly triggers migration generation. No manual step, no "I'll add it later". The hook runs, the migration appears in git, ready to review.
- **Test coverage gate.** A hook scans the commit message and changed files. Modify business logic without adding tests and it blocks you with a specific message naming the functions.
- **Documentation enforcement.** Touch an API endpoint and the hook checks whether the relevant docs moved. Forgotten docs get caught in review, not in production.
- **Session state recovery.** Every time a session starts, a hook captures context — branch, last commit, changed files — and rebuilds the mental model automatically.

**Hooks are deterministic.** They fire the same way every time, regardless of who committed or what they forgot. Your agent cannot accidentally skip a migration. Tests become a requirement rather than an afterthought.

Notice that none of this is AI. The fix for an unreliable agent turned out to be ordinary engineering discipline, applied at the point where the agent's freedom needed removing.

## Why this compounds

Your agent a year from now is shaped by every mistake it made in the year before. Not because you asked it nicely. Because you turned each one into infrastructure.

There is something pleasing in the loop: the model's intelligence created the constraint that stops the model from being stupid about it again. You use inference once, to write the deterministic thing that means you never need inference for that problem again.

If you are building agents that hallucinate, that miss context, that make the same errors twice — the answer is not more examples or better prompts.

**Every failure becomes a test. Every test runs forever. The bug becomes impossible.**

---

*Building this scaffolding — the skills, the hooks, the evals that make agent work trustworthy — is what I mean by harness engineering, and it is most of what I do with teams. [Tell me where your team sits](mailto:hello@karachiwala.dev).*
