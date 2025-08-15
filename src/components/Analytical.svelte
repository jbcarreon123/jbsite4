<script>
    import { Analytical } from "../lib/analytical.ts";
    const { data } = new Analytical();
</script>

<div class="analytical-container">
    <div class="top-stats">
        <section>
            <h3>Viewed my site</h3>
            <h2>{data.totalTimeVisited} time{data.totalTimeVisited>1 ? 's' : ''}</h2>
        </section>
        <section>
            <h3>First visited</h3>
            <h2>{data.dateFirstViewed.toLocaleDateString()}</h2>
        </section>
        <section>
            <h3>Total links clicked</h3>
            <h2>{data.linksClicked.length}</h2>
        </section>
        <section>
            <h3>View streak</h3>
            <h2>{data.streaks} day{data.streaks>1?'s':''}</h2>
        </section>
    </div>

    <h3>All visited pages</h3>
    <div class="top-stats">
        {#each data.pagesViewed.sort((a, b) => b.times - a.times) as page}
            <section>
                <h3>{new URL(page.url).pathname}</h3>
                <h2>{page.times} time{page.times>1?'s':''}</h2>
            </section>
        {/each}
    </div>

    <h3>All clicked links</h3>
    <div class="top-stats">
        {#each data.linksClicked.sort((a, b) => b.times - a.times) as page}
            <section>
                <h4>{page.url}</h4>
                <h2>{page.times} time{page.times>1?'s':''}</h2>
            </section>
        {/each}
    </div>
</div>

<style scoped>
    .analytical-container {
        padding-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .top-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;

            section {
                width: 100%;
                min-width: 225px;
                flex-grow: 1;
                flex-basis: 0;
                padding: 12px;
                background-color: var(--acc);
            }
        }
    }
</style>