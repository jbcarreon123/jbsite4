<script>
    const USERNAME = "jbcarreon123";
    const BASE_URL = `https://lastfm-last-played.biancarosa.com.br/${USERNAME}/latest-song`;

    async function fetchNp() {
        let r = await fetch(BASE_URL);
        return await r.json();
    }
</script>

{#await fetchNp()}
    <h2>Last played</h2>
    <p>Loading now playing stats...</p>
{:then json} 
    <h2>{json.track['@attr'].nowplaying == 'true' ? 'Now playing' : 'Last played'}</h2>
    <div class="np">
        <img src={json.track.image[2]['#text']} alt="Album art" />
        <div>
            <h3>{json.track.name}</h3>
            <p>{json.track.artist['#text']}</p>
            {#if (json.track.name != json.track.album['#name'])}<p>in {json.track.album['#text']}</p>{/if}
        </div>
    </div>

    <style>
        .np {
            display: grid;
            grid-template-columns: 85px 1fr;
            gap: 6px;
            padding-top: 6px;
        }

        img {
            width: 85px;
        }

        .np > div {
            display: flex;
            justify-content: end;
            flex-direction: column;
        }

        .np * {
            padding: 0 !important;
            max-width: 100%;
            text-wrap-mode: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
{/await}