<script>
	const posts_url = "https://at.jbc.lol/xrpc/com.atproto.repo.listRecords?repo=did:plc:l2wisafcekcguy6kq627e5a3&collection=app.bsky.feed.post&limit=100&reverse=false";

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
		let json = jsonr.records[0];
		for (let i = 0; !!json.value.reply; i++) {
			json = jsonr.records[i];
		}

		const post = `https://constellation.microcosm.blue/links/all?target=${encodeURIComponent(json.uri)}`

		const postRequest = await fetch(post);
		let postJson = await postRequest.json();
		postJson = postJson.links;
		let like = 0;
		let repost = 0;
		let replies = 0;

		if (postJson["app.bsky.feed.like"]) like = postJson["app.bsky.feed.like"][".subject.uri"].records;
		if (postJson["app.bsky.feed.repost"]) repost = postJson["app.bsky.feed.repost"][".subject.uri"].records;
		if (postJson["app.bsky.feed.post"]) replies = postJson["app.bsky.feed.post"][".reply.parent.uri"].records;

		let timestamp = Date.parse(json.value.createdAt);

		return {
			post: json.value.text,
			id: `${json["uri"]}`.replace('at://', 'https://bsky.app/profile/').replace('app.bsky.feed.post', 'post'),
			time: timeAgo(timestamp),
			like,
			repost,
			replies
		};
	}
</script>

<div>
	{#await loadStatus()}
		<p class="tg">Latest post</p>
		<p>Loading latest Bluesky post...</p>
	{:then out}
		<p class="tg">
			Latest post - 
			<span class="ms" data-icon="favorite"></span> {out.like}
			<span class="ms" data-icon="comment"></span> {out.replies}
			<span class="ms" data-icon="repeat"></span> {out.repost} - 
			<a href={out.id} target="_blank">
				{out.time} <span class="ms" data-icon="open_in_new"></span>
			</a>
		</p>
		<p>{out.post}</p>
	{:catch err}
		<p>Error occured. {err}</p>
	{/await}
</div>
