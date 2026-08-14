---
title: "Giving Requirements to Engineering."
date: "2022-09-14"
description: "When starting or working in a product company, one of the most common questions I get is around how to build the engineering team most feel that it is one of…"
originallyPublishedAt: "https://mashhoodr.substack.com/p/giving-requirements-to-engineering"
tags:
  - engineering leadership
---

When starting or working in a product company, one of the most common questions I get is around how to build the engineering team - most feel that it is one of the bigger challenges to do with building the product. However over the last decade, I have seen time and time again, once the engineers are onboarded - they get a poorly written document outlining the scope or a verbal instruction on what they should implement. While this can work in a few rare cases, I believe most of us need a slightly more structured approach to communicating what needs to be built from engineering.

If you are looking to understand on how to write user stories, then this blog post (and the associated book) are an excellent resource to start off from.

https://martinfowler.com/articles/product-backlog-building-canvas.html

### We are not trying to document *every* detail

It’s very common for some teams to fall in the trap to document every last detail about what needs to be build far into the future. If we are doing that, then we are working in a waterfall approach. We are however trying to document the **smallest possible deliverable **we should like to ship in order to add value to our product. Ideally this requirement can be delivered in a single sprint.

I dont think it can be better said then by Ben Horowitz in his popular article “[Good Product Manager / Bad Product Manager](https://a16z.com/2012/06/15/good-product-managerbad-product-manager/)”:

> Good product managers crisply define the target, the “what” (as opposed to the how) and manage the delivery of the “what.”

### Writing is an art.

> Perhaps the biggest problem with the list of shalls is the fact that it doesn’t give the stakeholder a feeling of how the product behaves. There is a long list of things the product needs to do but no information about how the product will do it. Without a feeling for how the user will interact with the product stakeholders often seem to be less engaged. They start to take the approach of indifference with the requirements solicitation phase so that development can “hurry up and start” so that they can see how the product works. This ends badly because it results in changes at the end of the project when refactoring is expensive.https://blog.devgenius.io/the-hardest-thing-about-engineering-is-requirements-28a6a70c4db4

The first problem most of us in Pakistan run into is finding someone who has good writing skills. And that too in English (Urdu would be an option if we were any better in that). Writing a requirement or user story in a concise and accurate way is definitely a rare skill, and requires mostly to be learnt over time as you write more and more user stories. And then it’s not just about the user stories, as mentioned in the article above, we also need to document our acceptance criteria, non-functional requirements and more. All this usually creates a pretty large overhead for most product teams to create and maintain, and requires a lot of discipline to do so.

### Reading is not black and white.

Unfortunately for most of us, our problems only get started. While everything is getting documented, everyone (yes everyone) has to also read it, discuss it and derive the tasks from it. So while we might be able to get away with just POs being good writers on the team, we need everyone on the team to be good readers. Everyone on the team should critically analyse each requirement, ask questions and clarify any ambiguity. We should be looking for conflicting requirements, and potential feature creep. This is often not the case (again a problem for any team where English is not their first language) which often leads to mis-communication.

### User Stories should not be written only by product team.

> Originally, anyone on an agile team used to write User Stories to communicate the work to be done. However, over time, largely driven by the expansion of the Scrum framework, the Product Owner became the primary person writing these stories and organizing them into a product backlog. However, anyone can (and should) write a User Story. Fábio Aguiar and I wrote our book about the Product Backlog Building technique to help everyone on the team write good user stories.

This excerpt is from the article linked above, easy to miss even though it’s right in the start. This small change has a large impact - because documentation becomes everyones responsibility. Engineers can no longer say, a particular requirement isnt documented, they are now part of the process. They also need to document the technical requirements for the given stories. QA teams writing test cases can enhance any edge cases the acceptance criteria is missing. Design teams can point out UX specific notes.

### **Product development is a collaborative process.**

Another common mistake is for product owners to write the complete document / user story before involving other team members into the picture. ** **So design, engineering, product, data and even quality teams need work together to outline the requirement and design the solution. This is easier said than done, each team is busy with their own work, and organising such cross functional meetings can be a huge pain for the product team. Too many of these meetings can lead to reduced focus, and pressure on delivery. This is exactly why most Big Tech companies have cross functional teams where design/engineering/product/qa/data are part of one unit working to deliver a single objective. However the balance between meeting is still something which the team need to figure out internally.
