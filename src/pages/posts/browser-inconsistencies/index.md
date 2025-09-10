---
layout: '../../../layouts/PostLayout.astro'
title: '[RANT] Browser inconsistencies, yes it still exists.'
published: 05/25/2025 23:00
tags: rant, webdev, browsers
description: I'm looking at you, WebKit.
---

Hello there! I'm currently writing this so I could cool down myself because I can't even count how many I discovered inconsistencies between browsers, like WHY DOES BROWSER INCONSISTENCIES STILL EXISTS? I thought this things are the things that I don't have to worry after I ditched Internet Explorer support, but yet I still have to make some fixes so browsers can look like what I want.

Like I usually test my site on Firefox (or Zen), and sometimes I test it on Chrome (or Thorium), but when I try testing it on WebKit browsers like Safari or GNOME Web, it just gives me more pain than to not test it on those browsers.

Like, look at this:

![Browser engines having different font rendering method (Left is Thorium [using Blink], Firefox [using Gecko], and GNOME Web [using WebKit])](/imgs/posts/browser-inconsistencies/inconsistent-font-rendering.avif)

Why is WebKit making bold text like its the black variant?

![Difference between Inter Bold and Inter Black, which the latter's font weight is much higher](/imgs/posts/browser-inconsistencies/interboldvsblack.avif)

There's also other stuff that irks me about this, like there's so many bugs on WebKit, that things like IndexedDB is broken in WebKit. [Yes, that happened](https://x.com/feross/status/1404568122158313474).

# The lack of options on targeting Safari/Webkit
This is also a thing I really hate about WebKit, or should I say Apple. They say that you need an Apple hardware to develop stuff to Apple systems, like for apps, I get it. **But not websites nor web apps**.

> But JB, You use Linux, you can use [GNOME Web](https://apps.gnome.org/Epiphany/)! And there's a lot of services out there that you can use to test your site on Safari, online!

Yes, there is the option to use GNOME Web, and yes, I can use services like BrowserStack, but **I shouldn't need to**. I should be able to target browsers when I need to, without jumping through virtual hoops that Apple wants to have.

And also, you wanna know what's powering your mobile browser on iOS? **WebKit**! Like you can install Chrome or Firefox, but they are just skins of Safari with some added features.

> But JB, you can have [alternative web engines if you live in the EU](https://developer.apple.com/support/alternative-browser-engines/)...

I'm not in the EU. Apple doing the most malicious compliance thing is still baffles me.

I really think that targeting WebKit is the new norm of targeting Internet Explorer back then. Buggy features, inconsistent behavior, and more.

# Normalizing CSS
After this debacle, I started using [Normalize.css](https://csstools.github.io/normalize.css/), and this code so bold text on Safari isn't too bold:

```css
@media screen and (-webkit-min-device-pixel-ratio: 0) {
    h1, h2, h3, h4, h5, h6, b, strong {
        font-synthesis: none;
    }

    * {
        text-rendering: optimizeLegibility;
    }
}
```

I suggest you to do the exact thing, it will reduce headaches for you and it's easier than using CSS resets.

This is the end of this rant, which just mostly focuses on WebKit/Safari. Have some experience dealing with inconsistent behavior on browsers, let me know in the comments!