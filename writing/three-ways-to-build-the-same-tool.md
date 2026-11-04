---
title: "Three ways to build the same tool"
date: "2026-11-02"
updated: "2026-11-04"
description: "I gave Google's Elephant-Goldfish Model, Superpowers and a plain agent the same brief, then repeated it on two more problems. All three passed the tests every time. The differences were in what the tests didn't check, and in the bill: about $1, $7 and $30 a run. So is EGM worth it?"
references:
  - url: "https://github.com/google/elephant-goldfish-model"
    title: "Elephant-Goldfish Model (EGM): design with deep-context agents, review with zero-context ones"
    host: "github.com"
  - url: "https://github.com/obra/superpowers"
    title: "Superpowers: brainstorm, plan, subagent-driven development with TDD and review"
    host: "github.com"
  - url: "https://github.com/mashhoodr/egm-vs-superpowers-experiment"
    title: "The experiment repo: every brief, prompt, spec, review report, stakeholder log, hidden test and judge verdict"
    host: "github.com"
tags:
  - agentic engineering
  - harness engineering
  - AI coding workflows
  - engineering leadership
---

We keep wrapping more process around coding agents - brainstorms, written plans, reviewer swarms - and the return on that overhead is still mostly anecdotal. I wanted a number, so I took Google's Elephant-Goldfish Model plugin (EGM) and Superpowers, ran both against a plain agent with no plugin at all, and measured what each one actually bought.

**Updated 4 Nov 2026:** I've since repeated the experiment on two more problems, in the new section near the end, and corrected the costs. I had first priced every token at Opus rates, but Superpowers sends much of its work to cheaper models, so it costs about 9x the plain agent, not 15x.

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

![Scoreboard. Hidden tests: 18/18 for all three. Unclosed quote: baseline loses rows, Superpowers keeps them, EGM loses rows. Output path pointing at an input: baseline and Superpowers overwrite it, EGM refuses. Blind code review: 12, 18 and 15 out of 20. Blind design review: Superpowers 17/25, EGM 21/25. Hidden policies found: 9, 10 and 11 of 13. Active time: 5, 28 and about 100 minutes. Tokens processed: 0.85M, 17.6M and 33.6M. Cost per run: $0.71, $6.46 and $31.](/writing-images/txmerge-scoreboard.png)

## The orchestrator is the bill

The baseline processed 0.85M tokens in 5 minutes, Superpowers 17.6M in 28 minutes and EGM 33.6M in about 100 minutes. Priced by the model behind each call, that is $0.71, $6.46 and $31, or roughly 1x, 9x and 44x. Superpowers costs less than its tokens suggest because its implementers and reviewers run on Sonnet and Haiku.

The subagents were not the expensive part. About three quarters of both plugins' tokens went on the orchestrator - the main agent that dispatches all the others - re-reading its own growing context on every call. EGM routes its reviewers through a synthesizer agent to keep their reports out of the orchestrator, and its context still reached 302k. The longer waits for each review round also let the prompt cache expire, so the orchestrator rebuilt its whole context 6 times. Two of those were my laptop going to sleep mid-run, which is the kind of thing a 100-minute run invites.

![Stacked bars of tokens processed, split into orchestrator and subagents. Baseline 0.85M. Superpowers 17.6M, of which 12.95M orchestrator. EGM 33.6M, of which 25.36M orchestrator.](/writing-images/txmerge-token-spend.png)

![Orchestrator context over active time. Every arm starts near 40k. The baseline reaches 65k at 5 minutes, Superpowers 203k at 28 minutes and EGM 302k at about 100 minutes.](/writing-images/txmerge-orchestrator-context.png)

It hasn't been without adventure. The `subagent_tokens` figure Claude Code reports turned out to be the final context size, not total spend, so my first report understated cost by 7 to 21 times. I rebuilt every number from the transcripts, then had to reprice them, because my first pass charged every call at Opus rates.

## Is EGM worth it over Superpowers?

