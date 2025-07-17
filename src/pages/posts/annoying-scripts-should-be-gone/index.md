---
layout: '../../../layouts/PostLayout.astro'
title: (RANT) I despise annoying scripts
published: 02/28/2025 12:00
color: 5555ff
description: Annoying scripts just breaks engagement on the user. Stop it.
tags: rant, javascript, indie-web, web
---

> <p class="text-xs">Update 03/01/2025 @ 9:27 AM PHT</p>
> Found another site that has good leaky homepage script implementation. Thanks Xan!
> Also toned down some text.

> <p class="text-xs">Update 9:30 PM PHT</p>
> Changed the title to a more toned down one. Link stayed the same so already made links won't break.

> ⚠️ This post contains swearing. Proceed with caution.

# Preamble of the rant

So, the indie web space contains some wonderful work of art but it sometimes get crushed by annoying things,
from suddenly autoplaying music, to using scripts to make their website unusable.

I had a bounce transition on my site when you switch between pages, but decided to remove it because it's
annoying AF. 

I will just cover annoying JavaScript resources people uses here, so I would recommend seeing moosyu's blog
about [indie web peeves](https://moosyu.nekoweb.org/pages/blog/indie_web_gripes/) for other annoying stuff
on the indie web space.

Putting annoying scripts on your site just breaks user engagement. Yes, it is quirky but for the end user
visiting your site, this is just plain annoying.

Let's pull one script that I absolutely hate.

# melonking's leaky homepage script
![Leaky homepage script in action (note: simulated using inspect element)](/imgs/posts/annoying-scripts-should-be-gone/image2.webp)

This is melonking's leaky homepage script. It fills the webpage with water, and it's multiplayer, and
I ABSOLUTELY DESPISE IT.

If I needed something, and this fucking flood just pierces my eyes, I would just leave.

If you need to see or **click something** on the site, and this flood is there blocking it, **nuh uh**,
you won't see it or the click won't be registered on to the target element, instead you will see this
fucking water just blocking the contents of the site.

And if you tried clearing it out, it plays a loud ass water sound effect EVERY TIME you clicked the fucking
thing.

## Great implementations
I have seen 2 great implementations (as of 03/01/2025 PHT), and that are:
- [Xan's website](https://xan.lol/) where he put the flood behind
the content, and
- [WiiCHICKEN](https://wiggle.monster) where they put the flood on a respective area
  ![the flood is on it's respective area](/imgs/posts/annoying-scripts-should-be-gone/image3.webp)

If you are just blocking the content with the fucking flood, please fucking stop.

# So I just did what I'm gonna do
and just blocked the scripts using ublock's custom filter lists.

![ublock blocking melonking.net](/imgs/posts/annoying-scripts-should-be-gone/image.webp)

You can too by putting this:
```
||{domain of the annoying script}^$script,3p
```

That won't disable scripts when you're on that domain tho because I want it to not break other scripts.

This is actually possible because most of these scripts are ran client-side.

# And that's my TED talk.
Thanks for reading.