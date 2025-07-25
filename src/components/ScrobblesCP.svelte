<script>
    import { onMount } from "svelte";

    const USERNAME = "jbcarreon123";
    const API_KEY = "202d561e5fdd095326f43d95d47dd233";
    const BASE_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json`;

    let jsonFirst = $state(null);
    let json = $state(null);

    async function fetchNp() {
        let r = await fetch(BASE_URL);
        let j = await r.json();
        return j.recenttracks.track;
    }

    onMount(async () => {
        json = await fetchNp();
        jsonFirst = json[0];
        console.log(jsonFirst);
        setInterval(async () => {
            json = await fetchNp();
            jsonFirst = json[0];
        }, 60000);
    })
</script>

<div id="np">
{#if !json}
    <h1>Loading...</h1>
{:else}
    <div class="bg">
        <img src={jsonFirst.image[3]['#text']}>
    </div>
    <div class="st">
        <div>
            <img src={jsonFirst.image[3]['#text']}>
        </div>
        <div class="info">
            <p class="tg">{jsonFirst['@attr'] && jsonFirst['@attr'].nowplaying == 'true' ? 'Now playing' : 'Last played'}</p>
            <div>
                <h2>{jsonFirst.name}</h2>
                <p>{jsonFirst.artist['#text']}</p>
            </div>
        </div>
    </div>
{/if}
</div>

<style scoped>
    #np {
        padding: 6px;
        background-color: var(--acc);
        position: relative;

        .bg {
            position: absolute;
            inset: 0;
            z-index: 0;
            background-color: var(--altbg);
            width: 100%;
            height: 100%;
            overflow: hidden;

            img {
                object-position: center;
                object-fit: cover;
                min-width: 100%;
                filter: blur(12px);
                opacity: 0.25;
                transform: scale(1.5);
                animation: rot 20s linear forwards infinite;
            }
        }

        .st {
            position: relative;
            z-index: 1;
            display: grid;
            gap: 6px;
            grid-template-columns: 100px 1fr;

            img {
                width: 100%;
            }

            .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                * {
                    margin: 0;
                    padding: 0;
                }
            }
        }
    }

    @keyframes rot {
        from {
            transform: rotate(0deg) scale(1.5);
        }
        to {
            transform: rotate(360deg) scale(1.5);
        }
    }
</style>