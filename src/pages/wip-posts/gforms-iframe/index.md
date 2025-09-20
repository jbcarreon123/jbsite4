---
layout: '../../../layouts/TutorialLayout.astro'
title: Custom Forms with Google Forms, with an iframe!
description: You can put custom form widgets using Google Forms, without redirecting users!
category: Widgets
published: 08/24/2025
---

There's ways you can put a form on your website, one is using an iframe, and the second is getting the IDs from each field and putting it directly on your site ([like this tutorial from dears](https://dears.nekoweb.org/blog/htmlgformstut)), but there's some catches on both of these. The former doesn't look great on every site, and the latter redirects you to Google Forms after you submit the form.

But how about you wanna stay the user on your site, how can we do that? With the power of iframes, we can do that! And the best part, it works on free Neocities accounts, hopefully.

> If you want to see my configuration of this, check out [this file](https://forged.32enoki.net/jb/jbsite4/src/branch/dev/src/components/Contact.astro)!

Here's how you can do that:

1. Create your form. Put all of your questions, and stuff. You absolutely need this for what we're doing.

2. Now, we need to get the IDs on the form, and you can use either of these options:

    A. Using the prefilled link method:
        
        1. Go to your form and click the 3 dots, then click Pre-fill form