For code I'm going to ship myself, no. EGM cost about 4.8 times as much as Superpowers and took more than three times as long, and the code at the end was worse. It went through 16 review rounds and fixed 35 serious findings, and it still lost rows on the unclosed quote. Its reviewers read the design and never ran anything, so none of them noticed that Python's CSV reader quietly swallows the rest of a file after a broken quote - and the spec never mentions the case. Neither of its review loops converged either; both stopped at the 5-round cap, with the style reviewer finding fresh wording issues every round.

But EGM's spec is genuinely better. It pinned down every byte of output, every error message and the overwrite case Superpowers shipped, and a judge said two engineers could build from it and get identical results. The price is about 785 lines and close to an hour of reading for a tool of about 450.

The interesting part is where that quality came from. Most of EGM's discovery happened in its brainstorm and stakeholder rounds, which cost 7% of its total. The review loops cost 39% directly, plus most of the orchestrator's growth, and found mainly wording.

So my answer is to take EGM's front half and Superpowers' back half. Use the elephant to brainstorm and ask the awkward questions, skip the review loops, then hand the brief to Superpowers' plan, build and final review. If the spec itself is the deliverable - another team builds it, or a mistake in the requirements is expensive - then the full EGM run earns its cost.

## Three problems, same ranking

One run proves little, so I ran the experiment twice more and changed nothing but the problem statement. Stockmerge merges overlapping stock-take scans from two barcode scanners and links stock moved between locations. Tsinvoice merges overlapping exports from two time trackers and prices the sessions for invoicing. Each got its own 13 hidden policies, 18 hidden tests checked against a reference implementation, and a robustness probe written before any arm ran. The prompts, the stakeholder protocol and the blind judges with their sealed mapping stayed the same, and an audit of every transcript found no arm reading the answer key.

![Three problems, each cell reading txmerge, stockmerge, tsinvoice. Hidden tests out of 18: baseline 18, 17, 18; Superpowers 18, 17, 18; EGM 18, 18, 18, where the 18 on stockmerge came from a stakeholder leak. Blind code review rank: baseline 3, 3, 3; Superpowers 1, 1, 1; EGM 2, 2, 2. Blind design review out of 25: Superpowers 17, 16, 18; EGM 21, 20, 21. Data-loss probes passed: baseline 0 of 6, Superpowers 2 of 6, EGM 3 of 6. Cost per run: baseline $0.71, $0.94, $1.15; Superpowers $6.46, $7.15, $8.62; EGM $31, $32, $25. Active minutes: baseline 5, 4, 5; Superpowers 28, 32, 39; EGM about 100, 114, 77.](/writing-images/three-problems-scoreboard.png)

The ranking held on all three. Superpowers wrote the best code every time and EGM the best design every time, while every arm scored 17 or 18 out of 18 on the hidden tests. The cost order never moved either: about $1, $7 and $30 a run, with EGM at 2.9 to 4.8 times Superpowers.

Two things did move. Across the six data-loss cases EGM passed 3, Superpowers 2 and the baseline none, but which case each plugin caught changed from problem to problem, so I wouldn't rely on either. And on tsinvoice EGM stopped its review loops after one re-audit instead of running to the 5-round cap, which made it about 20% cheaper and 30% faster with the same scores - more evidence that its quality comes from the front half, not the loops.

The weak point is the stakeholder. Being a model, it volunteered policy it wasn't asked about on every problem, helping a different arm each time, and on stockmerge it handed EGM the one rule all three arms missed on merit. That is why I trust the blind reviews, the probes and the bill more than the hidden tests. Every brief, prompt, spec, review report and verdict is in the experiment repo listed below.

## What I'd take from it

- **Process bought robustness, not rule-following.** Each plugin caught a data-loss case the plain agent shipped, and each missed one.
- **Review the code, not just the document.** Superpowers' one whole-branch review at the end found more than all its per-task reviews put together.
- **The orchestrator's context is the bill.** Multi-agent workflows should hand reports over on disk and start a fresh context for each phase.

The caveats are real: one run per arm on each problem, one model, and a scripted stakeholder instead of a human at the gates. Next I want to try the fourth arm - EGM's brainstorm feeding Superpowers' build - with a stakeholder that answers from fixed text instead of paraphrasing the key. If you have tried something similar, I'd love to compare notes.
