<svelte:options customElement={{
    tag: "webring-test-results",
    shadow: "none"
}} />

<script>
    import '../styles/global.css';
    import { results } from '../lib/webringtest-results.ts';

    function truncate(input) {
        if (input.length > 16) {
            return input.substring(0, 16) + '...';
        }
        return input;
    };

    export let link = "https://wf.jbc.lol/webrings/";
    export let iter = "1";
    export let noSelect = false;

    const res = results
        .map((r) => {
            let dom = new URL(r.url);
            let url = new URL(r.favicon);
            let spl = url.pathname.split('/')
            let ext = spl[spl.length - 1]
            let fex = ext.split('.')

            return { slug: `${dom.hostname}.${fex[fex.length - 1]}`, ...r }
        });

    $: selectedItem = res.find(f => f.url === link) || results[0];
    $: selectedIter = selectedItem.results[Number.parseInt(iter) - 1];
</script>

<div class="WebringTest">
    <h1><img src={"/imgs/webring-res-fv/" + selectedItem.slug} alt="" /> {selectedItem.title}</h1>
    <h2>
        <a href={selectedItem.url} target="_blank"
            >{selectedItem.url}</a
        >
    </h2>
    <article>
        <h3>Load times</h3>
        <section>
            <div class="card">
                <h4>DOMContentLoaded</h4>
                {selectedIter.domContentLoaded.toFixed(2)}ms
            </div>
            <div class="card">
                <h4>Load</h4>
                {selectedIter.pageLoad.toFixed(2)}ms
            </div>
        </section>
        <h3>Core Web Vitals</h3>
        <section>
            <div class="card">
                <h4>First Contextual Paint</h4>
                {selectedIter.fcp.toFixed(2)}ms
            </div>
            <div class="card">
                <h4>Last Contextual Paint</h4>
            {selectedIter.lcp.toFixed(2)}ms
            </div>
            <div class="card">
                <h4>Cumulative Layout Shift</h4>
                {selectedIter.cls.toFixed(4)}
            </div>
            <div class="card">
                <h4>Time to First Byte</h4>
                {selectedIter.ttfb.toFixed(2)}ms
            </div>
        </section>
    </article>
    <div class="footer">
        <div>
            {#if !noSelect}
                <select bind:value={link}>
                    {#each results as l}
                        <option value={l.url}
                            >{truncate(l.title)}</option
                        >
                    {/each}
                </select>
                <select bind:value={iter}>
                    <option value="1">Iter #1</option>
                    <option value="2">Iter #2</option>
                    <option value="3">Iter #3</option>
                    <option value="4">No JS Iter #1</option>
                    <option value="5">No JS Iter #2</option>
                    <option value="6">No JS Iter #3</option>
                </select>
            {:else}
                <p>Iteration {(iter > 3) ? `#${Math.round(iter - 3)} (No JS widgets)` : '#' + iter}</p>
            {/if}
        </div>
        <p class="tg">
            &copy jbcarreon123. Licensed under CC BY-SA 4.0.
        </p>
    </div>
</div>

<style scoped>
    .WebringTest {
        margin-top: 6px;
        width: 100%;
        height: 100%;
        background-color: var(--altbg);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;

        section {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(0, 220px));
            gap: 6px;
            .card {
                background-color: var(--acc);
                padding: 6px;
            }
        }

        article {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        h1 {
            font-size: 1.75em;
            padding-top: 0 !important;
            line-height: 1em;
            img {
                display: inline;
                height: 0.8em;
                image-rendering: pixelated;
            }
        }

        h2 {
            font-size: 0.75em;
            font-weight: normal;
            text-transform: uppercase;
            color: var(--sec);
            a {
                color: inherit;
            }
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: end;
            margin-top: 12px;

            &>div {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
        }

        p.tg {
            font-size: 0.55em;
            text-align: right;
        }
    }
</style>
