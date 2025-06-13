<script>
	import { onMount } from 'svelte';

	const username = 'jbcarreon123'; // change the username!!!
	const posts_url = 'https://cafe.frizzbees.dev/get_posts/1?name=';
	const post_url = 'https://social.nekoweb.org/post/?id=';

	// thanks max
	async function loadStatus() {
		const request = await fetch(posts_url + username);
		let json = await request.json();
		json = json[0];

		let timestamp = json['timestamp'] * 1000;
		let time = new Date(timestamp).toUTCString();

		return {
			name: json["name"],
			post: json["post"],
			id: post_url + json["id"],
			time: time
		}
	};
</script>

<div>
	{#await loadStatus()}
		<p>Loading rambles...</p>
	{:then out}
		<a href={out.id}><p>{out.post}</p></a>
	{:catch err}
		<p>Error occured. {err}</p>
	{/await}
</div>