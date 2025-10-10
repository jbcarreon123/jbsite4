<script>
    import { onMount } from "svelte";

    const USERNAME = "jbcarreon123";
    const API_KEY = "202d561e5fdd095326f43d95d47dd233";
    const BASE_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json`;

    let json = $state(null);

    async function fetchNp() {
        let r = await fetch(BASE_URL);
        let j = await r.json();
        console.debug(j);
        return j.recenttracks.track[0];
    }

    onMount(async () => {
        json = await fetchNp();
        setInterval(async () => {
            json = await fetchNp();
        }, 60000);
    })
</script>

{#if !json}
    <p class="tg">Last played - <a target="_blank" href="https://www.last.fm/user/jbcarreon123">my last.fm  <span class="ms" data-icon="open_in_new"></span></a></p>
    <p>Loading now playing stats...</p>
{:else} 
    <p class="tg">{json['@attr'] && json['@attr'].nowplaying == 'true' ? 'Now playing' : 'Last played'} - <a target="_blank" href="https://www.last.fm/user/jbcarreon123">my last.fm <span class="ms" data-icon="open_in_new"></span></a></p>
    <div class="np">
        <img src={json.image[2]['#text']} alt="Album art" />
        <div>
            <h3>{json.name}</h3>
            <p>{json.artist['#text']}</p>
            {#if (json.name != json.album['#name'])}<p>in {json.album['#text']}</p>{/if}
        </div>
    </div>

    <style scoped>
        .np {
            display: grid;
            grid-template-columns: 85px 1fr;
            gap: 6px;
            padding-top: 6px;
        }

        .np img {
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
{/if}