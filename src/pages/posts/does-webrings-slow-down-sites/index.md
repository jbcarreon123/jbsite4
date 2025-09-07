---
layout: '../../../layouts/PostLayout.astro'
title: Does having webrings slow down your site?
published: 09/07/2025 20:44
description: There is some debate lately of how webrings slow down sites, so here's some data if it actually does slow down your site or not.
tags: indie-web, webrings
---

So, I have seen multiple sites that moved their webrings into a seperate page because its slowing down their site. It's good because it reduces clutter, but does webrings actually makes webpages slow?

To actually test it out, I grabbed Playwright, coded a quick site load time test with it, which tests sites 3 times normally and 3 times without JS-based webring widgets. Here's the curated list that I used for the test:

https://jbc.lol/webrings/

https://petrapixel.neocities.org/about/webrings

https://aglovale.nekoweb.org/links

https://keysklubhouse.com/

https://layercake.moe/links

https://joo.sh/locations

https://oversurge.nekoweb.org/

https://darkosparko.nekoweb.org/

https://baccyflap.com/rsp/

https://ddnikki.nekoweb.org/webrings

https://duducat.moe/index/outlinks/

After 15 minutes, I got the data, and here it is!
<webring-test-results></webring-test-results>

<p class="tg">Tip: This can be interacted, just click the dropdown below to check the sites and the iterations!</p>

# Weirdly slow...
If you checked the results above, it is normally just goes down a bit when you switched to the normal iterations to the no JS iterations, except one site: Petrapixel's site.

This below is how slow hers site on the normal iterations:
<webring-test-results link="https://petrapixel.neocities.org/about/webrings" iter="1" noSelect="true"></webring-test-results>

Compared to the no JS one:
<webring-test-results link="https://petrapixel.neocities.org/about/webrings" iter="4" noSelect="true"></webring-test-results>

***19 seconds apart*** on DOMContentLoaded. How? It's consistent too. Putting it on Lighthouse shows a good score, and I am plugged in via a Ethernet cable, so what gives? Let's answer that later.

# How does a webring work?
There are 2 kinds of webrings, widgets and redirects.

## Webring widgets
Let's talk first about widgets, here's how they work, simplified:

![The process of a JS-based webring widget](/imgs/posts/does-webrings-slow-down-sites/webring-widget.svg)

It's one of the quickest ways to have a webring. It's also customizable that is in favor by the webring owner, and it's easy to tell if the person is in the webring or not.

There are a lot of downsides though. Because it's JS, it's one of the things that is prone to [render blocking](https://developer.mozilla.org/en-US/docs/Glossary/Render_blocking), which basically means it blocks rendering of the website to load the JS on it. And the worst part of it is that it's commonly a third party script, which also multiplies the page load times, as the browser also need to fetch the data from that other site.

It's also prone on clashing with other webring widgets (commonly seen on Onionring-based webring widgets), and if the owner didn't set it up right, it might also ruin your site layout. If the webring owner also put some assets on the widget, the browser also needs to get those to continue, and bad internet would definitely break the experience.  

## Webring redirects
This is the other popular one, webring redirects. Here's how they work:

![The process of a webring redirect](/imgs/posts/does-webrings-slow-down-sites/webring-redirect.svg)

Webring redirects fixes almost all the issues of webring widgets. It offloads the processing off your site's client-side JavaScript to the webring owner's site or server. They are usually handled by a backend server which allows webring redirects to not render HTML at all.

Here's how a server-side webring redirect works:

![Process of a server-side webring redirect (shown here is simple-webring-redirect), with HTTP response](/imgs/posts/does-webrings-slow-down-sites/redirect-server.svg)

There's also now a new kid in the block, client-JS based webring redirects. It's less heavy than webring widgets, but you will still load an HTML page, for example, [Petrapixel's Code Collective webring](https://petrapixel.neocities.org/webring) which uses [Webringu](https://petrapixel.neocities.org/coding/webringu).

Here's how it works:

![Process of a client side JS webring redirect (shown here is Webringu), with HTTP response and JS snippets](/imgs/posts/does-webrings-slow-down-sites/redirect-js.svg)

## Now, let's go back on the thing [earlier](#weirdly-slow).
What is the culprit? A webring that gone dark.

![The response when you try to load that webring](/imgs/posts/does-webrings-slow-down-sites/gone-dark.png)

This shows how third-party dependencies, not just webrings can ruin your site's performance.

# What should I do?
If you're putting your webrings in the index page, firstly count how many is your webrings. If it's less than 3, its fine on the landing or index page, and if not, consider putting it seperately as a slow loading index page is bad.

If you're making or maintaining a webring, be wary if your webring is too slow for the users and check if it's fast enough. You can embed it on your site and use things like [Pagespeed Insights](https://pagespeed.web.dev/) or Lighthouse to measure your site.

:::quote[[ThinLiquid](https://thinliquid.dev/) on Nekoweb Discord]
> OF COURSE IT'S THE F\*\*\*ING WEBRINGS

normalize lighthousing webrings oml
:::

That's about it, and if you wanna share something, share it in the comments! See you in the next post, and thanks for 150 followers in Nekoweb!
