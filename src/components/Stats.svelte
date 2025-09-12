<script lang="ts">
	async function loadStats() {
        const request = await fetch(`https://nekoweb.org/api/site/info/jbc.lol`);
        let json = await request.json();

        return {
            updated: new Date(json.updated_at).toLocaleDateString(),
            created: new Date(json.created_at).toLocaleDateString(),
            views: json.views,
            followers: json.followers
        }
    }

    async function loadNeoStats() {
        const request = await fetch("https://corsproxy.io/?https://neocities.org/api/info?sitename=jbcarreon123");
        let json = await request.json();

        return {
            hits: json.info.hits,
            views: json.info.views,
            updated: new Date(json.info.last_updated).toLocaleDateString(),
            created: new Date(json.info.created_at).toLocaleDateString()
        }
    }
</script>

<div class="stats-container">
    <div class="nkw-stats">
        <p class="tg">Nekoweb Stats</p>
        {#await loadStats()}
            <p>Loading stats...</p>
        {:then out}
        <table>
            <tbody>
                <tr>
                    <td><b>Created:</b></td>
                    <td>{out.created}</td>
                </tr>
                <tr>
                    <td><b>Updated:</b></td>
                    <td>{out.updated}</td>
                </tr>
                <tr>
                    <td><b>Views:</b></td>
                    <td>{out.views}</td>
                </tr>
                <tr>
                    <td><b>Followers:</b></td>
                    <td>{out.followers}</td>
                </tr>
            </tbody>
        </table>
        {:catch err}
            <p>Error occured. {err}</p>
        {/await}
    </div>
    <div class="neo-stats">
        <p class="tg">Neocities Stats</p>
        {#await loadNeoStats()}
            <p>Loading stats...</p>
        {:then out}
        <table>
            <tbody>
                <tr>
                    <td><b>Created:</b></td>
                    <td>{out.created}</td>
                </tr>
                <tr>
                    <td><b>Updated:</b></td>
                    <td>{out.updated}</td>
                </tr>
                <tr>
                    <td><b>Views:</b></td>
                    <td>{out.views}</td>
                </tr>
                <tr>
                    <td><b>Hits:</b></td>
                    <td>{out.hits}</td>
                </tr>
            </tbody>
        </table>
        {:catch err}
            <p>Error occured. {err}</p>
        {/await}
    </div>
</div>

<style>
    tr td:first-child {
        width: 90px;
    }

    .stats-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
    }
</style>