---
layout: '../../../layouts/PostLayout.astro'
title: Making this website
published: 03/01/2025 22:00
description: hmm... how did jb make his website???
tags: website, jbs-site, making-of
---
After reading my previous blog post about [making a website shouldn't cost you money](/posts/expenses-on-making-a-site),
you're wondering to yourself:

> This is broken.

> ``How did jb make this website?''

So, here's a post about how did I make my site!

# It's starts with...
So, when starting this website, I picked a framework to use. I picked [SvelteKit](https://svelte.dev/) because:

 - My v2 site (which is scrapped) is already made using SvelteKit,
 - I wanna learn more Svelte so I could use it in the future,
 - and because I just want to.

Then a JS runtime, I decided to go with [Bun](https://bun.sh) because that's the only JS runtime I have installed
back then.

## Svelte components are great!
It reduces clutter on the file by letting me create components that I can use in the page. It also opens the
possibility of using components in multiple pages.

Let's take a look on one of my components, the now playing widget:
```svelte
<script context="module">
	import { LASTFM_API_KEY, LASTFM_USERNAME } from '../config';

	export async function preload() {
		try {
			const response = await fetch(
				`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			let nowPlaying = null;

			if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
				nowPlaying = data.recenttracks.track[0];
				if (nowPlaying['@attr'] && nowPlaying['@attr'].nowplaying === 'true') {
					nowPlaying.isPlaying = true;
				} else {
					nowPlaying.isPlaying = false;
				}
			}

			return { nowPlaying };
		} catch (error) {
			console.error('Error fetching Last.fm data:', error);
			return { nowPlaying: null, error: error.message };
		}
	}
</script>

<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
  	import { fade } from 'svelte/transition';

	export let nowPlaying;
	export let error;

	let oldNpTitle: string = "";

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let nowPlayingStore: Writable<any>;

	if (typeof window !== 'undefined') {
		nowPlayingStore = writable(nowPlaying || null);
	} else {
		nowPlayingStore = writable(null);
	}

	async function getNowPlaying() {
		try {
			const response = await fetch(
				`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
				const newNowPlaying = data.recenttracks.track[0];
				if (newNowPlaying['@attr'] && newNowPlaying['@attr'].nowplaying === 'true') {
					newNowPlaying.isPlaying = true;
				} else {
					newNowPlaying.isPlaying = false;
				}
				if (oldNpTitle != newNowPlaying.name) {
					nowPlayingStore.set(null);
					setTimeout(function() { nowPlayingStore.set(newNowPlaying); }, 500)
				}
				oldNpTitle = newNowPlaying.name;
			} else {
				nowPlayingStore.set(null);
			}
		} catch (err) {
			console.error('Error fetching Last.fm data:', err);
			nowPlayingStore.set(null);
		}
	}

	onMount(async () => {
		if (typeof window !== 'undefined') {
			nowPlayingStore.set(nowPlaying);
			if (!nowPlaying) {
				await getNowPlaying();
				nowPlayingStore.set(nowPlaying);
			}

			const intervalId = setInterval(getNowPlaying, 20000);
			return () => clearInterval(intervalId);
		}
	});

	$: nowPlaying = $nowPlayingStore;
</script>

<div use:autoAnimate>
	{#if nowPlaying}
    {#key nowPlaying.isPlaying}
		<h1 in:fade class=" headercolor mt-[-6px] pb-2 text-2xl">
			{#if nowPlaying.isPlaying}
				Currently playing
			{:else}
				Last played
			{/if}
		</div>
    {/key}
		<div class="flex items-center justify-center">
			<div class="flex-1/4 p-1">
        {#key nowPlaying.image}
				{#if nowPlaying.image && nowPlaying.image[2] && nowPlaying.image[2]['#text']}
					<img
						src={nowPlaying.image[2]['#text']}
						class="aspect-square "
						alt="Album Art"
						width="auto"
						height="auto"
						loading="lazy"
            			in:fade out:fade
					/>
				{/if}
        {/key}
			</div>
			<div class="flex-3/4 p-1">
        {#key nowPlaying.name}
				<a
					class="headerfont nocol text-ellipsis"
					href={nowPlaying.url}
					target="_blank" rel="noopener" in:fade out:fade>
					<div class="mt-[-6px] text-ctp-sapphire hover:text-ctp-blue text-3xl sm:text-2xl">
						{nowPlaying.name}
					</div></a
				>
				<p class="text-sm" in:fade out:fade>{nowPlaying.artist['#text']}</p>
				{#if nowPlaying.album && nowPlaying.album['#text'] && nowPlaying.name !== nowPlaying.album['#text'] && nowPlaying.artist['#text'] !== nowPlaying.album['#text']}
					<p class="text-sm" in:fade out:fade>{nowPlaying.album['#text']}</p>
				{/if}
        {/key}
			</div>
		</div>
	{:else if error}
		<p style="color: red;">Error: {error}</p>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
```
That spaghetti code results to this:

Yes, that above is actually the component itself! We'll get back to it later.

# Helper libraries and stuff
I've also extensively used [TailwindCSS](https://tailwindcss.com/) for styling my site if I can,
and if not, I'm reverting to plain old CSS (it's fine).

For the theme, I use [Catppuccin](https://catppuccin.com/) (the Mocha variant) to theme my site.

For deploying my site to [Nekoweb](https://nekoweb.org), I use [`svelte-adapter-nekoweb`](https://github.com/jbcarreon123/svelte-adapter-nekoweb), made by me!

For the transitions between pages and widget transitions, I use [AutoAnimate](https://auto-animate.formkit.com/).

I use mostly flexboxes and grids on my layouts to ensure mobile responsiveness.

# Blog posts
For blog posts, I make them in svelte-hybrid markdown files using [MDSveX](https://mdsvex.webpwn.io), with these [unified](https://unifiedjs.com/) plugins:
 - [`rehype-external-links`](https://github.com/rehypejs/rehype-external-links),
 - [`rehype-slug`](https://github.com/rehypejs/rehype-slug),
 - [`rehype-autolink-headings`](https://github.com/rehypejs/rehype-autolink-headings), and
 - [`rehype-figure`](https://github.com/josestg/rehype-figure)

Look at the now playing widget above, because mdsvex processes it as html, it actually works.

For the codeblocks' syntax highlighting, I use [shiki](https://shiki.style/) that is integrated with mdsvex.

# External Tools and Sites I use
Tooling is important as the site itself, and here's what I use:
 - Code editor: [Visual Studio Code](https://code.visualstudio.com/)
 - Browser (for webdev): Firefox (Gecko, main browser), and Chrome (Chromium) *(sorry webkit users!)*
 - Site's guestbook: [Atabook](https://atabook.org)
 - Music: Apple Music *(this isn't free but you don't need this)*

# And that's about it!
Thanks for coming to see the behind the scenes of my site!