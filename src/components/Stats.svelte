<script lang="ts">
    async function loadNekoStats() {
        const request = await fetch(
            `https://nekoweb.org/api/site/info/jbc.lol`,
        );
        let json = await request.json();

        return {
            updated: new Date(json.updated_at).toLocaleDateString(),
            created: new Date(json.created_at).toLocaleDateString(),
            views: json.views,
            followers: json.followers,
        };
    }

    async function loadNeoStats() {
        const request = await fetch(
            "https://corsproxy.io/?https://neocities.org/api/info?sitename=jbcarreon123",
        );
        let json = await request.json();

        return {
            hits: json.info.hits,
            views: json.info.views,
            updated: new Date(json.info.last_updated).toLocaleDateString(),
            created: new Date(json.info.created_at).toLocaleDateString(),
        };
    }

    async function loadStats() {
        return {
            neko: await loadNekoStats(),
            neo: await loadNeoStats()
        }
    }
</script>

<div class="stats-container">
    {#await loadStats()}
        <div>
            <p>Loading stats...</p>
        </div>
    {:then out}
        <div>
            <p class="tg">Nekoweb: Views</p>
            <h2>{out.neko.views}</h2>
        </div>
        <div>
            <p class="tg">Nekoweb: Followers</p>
            <h2>{out.neko.followers}</h2>
        </div>
        <div>
            <p class="tg">Neocities: Views</p>
            <h2>{out.neo.views}</h2>
        </div>
        <div>
            <p class="tg">Neocities: Hits</p>
            <h2>{out.neo.hits}</h2>
        </div>
    {:catch err}
        <div>
            <p>Error occured. {err}</p>
        </div>
    {/await}
</div>

<style>
    tr td:first-child {
        width: 90px;
    }

    .stats-container {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        & > div {
            background-color: var(--acc);
            padding: 6px;
            min-width: 185px;
            flex-basis: 0;
            flex-grow: 1;

            & > h2 {
                margin-bottom: 0;
                font-size: 1.425em;
            }
        }
    }
</style>
