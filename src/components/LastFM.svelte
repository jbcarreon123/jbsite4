<script>
    const USERNAME = "jbcarreon123";
    const API_KEY = "202d561e5fdd095326f43d95d47dd233";
    const BASE_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json`;

    async function fetchNp() {
        let r = await fetch(BASE_URL);
        let j = await r.json();
        console.log(j);
        return j.recenttracks.track[0];
    }
</script>

{#await fetchNp()}
    <h2>Last played</h2>
    <p>Loading now playing stats...</p>
{:then json} 
    <h2>{json['@attr'] && json['@attr'].nowplaying == 'true' ? 'Now playing' : 'Last played'}</h2>
    <div class="np">
        <img src={json.image[2]['#text']} alt="Album art" />
        <div>
            <h3>{json.name}</h3>
            <p>{json.artist['#text']}</p>
            {#if (json.name != json.album['#name'])}<p>in {json.album['#text']}</p>{/if}
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