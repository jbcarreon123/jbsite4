<script>
    let username = "jbcarreon123";
</script>

<div>
    {#await fetch(`https://status.cafe/users/${username}/status.json`)}
		<p class="tg">JB's status</p>
        <p>Loading status...</p>
    {:then out}
        {#await out.json()}
			<p class="tg">JB's status</p>
            <p>Loading status...</p>
        {:then status}
            <p class="tg">
                JB's status - <a target="_blank" href="https://status.cafe/users/{username}"
                >{status.face} {status.timeAgo} <span class="ms" data-icon="open_in_new"></span></a
            ></p>
            <p>{@html status.content}</p>
        {/await}
    {:catch err}
        <p>Error occured. {err}</p>
    {/await}

    <style>
        p {
            padding-top: 0 !important;
        }
    </style>
</div>
