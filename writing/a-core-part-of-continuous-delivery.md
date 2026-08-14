---
title: "A Core Part of Continuous Delivery"
date: "2022-07-25"
description: "Yesterday Cloudflare (worlds largest CDN) suffered an outage while deploying some enhancements to their network. We at Sastaticket.pk were also impacted in…"
originallyPublishedAt: "https://mashhoodr.substack.com/p/a-core-part-of-continuous-delivery"
tags:
  - engineering leadership
---

Yesterday [Cloudflare](https://www.linkedin.com/company/cloudflare/) (worlds largest CDN) suffered an outage while deploying some enhancements to their network. We at [Sastaticket.pk](https://www.linkedin.com/company/sastaticket.pk/) were also impacted in this outage.

Now I am pretty sure Cloudflare has the best engineers, and a solid test suite and a rigorous engineering process. However at the end of the day, it is people who build the product - and people sometimes make mistakes, some times miss out specific things.

So even in the best companies in the world we can have an outage - and sometimes it takes out a large portion of the internet. But the thing to focus on here is not that the outage happened, but how fast they were able to detect it (5 mins), find and fix the issue (30 mins) and recover from it (40 mins) [at global scale].

This is a core part of Continuous Delivery - having the correct observability tooling to detect changes and help diagnose the issues, and then a fast automated pipeline to help deploy (or revert) the changes as needed. And once all is said and done, a good post mortem (like the link below) to help understand the cause and setting up actions to avoid it in the future.

Strongly recommend reading the post mortem for better understanding of how things are done at Cloudflare.

https://blog.cloudflare.com/cloudflare-outage-on-june-21-2022/

[Share](https://mashhoodr.substack.com/p/a-core-part-of-continuous-delivery?utm_source=substack&utm_medium=email&utm_content=share&action=share)

Thanks for reading KarachiWalaDeveloper! Subscribe for free to receive new posts and support my work.
