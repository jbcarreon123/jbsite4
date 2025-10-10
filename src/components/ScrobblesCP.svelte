<script>
    import { onMount } from "svelte";

    const USERNAME = "jbcarreon123";
    const API_KEY = "202d561e5fdd095326f43d95d47dd233";

    let jsonFirst = $state(null);
    let json = $state(null);

    let artists = $state(null);
    let albums = $state(null);
    let tracks = $state(null);

    async function fetchNp(method) {
        const BASE_URL = `https://ws.audioscrobbler.com/2.0/?method=${method}&user=${USERNAME}&api_key=${API_KEY}&format=json`;
        let r = await fetch(BASE_URL);
        let j = await r.json();
        return j;
    }

    onMount(async () => {
        json = await fetchNp("user.getrecenttracks&limit=10");
        jsonFirst = json.recenttracks.track[0];
        albums = await fetchNp("user.gettopalbums&limit=5&period=1month");
        artists = await fetchNp("user.gettopartists&limit=5&period=1month");
        tracks = await fetchNp("user.gettoptracks&limit=10&period=1month");
        console.debug(json, albums, artists, tracks);
        setInterval(async () => {
            json = await fetchNp();
            jsonFirst = json[0];
        }, 60000);
    });
</script>

<div class="pc">
    <div id="np">
        {#if !json}
            <h1>Loading...</h1>
        {:else}
            <div class="bg">
                <img src={jsonFirst.image[3]["#text"]} alt="" />
            </div>
            <div class="st">
                <div>
                    <img src={jsonFirst.image[3]["#text"]} alt="" />
                </div>
                <div class="info">
                    <p class="tg">
                        {jsonFirst["@attr"] &&
                        jsonFirst["@attr"].nowplaying == "true"
                            ? "Now playing"
                            : "Last played"}
                    </p>
                    <div>
                        <h2>{jsonFirst.name}</h2>
                        <p>{jsonFirst.artist["#text"]}</p>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <div class="sbscn">
        <div class="sbsc">
            <h2>Last plays</h2>
            <div class="sbs2 pt">
                {#if json}
                    {#each json.recenttracks.track.filter(f => !f['@attr']) as track}
                        <div class="ti">
                            <img src={track.image[3]['#text']} alt="" />
                            <div class="info">
                                <h3>{track.name}</h3>
                                <p>{track.artist['#text']}{!!track.album['#text'] && track.name != track.album['#text'] ? ' - ' + track.album['#text'] : ''}</p>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p>Loading stats, please wait!</p>
                {/if}
            </div>
        </div>
        <div class="sbsc">
            <h2>Monthly Top Tracks</h2>
            <div class="sbs2 pt">
                {#if tracks}
                    {#each tracks.toptracks.track as track}
                        <div class="t0">
                            <div class="info">
                                <h3>{track.name}</h3>
                                <p>{track.artist.name} - {track.playcount} scrobbles</p>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p>Loading stats, please wait!</p>
                {/if}
            </div>
        </div>
        <div class="sbs2">
            <div class="sbsc">
                <h2>Monthly Top Albums</h2>
                <div class="sbs1">
                {#if albums}
                    {#each albums.topalbums.album as album}
                        <div class="ti">
                            <img src={album.image[3]['#text']} alt="" />
                            <div class="info">
                                <h3>{album.name}</h3>
                                <p>{album.artist.name} - {album.playcount} scrobbles</p>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <p>Loading stats, please wait!</p>
                {/if}
                </div>
            </div>
            <div class="sbsc">
                <h2>Monthly Top Artists</h2>
                <div class="sbs1">
                    {#if artists}
                        {#each artists.topartists.artist as artist}
                            <div class="t0">
                                <div class="info">
                                    <h3>{artist.name}</h3>
                                    <p>{artist.playcount} scrobbles</p>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <p>Loading stats, please wait!</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style scoped>
    .pc {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .ti {
        display: grid;
    }

    .ti, .t0 {
        gap: 8px;
        grid-template-columns: 75px 1fr;
        height: 100px;
        padding: 6px;
        background-color: var(--altbg);

        .info {
            height: 100%;
            display: flex;
            justify-content: end;
            flex-direction: column;
            white-space: nowrap;
            max-width: 100%;
            overflow: hidden;
            
            &>* {
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        img {
            width: 100%;
            margin-top: auto;
        }

        * {
            padding-top: 0;
        }
    }

    .sbscn {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .sbs1 {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .sbs2 {
        display: grid;
        gap: 6px;
        grid-template-columns: repeat(2, minmax(100px, 1fr));

        &.pt {
            margin-top: 6px;
        }
    }

    .sbsc {
        padding: 6px;
        background-color: var(--acc);
    }

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

    @media screen and (width <= 640px) {
        .sbs2 {
            grid-template-columns: repeat(1, minmax(100px, 1fr));
        }
    }
</style>
