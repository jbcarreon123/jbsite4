<script>
    let username = "jbcarreon123";
</script>

<div>
    {#await fetch(`https://status.cafe/users/${username}/status.json`)}
        <p>Loading status...</p>
    {:then out}
        {#await out.json()}
            <p>Loading status...</p>
        {:then status}
            <p class="tg"><a href="https://status.cafe/users/{username}"
                >{status.face} {status.timeAgo}</a
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
