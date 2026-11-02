---
title: "Three ways to build the same tool"
date: "2026-11-02"
description: "I gave Google's Elephant-Goldfish Model, Superpowers and a plain agent the same brief. All three passed the tests. The differences were in what the tests didn't check, and in the bill: 1x, 15x and roughly 40x. So is EGM worth it?"
references:
  - url: "https://github.com/google/elephant-goldfish-model"
    title: "Elephant-Goldfish Model (EGM): design with deep-context agents, review with zero-context ones"
    host: "github.com"
  - url: "https://github.com/obra/superpowers"
    title: "Superpowers: brainstorm, plan, subagent-driven development with TDD and review"
    host: "github.com"
tags:
  - agentic engineering
  - harness engineering
  - AI coding workflows
  - engineering leadership
---

We keep wrapping more process around coding agents - brainstorms, written plans, reviewer swarms - and the return on that overhead is still mostly anecdotal. I wanted a number, so I took Google's Elephant-Goldfish Model plugin (EGM) and Superpowers, ran both against a plain agent with no plugin at all, and measured what each one actually bought.

## The setup

All three arms ran in Claude Code, on the same model, building the same thing: txmerge, a small Python CLI that merges overlapping bank CSV exports into one ledger. It has to remove duplicates without losing real transactions, link transfers between my own accounts and categorise the rest with rules.

The brief was deliberately loose. A scripted stakeholder agent held 13 hidden policies - two identical coffees on the same day in one export are both real, a transfer must land within 3 days - and only answered what it was asked. I scored the arms on 18 hidden acceptance tests, a set of robustness probes, blind code and design reviews, and token spend rebuilt from every agent's transcript.

- **EGM** has a deep-context "elephant" agent draft a design spec, then sends it through rounds of zero-context "goldfish" reviewers before a separate agent writes the code.
- **Superpowers** goes from brainstorm to written plan to subagent-driven development, with test-driven development and review on each task.
- **Baseline** is the agent on its own.

## Everyone passed the tests

All three arms scored 18/18. The baseline asked 14 questions in a single batch and got every policy, which tells me the brief was too easy to separate the workflows on rule-following.

The differences showed up in the brief's own first requirement, never lose a real transaction, on two inputs nobody had specified.

![Two robustness probes. A CSV with an unclosed quote followed by two good rows: the baseline and EGM keep none of the good rows, Superpowers keeps both. An output path that points at one of the input files: the baseline and Superpowers overwrite the bank export, EGM refuses with exit code 2.](/writing-images/txmerge-data-loss-probes.png)

- **An unclosed quote** on one row swallowed the two valid rows after it in the baseline and in EGM. Only Superpowers kept them, and only because its final whole-branch review caught the bug - its 6 per-task reviews had all passed first time.
- **Pointing `--out` at an input file** made the baseline and Superpowers overwrite my bank export without a word. EGM refused, because its design process had asked about that case and written down the answer.

In the blind code review, Superpowers came first on 18/20, EGM second on 15/20 and the baseline third on 12/20. The designs went the other way: EGM's scored 21/25 against Superpowers' 17/25, and it uncovered 11 of the 13 policies, against 10 for Superpowers and 9 for the baseline.

![Scoreboard. Hidden tests: 18/18 for all three. Unclosed quote: baseline loses rows, Superpowers keeps them, EGM loses rows. Output path pointing at an input: baseline and Superpowers overwrite it, EGM refuses. Blind code review: 12, 18 and 15 out of 20. Blind design review: Superpowers 17/25, EGM 21/25. Hidden policies found: 9, 10 and 11 of 13. Active time: 5, 28 and about 100 minutes. Tokens processed: 0.85M, 17.6M and 33.6M. Weighted cost: 1x, 15x and about 40x.](/writing-images/txmerge-scoreboard.png)

## The orchestrator is the bill

The baseline processed 0.85M tokens in 5 minutes, Superpowers 17.6M in 28 minutes and EGM 33.6M in about 100 minutes. Weighted by what each kind of token costs, that is 1x, 15x and roughly 40x.

The subagents were not the expensive part. About three quarters of both plugins' tokens went on the orchestrator - the main agent that dispatches all the others - re-reading its own growing context on every call. EGM routes its reviewers through a synthesizer agent to keep their reports out of the orchestrator, and its context still reached 302k. The longer waits for each review round also let the prompt cache expire, so the orchestrator rebuilt its whole context 6 times. Two of those were my laptop going to sleep mid-run, which is the kind of thing a 100-minute run invites.

![Stacked bars of tokens processed, split into orchestrator and subagents. Baseline 0.85M. Superpowers 17.6M, of which 12.95M orchestrator. EGM 33.6M, of which 25.36M orchestrator.](/writing-images/txmerge-token-spend.png)

![Orchestrator context over active time. Every arm starts near 40k. The baseline reaches 65k at 5 minutes, Superpowers 203k at 28 minutes and EGM 302k at about 100 minutes.](/writing-images/txmerge-orchestrator-context.png)

It hasn't been without adventure. The `subagent_tokens` figure Claude Code reports turned out to be the final context size, not total spend, so my first report understated cost by 7 to 21 times. I rebuilt every number from the transcripts.

## Is EGM worth it over Superpowers?

For code I'm going to ship myself, no. EGM cost about three times as much as Superpowers and took more than three times as long, and the code at the end was worse. It went through 16 review rounds and fixed 35 serious findings, and it still lost rows on the unclosed quote. Its reviewers read the design and never ran anything, so none of them noticed that Python's CSV reader quietly swallows the rest of a file after a broken quote - and the spec never mentions the case. Neither of its review loops converged either; both stopped at the 5-round cap, with the style reviewer finding fresh wording issues every round.

But EGM's spec is genuinely better. It pinned down every byte of output, every error message and the overwrite case Superpowers shipped, and a judge said two engineers could build from it and get identical results. The price is about 785 lines and close to an hour of reading for a tool of about 450.

The interesting part is where that quality came from. Most of EGM's discovery happened in its brainstorm and stakeholder rounds, which cost 7% of its total. The review loops cost 39% directly, plus most of the orchestrator's growth, and found mainly wording.

So my answer is to take EGM's front half and Superpowers' back half. Use the elephant to brainstorm and ask the awkward questions, skip the review loops, then hand the brief to Superpowers' plan, build and final review. If the spec itself is the deliverable - another team builds it, or a mistake in the requirements is expensive - then the full EGM run earns its cost.

## What I'd take from it

- **Process bought robustness, not rule-following.** Each plugin caught a data-loss case the plain agent shipped, and each missed one.
- **Review the code, not just the document.** Superpowers' one whole-branch review at the end found more than all its per-task reviews put together.
- **The orchestrator's context is the bill.** Multi-agent workflows should hand reports over on disk and start a fresh context for each phase.

The caveats are real: one run per arm, one task, one model, and a scripted stakeholder instead of a human at the gates. Next I want to run three of each, plus a fourth arm - EGM's brainstorm feeding Superpowers' build. If you have tried something similar, I'd love to compare notes.
