---
title: "Multiple Layers of Quality Control"
date: "2022-07-25"
description: "So a bug in DoorDash payment system lead to hundreds of free food orders last week. Millions of dollars lost in compensation and many customers ended up…"
originallyPublishedAt: "https://mashhoodr.substack.com/p/multiple-layers-of-quality-control"
sourceUrl: "https://mashable.com/article/doordash-glitch-free-food"
sourceTitle: "Doordash glitch free food"
sourceHost: "mashable.com"
tags:
  - engineering practice
  - quality
  - testing
---

So a bug in DoorDash payment system lead to hundreds of free food orders last week. Millions of dollars lost in compensation and many customers ended up getting a poor experience as well. You can read more about it here:



**What can we learn from this event?**

Things to think about:
- What sort of validation do we have in place to stop such an event from happening?
- Do we have automated tests testing for this specific scenario?
- Does our QA check for such issues with our out going builds?
- What metrics are being tracked in our monitoring and observability apps, which could trigger an alert for such an issue?
- How would we debug such an issue quickly so keep the losses at a minimum?
- Are our deployment pipeline fast enough to quickly patch this issue?

Adding each layer, reduces the probability of this happening, and even if this does happen it ensures its caught quickly and turned around before it comes a bit issue for the company.
