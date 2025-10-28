<script lang="ts">
    import { onMount } from "svelte";
    import Fuse, { type FuseResult } from "fuse.js";
    import lodash from "lodash";
    import { results } from "../lib/webringtest-results.ts";

    let searching = $state(false);

    let searchInput: HTMLInputElement | undefined = $state();
    let searchContainer: HTMLDivElement | undefined = $state();

    $effect(() => {
        if (searchContainer) {
            searchContainer.addEventListener('click', (ev) => {
                if (ev.target === ev.currentTarget) {
                    searching = false;
                }
            })
        }
    })

    let searchValue = $state("");
    let search: {url: string, html: string}[] = $state([]);

    let searchResults: {match: MatchTuple[], item: { url: string, html: string }}[] = $state([]);

    type MatchTuple = [start: number, end: number, matched: string];

    function findSubstring(
        text: string,
        substring: string,
        caseSensitive: boolean = false,
    ): MatchTuple[] {
        const results: MatchTuple[] = [];

        if (!text || !substring) {
            return results;
        }

        const searchText = caseSensitive ? text : text.toLowerCase();
        const searchSubstring = caseSensitive
            ? substring
            : substring.toLowerCase();

        let position = 0;
        while (
            (position = searchText.indexOf(searchSubstring, position)) !== -1
        ) {
            const start = position;
            const end = position + substring.length;
            const matched = text.substring(start, end);

            results.push([start, end, matched]);
            position += 1;
        }

        return results;
    }

    $effect(() => {
        if (searching && searchInput) {
            searchInput.focus();
            console.log(searchInput);
        }
    });

    $effect.pre(() => {
        if (searchValue) {
            searchResults = search.map(x => ({
                match: findSubstring(x.html, searchValue),
                item: x
            })).filter(x => x.match.length > 0).slice(0, 9);                
        } else {
            searchResults = [];
        }
    });

    let resultsDiv: HTMLDivElement | undefined = $state();

    onMount(async () => {
        document.addEventListener("keydown", (ev) => {
            if (ev.ctrlKey && ev.key === "k") {
                ev.preventDefault();
                searching = !searching;
            }
            if (ev.key === "Escape" && searching) {
                searching = false;
            }
            if (ev.key === "ArrowDown" && searching && resultsDiv) {
                let selected = resultsDiv.querySelector('[data-selected]') as HTMLAnchorElement;
                let allResults = resultsDiv.querySelectorAll('a');
                if (!selected) {
                    allResults[0].focus();
                    allResults[0].dataset.selected = 'true'
                } else if (selected) {
                    let sel = Object.values(allResults).indexOf(selected)
                    if (allResults.length - 1 === sel) return;
                    sel++;
                    allResults[sel].focus();
                    allResults[sel].dataset.selected = 'true';
                    selected.removeAttribute('data-selected');
                }
            }
            if (ev.key === "ArrowUp" && searching && resultsDiv) {
                let selected = resultsDiv.querySelector('[data-selected]') as HTMLAnchorElement;
                let allResults = resultsDiv.querySelectorAll('a');
                if (!selected) {
                    allResults[allResults.length - 1].focus();
                    allResults[allResults.length - 1].dataset.selected = 'true'
                } else if (selected) {
                    let sel = Object.values(allResults).indexOf(selected)
                    if (0 === sel) return;
                    sel--;
                    allResults[sel].focus();
                    allResults[sel].dataset.selected = 'true';
                    selected.removeAttribute('data-selected');
                }
            }
            console.log(ev.key)
        });

        let res = await fetch("/search.json");
        search = await res.json();
    });
</script>

{#if searching}
    <div class="searchContainer">
        <div class="searchInnerContainer">
            <div class="searchTopView">
                <input
                    type="text"
                    placeholder="Search here..."
                    bind:this={searchInput}
                    bind:value={searchValue}
                />
            </div>
            <div class="searchResults" bind:this={resultsDiv}>
                {#if searchResults}
                    {#each searchResults as result}
                        <a href={result.item.url}>
                            <h3>{result.item.url}</h3>
                            <p>
                                {@html (() => {
                                    let x = result.item.html;
                                    let res = result.match[0];
                                    let nr =
                                        x.slice(res[0], res[0]) +
                                        "<b>" +
                                        x.slice(res[0], res[1]) +
                                        "</b>" +
                                        x.slice(res[1], res[1] + 100);
                                    return nr;
                                })()}
                            </p>
                        </a>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    :global(body:has(.searchContainer)) {
        overflow: hidden;
    }

    .searchContainer {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        z-index: 1000;
        padding-top: 10vh;
        background-color: color-mix(in srgb, var(--altbg) 60%, transparent 40%);
    }

    .searchInnerContainer {
        width: 600px;
        max-width: 100vw;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .searchResults {
        display: flex;
        flex-direction: column;

        a {
            padding: 6px;
            background-color: var(--altbg);

            p {
                overflow: hidden;
                max-height: 24px;
                text-overflow: ellipsis;
            }
        }
    }

    input {
        width: 100%;
    }
</style>
