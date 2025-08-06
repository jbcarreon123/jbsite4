<script lang="ts">
	async function loadStats() {
        const request = await fetch(`https://nekoweb.org/api/site/info/jbc.lol`,);
        let json = await request.json();

        return {
            updated: new Date(json.updated_at).toLocaleDateString(),
            created: new Date(json.created_at).toLocaleDateString(),
            views: json.views,
            followers: json.followers
        }
    }
</script>

<div>
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

<style>
    tr td:first-child {
        width: 100px;
    }

    tr td:last-child {
        padding-left: 8px;
    }
</style>