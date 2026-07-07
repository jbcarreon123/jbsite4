<script>
	import truncate from "truncate-html";

	const posts_url = `https://sk.nomaakip.xyz/api/v2/blog?page=0&startScroll=${Date.now()}&id=jb`

	function timeAgo(timestamp) {
		const now = new Date().getTime();
		const diffInSeconds = Math.floor((now - timestamp) / 1000);

		if (diffInSeconds < 60) {
			return "just now";
		} else if (diffInSeconds < 3600) {
			const minutes = Math.floor(diffInSeconds / 60);
			return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600);
			return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else if (diffInSeconds < 2592000) {
			const days = Math.floor(diffInSeconds / 86400);
			return `${days} day${days > 1 ? "s" : ""} ago`;
		} else if (diffInSeconds < 31536000) {
			const months = Math.floor(diffInSeconds / 2592000);
			return `${months} month${months > 1 ? "s" : ""} ago`;
		} else {
			const years = Math.floor(diffInSeconds / 31536000);
			return `${years} year${years > 1 ? "s" : ""} ago`;
		}
	}

	async function loadStatus() {
		const request = await fetch(posts_url);
		let jsonr = await request.json();
		let posts = jsonr.posts.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt) });
		let json = posts[0];
		for (let i = 0; !!json.parentId; i++) {
			json = posts[i];
		}

		let timestamp = Date.parse(json.createdAt);

		console.debug(json);

		const woot = await fetch(`https://sk.nomaakip.xyz/api/v2/post/${json.id}`);
		let wootJson = await woot.json();

		const forum = await fetch(`https://sk.nomaakip.xyz/api/forum/${json.id}`);
		let forumJson = await forum.json();

		const ask = jsonr.asks.find(x => x.postId === json.id);
		if (ask) ask.user = jsonr.users.find(x => ask.id === ask.userAsker);

		const like = wootJson.likes.length;
		const emoji = wootJson.emojiRelations.postEmojiReactions.filter(x => x.content !== '❤')
			.filter((t, i, a) => a.indexOf(a.find(x=> x.content === t.content)) !== a)
			.map(x => ({ ...x, emojiId: wootJson.emojiRelations.emojis.find(y => y.id === x.emojiId).url }))
		const repost = forumJson.posts.filter(x => x.isReblog).length;
		const replies = forumJson.posts.filter(x => !x.isReblog).length;
		const media = wootJson.medias.length;
		const tags = jsonr.tags.filter(x => x.postId === json.id).map(x => "#" + x.tagName).join(', ')

		
		console.log(emoji)

		return {
			post: truncate(json.content, 25, { byWords: true }),
			id: `https://sk.nomaakip.xyz/fediverse/post/${json.id}`,
			time: timeAgo(timestamp),
			like,
			repost,
			replies,
			tags,
			ask,
			emoji,
			media
		};
	}
</script>

<div>
	{#await loadStatus()}
		<p class="tg">Latest Woot</p>
		<p>Loading latest Wafrn woot...</p>
	{:then out}
		<p class="tg">
			Latest Woot - 
			<span class="ms" data-icon="favorite"></span> {out.like}
			<span class="ms" data-icon="comment"></span> {out.replies}
			<span class="ms" data-icon="repeat"></span> {out.repost} - 
			<a href={out.id} target="_blank">
				{out.time} <span class="ms" data-icon="open_in_new"></span>
			</a>
		</p>
		{#if out.ask}
			<div class="ask">
				<p class="tg">{out.ask.user ? out.ask.user.url : 'Someone'} asked</p>
				<p>{out.ask.question}</p>
			</div>
		{/if}
		{@html out.post}
		{#if out.post.endsWith('...</p>')}<p><a href={out.id} target="_blank">Open in sk.nomaakip.xyz</a></p>{/if}
		{#if !out.post.endsWith('...</p>') && out.media > 0}<p><a href={out.id} target="_blank">Contains {out.media} media{out.media > 1 ? 's' : ''}. Open in sk.nomaakip.xyz?</a></p>{/if}
		{#if out.tags}
			<p class="tg">{out.tags}</p>
		{/if}
		{#if out.emoji.length > 0}
		<div class="emojis">
			{#each out.emoji as emoji}
			<img class="emoji" src={`${emoji.emojiId}`} alt={emoji.content} title={emoji.content}>
			{/each}
		</div>
		{/if}
	{:catch err}
		<p>Error occured. {err}</p>
	{/await}
</div>

<style scoped>
	div.ask {
		padding: 6px;
		margin-bottom: 6px;
		background-color: var(--altbg);

		p {
			padding-bottom: 0;
		}
	}

	.emojis {
		display: flex;
		gap: 6px;

		.emoji {
			background-color: var(--altbg);
			padding-bottom: 0;
			padding: 6px;
			height: 2em;
		}
	}
</style>