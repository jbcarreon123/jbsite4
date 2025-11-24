---
layout: '../../../layouts/PostLayout.astro'
title: AI is overpowered now and it's really worrying
published: 11/24/2025 21:45
tags: rant, ai, llms
description: 'I think AI is still useful on some aspects (especially for things like scientific research), but please, whoever thought that hooking internet access on a Large Language Model is a good idea, to reconsider their choices.'
---

I still remember when ChatGPT released and became popular during the pandemic, and was like, this is really cool! That is 14-year-old me, with a tablet on his hands. Back then, it just does some chat, with some visible clues that it is made by an LLM, and we don't even have images back then.

Now, ChatGPT can talk to you verbally, you can upload images, documents, code, and stuff, and even search and browse the entire Internet, and that last thing is the most worrying thing nowadays.

Now that we are on the social age where everyone has their social media accounts, websites, and stuff, there is no one stopping someone to ask an AI that has deep searching to query "who is @user from \<social platform\>" and you get their info on other platforms, even those that they want to be private. **It's terrifying.** It is much worse on fediverse accounts because the LLM can just jump to a peered instance and get user info from there.

# AI images and videos are terrifying, too
Image and video generation models have been trained enough that it can look basically indistinguishable to a real video if you are a normal person scrolling through a algorithmic feed.

Of course, if you know how to spot these AI-generated content you would see some issues on the post, but most people **doesn't have that ability**. There is some services that watermarks AI-generated content which some of the biggest services use, but that is mostly intended for other softwares to detect AI-generated content, not humans.

# So, what can we do?
Honestly, there is little we can do. You could use tools like [Anubis](https://anubis.techaro.lol/) or [Iocaine](https://iocaine.madhouse-project.org/) but some services can basically bypass them by simply using a much powerful machine and a headless instance of Chromium to load content on a specific site.

Cloudflare's AI protection rules can also work on AI scrapers but not AI agents, which fights most services, but when a person wants to search your site with something like a deep research tool on a AI software, it can just bypass this easily.

I feel like this is another classic cat-and-mouse situation, where AI blockers grow, AI platforms successfully bypassed it, AI blockers successfully blocks the attempt and it repeats, just because AI platforms wants to make shareholders happy.