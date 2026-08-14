---
title: "Don't outsource your thinking"
date: "2026-03-03"
updated: "2026-08-14"
description: "A randomised trial of 52 junior developers found AI assistance cut coding mastery by 17 percent. The ones who did well used it differently, and the difference is teachable."
sourceUrl: "https://www.anthropic.com/research/AI-assistance-coding-skills"
sourceTitle: "How AI assistance impacts the formation of coding skills"
sourceHost: "anthropic.com"
tags:
  - engineering leadership
  - AI adoption
  - developer education
  - agentic engineering
---

"Don't outsource your thinking" has been my favourite line for a couple of years now. It just got upgraded from an opinion to a finding.

New research from Anthropic ran a randomised controlled trial with 52 engineers, mostly junior — Python users unfamiliar with the async library they were asked to work in. Each worked through tasks either with AI assistance or by hand, then took a quiz on the concepts they had just used.

The AI group scored **17% lower** on concepts they had been using minutes earlier. Close to two letter grades.

That number on its own is easy to misread as "AI makes people worse", which is not what it says, and not what I have seen.

## The split inside the study is the whole story

The trial did not find that everyone got worse. It found that the *same tool* produced opposite outcomes depending on how it was used.

**The ones who did well engaged with it.** They asked follow-up questions. They requested explanations. They posed conceptual questions while coding. They used the model to build understanding.

**The ones who struggled offloaded.** They took the output and moved on. They never developed the oversight skills needed to catch errors and steer what the model produced.

The split is stark enough to be worth stating precisely: developers who used AI for **conceptual questions** scored 65% or higher. Those who **delegated code generation** to it scored below 40%. Same tool, same task, opposite outcomes.

![A bar comparison from the Anthropic study: developers who asked conceptual questions scored 65 percent or higher, those who delegated code generation scored below 40 percent.](/writing-images/skill-split.png)

*The tool did not decide the outcome. How it was held did.*

The biggest gap between the two groups was **debugging** — the ability to identify that code is wrong and understand why it fails.

That is not an incidental finding. Debugging is precisely the skill that agentic workflows depend on most, because reviewing generated code *is* debugging code you did not write. The study found the mode of AI use that feels most efficient is the one that erodes the exact capability the future of the job requires.

I have been saying a version of this in sessions for a while: **if your fundamentals are weak, AI will not be able to help you.** You can absolutely use AI to build those fundamentals. But only if you do not outsource your thinking while you do it.

## The problem is older than agents

None of this is new. It is easy to copy an instruction into a language model and paste the answer back. Engineers were doing exactly this with Stack Overflow for years.

The real issue was never the pasting. It was pasting something you do not understand.

What has changed is the scale and the visibility. When the act of pasting evolves into agents directly editing your files, the core problem stays identical and the surface area multiplies. If you do not grasp what has been done and why, you will eventually face the consequences — you have just moved the moment when you find out, from the paste to production.

## Two habits that actually work

These are the two I use, and they are the two I teach.

**Make it ask you questions.** One of the most effective ways to build understanding and alignment with a model is to get it to interrogate you. It forces you to think about aspects you had not considered, and it regularly surfaces points you would have missed. The more questions it poses, the deeper your own understanding gets.

This inverts the usual dynamic. Most people treat the model as the thing that answers. Used as the thing that *asks*, it becomes a much better tool for thinking.

**Ask questions yourself, to test comprehension.** Not yours — its. Probe whether it has actually understood your intent. If I cannot ask questions of the work, I am noticeably less confident about the work.

That feeling is a useful signal, and I would encourage people to trust it. The discomfort of not being able to interrogate your own output is information.

## What this means if you run a team

This is the finding I would put in front of an L&D or engineering leadership team before rolling out any AI tooling programme, because it reframes what the programme is for.

Access is not adoption. Handing 200 engineers a licence and measuring seat usage tells you nothing about whether capability is rising or rotting. The study says both outcomes are available from the same tool, and that the difference is behavioural.

So the thing worth training is not the tool. It is the habit:

- Ask *why* the model went down this path, every time, not just when something looks wrong.
- Request explanations as a default, not as a fallback.
- Understand the concept rather than accepting the solution.
- Treat "I cannot explain this diff" as a blocker, the same way you would treat a failing test.

**This is skill rot in real time, and it is measurable.** Which also means it is preventable, and that the prevention is cheap — it is a change in how people are taught to hold the tool, not a change in the tool.

---

*Teaching that habit at team scale is a large part of what my workshops are for. [Tell me where your team sits](mailto:hello@karachiwala.dev).*
