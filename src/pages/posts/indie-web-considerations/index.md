---
layout: '../../../layouts/PostLayout.astro'
title: 'Things the Indie Web should consider'
published: 07/23/2025 12:00
description: I don't think the indie web is perfect, and I want to share my thoughts what things webmasters should consider
tags: indie-web, manifesto
---

So, I made a manifesto about this issue that focuses on indie webmasters shunning mobile users, but I think it's not great to just give one perspective without looking more about another things, so I took down the Worker it has and delisted it on my feed. If you want an archive of it, you can check it out [here](/archive/mobile-responsiveness-manifesto). Also thanks Cloudflare for not propagating the Worker properly, but maybe it's because I just willy nilly deleted the A record and immediately pointed it to a worker.

The thing is that, even though I really care about mobile responsiveness, not every layout can be made responsive, and I left it out when I made the manifesto, but not when I made my first post about this issue. Yes you can make them responsive, but I don't think that can be possible without major reworks on the webmaster's site.

There's other things that I also left out that's also really important to talk about, like how responsiveness affect accessibility, and such (note that I purposely left out SEO because this is the indie web and you are not competing with billion-dollar conglomerates).

# We still need to talk about the "don't be a phone chump" thing.
If you're browsing the indie web on a phone, chances are that 8 of 10 indie sites isn't designed to be responsive, and 2 or 3 of them are actively shunning mobile users. I get it, mobile responsiveness is not a priority, and it can be hard, but I still think it's worth it.

The movement of actively shunning mobile users is just not great, like you're just shunning 60% of users worldwide, and I don't think the indie web should be like that.

Honestly, many manifestos on the indie web are saying that the corporate web is not built for users, and built for revenue, but I don't think those sites are also not built for users if they are actually shunning most of the users.

:::quote[June from layercake.moe on [Manifesto or Manifes-don't](https://layercake.moe/writing/articles/manifes-dont#:~:text=Many%20manifesto%27s%20will%20turn%20and%20say%20that%20the%20corporate%20web%20is%20not%20built%20for%20the%20viewer%2C%20and%20is%20built%20for%20the%20money%2C%20but%20I%20could%20say%20the%20same%20about%20your%20eye%2Dstraining%20and%20hostile%20website.%20Responsive%20design%20is%20not%20hard%20to%20learn.)]
Many manifesto's will turn and say that the corporate web is not built for the viewer, and is built for the money, but I could say the same about your eye-straining and hostile website. 
:::

It's much better off saying that your site is not optimized on mobile in your landing page because you don't have enough time, it's not the priority or you don't think it's worth it than **actually investing your time putting code that checks if the user is in mobile and doing something that makes them close your site**.

Some webmasters are also just making some select pages responsive, like blog pages, which is fine in most cases. My main takeaway about this is that you should consider making your site responsive, and if it's not possible, just let mobile users view your site, and not put some arbitrary code that actively just pushes "Fuck off mobile users" down on mobile user's throats.

## Shunning mobile users are actually shunning people who actually needs it
There's many factors why people are usually browsing on their phones, sometimes because they don't have a PC to use, sometimes they have mobility issues that forces them to use a phone, or sometimes because their PC is not good for the tasks.

There's also people that uses small screens, or even people that needs to zoom on your site, use a screen reader or use a braille display, and using a layout that doesn't flow correctly on every viewport can actually make or break your site. 

Most people are also not browsing the Web on a full screen web browser, and your site might break on those situations also[^1].

## Responsive Design misconceptions
There's still misconceptions about how responsive design works, like it's not just so phone users can view your site well, responsive design is the act of coding your site so it can respond well on viewports that is bigger or smaller than the viewport you are working on.

# Speaking of accessibility,
I've also seen so many sites out there that is really eye-straining, like the colors is really bright or there's not enough contrast and the user needs to squint on the screen to view your site. There's also sites that have elements flashing quickly, and you cannot turn it off or something, and there's the indie web's favourite attribute, `autoplay`[^2].

These kinds of things are annoying for normal people, but for people that has some issues that needed some accessibility things, it can be catastrophic, like you're not going to show a person that have photosensitivity a flashing element unless if you hate that person.

I know that it's your site, so you can do whatever you want, but I think everyone should consider accessibility, even just a tiny little bit, or you can just make a warning in your landing page that pages can be inaccessible, **and make the landing page accessible at least, please**.

# Your site, your rules
My site (codenamed jbsite4) is made modern because I want to show how can modern web designs work in the indie web, and if you have a negative word to say about the modern, flat design I have for my site, say it and I'll listen.

There's some people that is defining what a indie web site should have, and I don't think it should be! Indie web should be expressive, and your site should be yours, not someone else's.

Honestly, that's one of my thoughts about the whole Copyheart situation, I don't think copying a site shows a webmaster's expression, and no I'm not talking about people adapting from someone else's code, what I mean is someone using someone else's **entire site**, especially without credit. Same to AI-generated sites, like what defines your personality, you or the AI[^3]?

# I'm not badmouthing anyone...
And I am not forcing you to do this or that, what I'm just saying is you should consider these things and discourage just hating mobile users and just saying shit about them.

If your site doesn't work well on mobile, that's fine! But just remove the viewport tag and probably don't hide your site from mobile users, or worse, redirect them on a YouTube music video with billions of views.

:::quote[Mechagic from mechagic.party on [Bees in your House](https://mechagic.party/journal/Bees_in_your_house/#:~:text=Bonus%20that%27s%20not%20in%20the%20nekoweb%20discord%3A%20Making%20your%20website%20redirect%20to%20a%20rickroll%20if%20someone%20visits%20on%20mobile)]
Bonus that's not in the nekoweb discord: Making your website redirect to a rickroll if someone visits on mobile
:::


[^1]: I don't think I should explain how you would browse the web on a maximized browser in a large display or a ultrawide because you should know how would it end up.
[^2]: I know that browsers now strictly discouraging autoplaying, but it will not stop people from using a single interaction and it will make things play immediately.
[^3]: I should probably make a post about vibe coding but probably soon...