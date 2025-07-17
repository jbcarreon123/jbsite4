---
layout: '../../../layouts/PostLayout.astro'
title: jbsite4, preparing for takeoff.
published: 04/15/25 11:00
tags: migration, astro, sveltekit
description: jbSite, now in version 4, is now written in Astro, and more!
background: '/imgs/posts/jbs-site-a-new-look/banner.webp'
---

Hey there! I just made the decision to rewrite my entire site as its currently a mess, but I was satisfied on keeping it, until now.

# So, what changed?
A lot has changed, and here's some of it!

## Rewritten in Astro!
The site has transitioned from using SvelteKit to Astro!

I liked SvelteKit but the thing I don't like on it is it's routing and the file structure. Here on Astro, I can choose if I want to use `page.astro` or `page/index.astro` and it will just accept it, and I'm already getting confusion on the `+page.svelte`s that I have in my IDE.

## A new layout
Every new major version comes with a new layout, and this is no exception.
It's more modern-looking though.

## Replaced my miniRambles system to Nekocafe
Instead of using my Nekoweb RSS for my mini rambles, I joined Nekocafe for it.
You can follow me there on [here](https://social.nekoweb.org/profile/?view=jbcarreon123)!

Note that because of that, `nekoweb-feed.xml` is no more.

Also you should change your feed clients to point to `feed.xml`, `feed.atom`, or if your reader supports it, `feed.json`.

## But, I still need to make some things work.
These things are some of the stuff I need to work on:
- Improved post view
- Customize panel
- Some general viewport bugs
- A themed button
- Deploy from GitHub

## Guestbook is now using Ayano's Comment Widget
It means that you can now style your comment with Markdown! You can go now to [/guestbook](/guestbook/) if you want to see it.

Wanna see the previous stuff? The atabook guestbook will stay archived.

## And that's pretty much it!
Please note that this is a personal site, so it's not even close to being done.

Liked my site? Thoughts? Leave it on the comments below or on my guestbook! And see you later (hopefully I finish the post I want to finish)