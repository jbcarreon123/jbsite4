<script lang="ts">
    import { onMount } from "svelte";
    import MarkdownIt from "markdown-it";

    const processor = new MarkdownIt();

    const { path } = $props();
    let comments: any[] = $state([]);

    onMount(async () => {
        try {
            const request = await fetch(
                `https://cmt.nkko.link/api/jbc.lol${path}`,
            );
            const json = await request.json();

            console.log(json);

            comments = json.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt) });
        } catch (error) {
            console.error("there was an attempt. " + error);
        }
    });

    let parentId = $state("");
    let name = $state("");
    let cbox: HTMLFormElement | undefined = $state();

    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

</script>

<div class="c_widget">
    <form class="nkm-editor" method="POST" action="https://cmt.nkko.link/api/jbc.lol{path}" bind:this={cbox}>
        <div class="nkm-topInput">
            <input type="text" maxlength="64" name="name" placeholder="Display name" aria-label="Display name" required />
            <input type="url" maxlength="64" name="website" placeholder="Website (optional)" aria-label="Website (optional)" />
        </div>
        <textarea name="content" maxlength="1024" placeholder="Your comment..." aria-label="Your comment" required></textarea>
        {#if parentId}<input type="hidden" id="parentid" name="parentId" value={parentId}>{/if}
        <div class="bottom">
            {#if !!parentId}
            <p><span aria-hidden="true" class="ms" data-icon="reply"></span> Replying to {name}</p>
            <button class="nkm-button" onclick={(e)=>{e.preventDefault();parentId="";name=""}}><span aria-hidden="true" class="ms" data-icon="cancel"></span> Cancel Reply</button>
            {/if}
            <button class="nkm-button nkm-comment"><span aria-hidden="true" class="ms" data-icon="send"></span> Send!</button>
        </div>
    </form>
    {#each comments as comment}
        <div id="comment">
            <div class="info">
                <h3>{comment.author}</h3>
                <span>
                    {#if comment.website}<p><a href={comment.website} target="_blank">{new URL(comment.website).hostname}</a></p>{/if}
                    <p class="date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                </span>
            </div>
            <p>{@html processor.renderInline(comment.content)}</p>
            <button onclick={(e)=>{e.preventDefault();parentId=comment.id;name=comment.author;cbox?.scrollIntoView()}}><span aria-hidden="true" class="ms" data-icon="reply"></span> Reply</button>
            {#if comment.replies}
                <div class="replies">
                    {#each comment.replies as reply}
                        <div id="reply">
                            <div class="info">
                                <h3>{reply.author}</h3>
                                <span
                                    >{#if reply.website}<p><a href={reply.website} target="_blank">{new URL(reply.website).hostname}</a></p>{/if}
                                    <p class="date">
                                        {new Date(
                                            reply.createdAt,
                                        ).toLocaleDateString()}
                                    </p></span
                                >
                            </div>
                            <p>{@html processor.renderInline(reply.content)}</p>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {:else}
        <p>Loading comments...</p>
    {/each}
</div>

<style scoped>
    .c_widget {
        display: flex;
        flex-direction: column;
        gap: 6px;
        #comment {
            background-color: var(--altbg);
            padding: 8px;

            .info {

                display: flex;
                justify-content: space-between;

                h3, p {
                    padding: 0;
                    margin: 0;
                }

                span {
                    display: flex;
                    gap: 6px;
                }
            }

            #reply {
                background-color: var(--acc);
                margin: 6px;
                margin-left: 24px;
                padding: 8px;
                .info {
                    background-color: var;
                }
            }
        }

        .nkm-editor {
            background-color: var(--altbg);
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;

            .nkm-topInput {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
            }

            .bottom {
                display: flex;
                justify-content: end;
                gap: 6px;
            }
        }
    }
</style>
