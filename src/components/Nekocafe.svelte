<script>
	import { onMount } from "svelte";

	const username = "jbcarreon123"; // change the username!!!
	const posts_url = "https://cafe.frizzbees.dev/get_posts/1?name=";
	const post_url = "https://social.nekoweb.org/post/?id=";

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

	// thanks max
	async function loadStatus() {
		const request = await fetch(posts_url + username);
		let json = await request.json();
		json = json[0];

		let timestamp = json["timestamp"] * 1000;

		return {
			name: json["name"],
			post: json["post"],
			id: post_url + json["id"],
			time: timeAgo(timestamp),
		};
	}
</script>

<div>
	{#await loadStatus()}
		<p>Loading rambles...</p>
	{:then out}
		<a href={out.id} class="sta tg">
			{out.time}
		</a>
		<p>{out.post}</p>
	{:catch err}
		<p>Error occured. {err}</p>
	{/await}

	<style>
        a.sta.tg {
            padding-top: 0 !important;
        }
    </style>
</div>
