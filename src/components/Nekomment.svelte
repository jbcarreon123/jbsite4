<script lang="ts">
    export let url;
    import { onMount } from "svelte";

    let comments = [];

    onMount(async () => {
        try {
            const request = await fetch(
                `https://cmt.nkko.link/api/maxpixels.moe/${url}`,
            );
            const json = await request.json();

            console.log(json);

            comments = json;
        } catch (error) {
            console.error("there was an attempt. " + error);
        }
    });
</script>

<div class="comments">
    {#each comments as comment}
        <div id="comment">
            <span>
                <h2>{comment.author}</h2>
                <a href={comment.website}>{comment.website}</a>
                <p>{new Date(comment.createdAt).toLocaleDateString()}</p>
            </span>
            <p>{comment.content}</p>
            {#if comment.replies}
                <div class="replies">
                    {#each comment.replies as reply}
                        <div id="reply">
                            <span>
                                <h2>{reply.author}</h2>
                                <a href={comment.website}>{reply.website}</a>
                                <p>
                                    {new Date(
                                        reply.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                            </span>
                            <p>{reply.content}</p>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {:else}
        <h2 style="text-align:center">Loading..</h2>
    {/each}
</div>
