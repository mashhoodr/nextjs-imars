---
title: "Understanding Deployment Pain."
date: "2022-09-05"
description: "One of the core metrics for Engineering productivity is the frequency of deployments, measured by \"number of deploys per day per developer\". According to the…"
originallyPublishedAt: "https://mashhoodr.substack.com/p/understanding-deployment-pain"
tags:
  - continuous delivery
  - developer productivity
  - engineering practice
---

![A typewritten quote card from Accelerate by Jez Humble: teams that implement comprehensive test and deployment automation, use continuous integration including trunk based development, shift left on security, manage test data effectively, use loosely coupled architectures, can work independently, and version control everything needed to reproduce production, decrease their deployment pain.](/writing-images/understanding-deployment-pain-1.jpeg)

*quote from the book “Accelerate by Jez Humble”*

One of the core metrics for Engineering productivity is the **frequency of deployments**, measured by "number of deploys per day per developer".

According to the book "Accelerate by Jez Humble" - the high performing teams deploy at the significantly increasing frequency as their team scales. This of course *helps* the business deliverables move faster as we add more people, not slower.

So how do we achieve this increasing frequency? By decreasing the deployment pain. The book answers:

> "teams that implement comprehensive test and deployment Automation ; use continuous integration, including trunk based development; shift left on security; effectively manage test data; use loosely coupled architectures; can work independently; and use version control of everything required to reproduce the production environment decrease their deployment pain"

So lets break down the things mentioned in the list above:

- Comprehensive automated tests
- Deployment automation
- Trunk Based Development
- Shift Left on Security
- Loosely coupled architectures
- Can work independently
- Effectively Manage Test Data
- Use version control for everything

In the start your deployments are manual, the pain might not be so high initially (may be just a quick git pull and restarting the server?) but as the team grows, and complexity grows - you will have a more complex build pipeline, and a checklist of things to follow on every deployment. The risk of breaking the live environment increases, more steps mean greater chance of breaking something. And over time, your team will start to avoid deploying altogether - they want to play it safe. The mental drain of each deployment becomes too high, so the frequency of it gets reduced.

So the most important thing to understand is that a core part of reducing deployment pain is **automation.** Starting from deployment automation and then automated tests. Without these two the others have little effect on deployment pain. It’s when you start focusing on these two - another two factors will come into play, loosely coupled architectures and working independently.  You will realize that deploying a large monolith comprising of 100s of services is harder than deploying any one service of them. This might lead to refactoring some code, or even writing new services so we can reduce deployment pain.

![A two-part thread by Allen Holub arguing that refusing to deploy on a Friday is a red flag: it signals code too poorly tested to risk over a weekend, and that a sprint is a review cadence rather than a deployment cadence.](/writing-images/understanding-deployment-pain-2.jpeg)

*Quote from Allen Holub on Twitter*

Another important point some companies make the mistakes of - considering “sprints” as review cadence rather than deployment cadence. I have seen many companies feel that deployment is done once a sprint and at the end of that sprint. Some products do have a restrictive cycle, esp. if hardware is involved - but for most of us there is no hard in shipping code on a daily basis.

Finally, just shipping fast does not ensure value generation for the business. It is also important to build the "goal oriented generative culture” so we can also measure if our deploys are generating the required value to the business as well.

#### Upcoming addition:

How creating multiple additional staging / QA environments add to the deployment pain.

**Please consider subscribing.**
