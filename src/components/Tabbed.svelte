<script lang="ts">
    type Tab = {
        tabId: string;
        url: string;
        title: string;
        frameSet: HTMLIFrameElement | undefined;
    };

    function genId() {
        return btoa(Date.now().toString(36) + Math.random().toString(36).substr(2));
    }

    let tabs: Tab[] = [
        {
            title: 'New Tab',
            url: 'jbrowser:newtab',
            frameSet: undefined,
            tabId: genId(),
        }
    ];

    let selectedTab: Tab | undefined = $state(tabs[0]);
</script>

{#snippet newTab()}
    <div class="nt">
        <h1>jBrowser (v1)</h1>
        <p>Put a URL on the bar above !</p>
    </div>

    <style>
        .nt {
            max-width: 80%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>
{/snippet}

<div class="tabbed-container">
    <div class="chrome">
        <div class="tabs">
            {#key tabs}
                {#if tabs.length > 0}
                    {#each tabs as tab}
                        <button class="tab" data-tabId={tab.tabId}>{tab.title}</button>
                    {/each}
                {/if}
            {/key}
            <button aria-label="New Tab">
                <span class="ms" data-icon="add"></span>
            </button>
        </div>
        <div class="navbar">
            <button aria-label="Back">
                <span class="ms" data-icon="chevron_left"></span>
            </button>
            <button aria-label="Refresh">
                <span class="ms" data-icon="refresh"></span>
            </button>
            <button aria-label="Forward">
                <span class="ms" data-icon="chevron_right"></span>
            </button>
            <form target="nothing">
                <input type="text" value="jbrowser:newtab" />
            </form>
        </div>
    </div>
    <div class="frame">
        {#if selectedTab.url.startsWith('jbrowser')}
            {#if selectedTab.url.endsWith('newtab')}
                {@render newTab()}  
            {/if}
        {/if}
    </div>
</div>

<style>
    .tabbed-container {
        position: fixed;
        inset: 0;
        width: 100dvw;
        min-height: 100dvh;
        max-height: 100dvh;
        display: flex;
        flex-direction: column;
    }

    .chrome {
        background-color: var(--bg);

        .tabs {
            display: flex;
            gap: 6px;
            padding: 6px;

            .tab {
                background-color: var(--acc);
                padding: 6px;
            }
        }

        .navbar {
            padding: 6px;
            padding-top: 0;
            display: flex;
            gap: 6px;

            form {
                width: 100%;
            }

            input {
                width: 100%;

                &:hover,
                &:active {
                    background-color: var(--altbg);
                }
            }
        }
    }

    .frame {
        display: flex;
        flex-basis: 0;
        flex-grow: 1;
    }
</style>
