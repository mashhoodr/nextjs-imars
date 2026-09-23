---
title: "Don't be a meat proxy"
date: "2026-09-23"
description: "Don't outsource your thinking is an argument about what you lose. This is the other half: what you owe the person who came to you, and why a relay costs you the trust you were valued for."
sourceUrl: "https://meatproxy.me/"
sourceTitle: "Meat Proxy"
sourceHost: "meatproxy.me"
references:
  - url: "https://meatproxy.me/"
    title: "Meat Proxy — Alvin, boringdystopia.ai"
    host: "meatproxy.me"
  - url: "https://karachiwala.dev/writing/dont-outsource-your-thinking"
    title: "Don't outsource your thinking"
    host: "karachiwala.dev"
tags:
  - agentic engineering
  - engineering leadership
  - AI adoption
  - trust
---

Someone built a small site in August called [meatproxy.me](https://meatproxy.me/), and it names something I have been trying to describe for a year without a good word for it.

A meat proxy is a person who takes a question they were asked, forwards it to a model, and forwards the answer back — "adding nothing but latency", as the site puts it. A human wrapped around an API, contributing the delay and nothing else.

The signs it lists are uncomfortably recognisable. Pasting a reply you have not read. Asking the model exactly what you were asked, word for word. Your value quietly becoming speed rather than insight.

I want to take the idea somewhere slightly different from where I have taken it before.

## This is not the argument I made last time

I wrote a piece called [Don't outsource your thinking](/writing/dont-outsource-your-thinking), built on the Anthropic trial where developers who delegated code generation scored 17% lower on concepts they had been using minutes earlier.

That was an argument about **you**. About your own learning, your own fundamentals, the skill quietly rotting while the output looks fine.

This is the other half, and it is the half I think gets less airtime.

It is not about what outsourcing costs you. It is about what it costs **the person who came to you**.

## They did not come to you for information

This is the bit worth sitting with. When a colleague asks you something, they are almost never asking for information. They have the same models you have, open in the next tab, free.

They came to you for three things a model structurally cannot supply:

- **The context you hold.** You know this system. You know it was rewritten last year, badly, under a deadline, and that the obvious answer is the one that already failed.
- **A position.** Models average. You can say "do this one, and here is what I would accept losing to get it." That is a stance, and it is the thing being asked for.
- **Accountability.** You can be wrong in a way that matters. The model cannot be wrong in any way that costs it anything.

A relay strips out all three and returns text. The question was addressed to a person and answered by a process. Those are not the same transaction, and the difference is the entire reason you were asked.

## People can tell

Not from the prose. The prose is usually fine — better than fine, that is rather the problem.

They can tell from what is missing. No reference to the specific system. No awareness of the history. No position anywhere in it. And never the sentence that real expertise produces constantly: *I could be wrong about this part.*

You do not notice this as a lie. You notice it as a flatness.

And the cost is not embarrassment, which would be survivable. The cost is trust. Once somebody suspects they are getting a relay, they stop asking you. They route around you. You will not be told this is happening — you will just find, some months later, that the interesting questions have stopped arriving.

You automated yourself out of the loop you were valued for, and you did it by being helpful.

## Where it shows up

In engineering organisations, it is rarely dramatic. It looks like this:

- **Code review** — ten generic best practices, none of which engage with the constraints this pull request is actually under.
- **RFC feedback** — a fluent summary of the proposal, with no weighing of the trade-off the proposal exists to make.
- **A junior asking an architecture question** — an answer that would be equally true at any company, which means it is not an answer about yours.
- **One-to-ones** — advice that sounds like a conference talk rather than like someone who knows what this person has been struggling with since March.
- **Hiring feedback** — a well-structured paragraph that would fit any candidate, on a decision that affects someone's year.

That last one is where it stops being a style problem.

## The fix is not to stop using the model

I use these tools constantly and I am not about to pretend otherwise. The fix is not abstinence, and anyone selling you that is not doing the work.

The fix is to put back the three things it cannot add. Before you send anything that began in a prompt:

- **Read it.** Properly. If you have not processed the words, you cannot stand behind them, and standing behind them was the job.
- **Verify the specifics.** Your name is the collateral on every technical detail in there.
- **Add the part only you have.** If you cannot write a sentence starting *"in our case…"* or *"the bit I am worried about is…"*, it is not ready to send.

That third one is the whole test, and I would make it a habit: **what did I add that the model could not have?**

If the honest answer is nothing, do not send it. And notice that you still have a genuinely useful thing to say instead — *"you will get a better answer asking the model directly than asking me"*. That is a real answer. It is more respectful of their time than a relay, and it is honest about where the value is.

## The underrated move

If you are busy, or tired, or simply do not know, the strong play is not a fast relay. It is this:

*I do not know. Here is who does.*

That is judgment. It requires knowing the shape of the problem well enough to know who owns it, and it is not remotely automatable. I would take it over a confident paragraph every single time, and so would whoever asked you.

The temptation to optimise for speed is real, and it gets stronger as the tools get better. But speed without insight is just noise delivered promptly.

Look at the last three substantial replies you sent. What did you add?

---

*Concept and coinage: [meatproxy.me](https://meatproxy.me/) by Alvin. Teaching teams to hold these tools well is most of what my workshops are for — [tell me where your team sits](mailto:hello@karachiwala.dev).*
