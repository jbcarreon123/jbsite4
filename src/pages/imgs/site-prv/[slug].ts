import { chromium, type Browser, type BrowserContext } from 'playwright';
import type { APIRoute } from "astro";
import Buttons from '../../../../public/buttons.json' with {type: 'json'};
import sharp from 'sharp';
import { satoriAstroOG } from 'satori-astro';
import { html } from "satori-html";
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

type SbrButtonEntry = {
    url: string,
    title: string,
    alt: string,
    imgUrl: string,
    startPath?: string,
    clickElm?: string,
    eighteen?: boolean,
    disableJS?: boolean
}

// --- caching ---------------------------------------------------------------
// Each rendered preview is cached on disk for CACHE_TTL_MS, then re-rendered
// on the next request. Set SBR_TTL_HOURS to change the 12h default, and
// SBR_CONCURRENCY to change the max parallel renders (default 5).
const CACHE_TTL_MS = (Number(process.env.SBR_TTL_HOURS) || 12) * 60 * 60 * 1000;
const MAX_CONCURRENT = Number(process.env.SBR_CONCURRENCY) || 5;
const CACHE_DIR = join(process.cwd(), '.cache', 'site-prv');

function cachePath(slug: string) {
    return join(CACHE_DIR, slug.replace(/[^a-zA-Z0-9.-]/g, '_') + '.avif');
}

function readCache(slug: string): Buffer | null {
    try {
        const stat = statSync(cachePath(slug));
        if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) return null;
        return readFileSync(cachePath(slug));
    } catch {
        return null;
    }
}

function writeCache(slug: string, buf: Buffer) {
    try {
        mkdirSync(CACHE_DIR, { recursive: true });
        writeFileSync(cachePath(slug), buf);
    } catch (e) {
        console.warn(`[site-prv] failed to write cache for ${slug}`, e);
    }
}

// --- browser (lazy, shared, self-healing) -----------------------------------
let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
    if (!browserPromise) {
        browserPromise = chromium.launch();
        browserPromise.catch(() => { browserPromise = null; });
    }
    let browser = await browserPromise;
    if (!browser.isConnected()) {
        browserPromise = null;
        browser = await getBrowser();
    }
    return browser;
}

process.on("unhandledRejection", () => {
    console.log("[site-prv] unhandled rejection detected, SBR browser will be relaunched on next render");
    browserPromise = null;
});

// --- concurrency limit -------------------------------------------------------
let activeRenders = 0;
const renderQueue: (() => void)[] = [];

async function withRenderLimit<T>(fn: () => Promise<T>): Promise<T> {
    if (activeRenders >= MAX_CONCURRENT) {
        await new Promise<void>(res => renderQueue.push(res));
    }
    activeRenders++;
    try {
        return await fn();
    } finally {
        activeRenders--;
        renderQueue.shift()?.();
    }
}

// --- rendering ----------------------------------------------------------------
let recentSites: string[] = [];

async function renderPreview(button: SbrButtonEntry): Promise<Buffer> {
    recentSites.push(`${button.url} (${button.imgUrl})`);
    if (recentSites.length > 50) recentSites = recentSites.slice(-50);
    const browser = await getBrowser();
    let context: BrowserContext;
    context = await browser.newContext({
        colorScheme: 'dark',
        viewport: {
            width: 1600,
            height: 900
        },
        javaScriptEnabled: !button.disableJS
    });
    try {
        context.setDefaultTimeout(60000);
        const page = await context.newPage();
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0 Safari/537.36 jbSite4-SBR/2.0.0 (jb+sbr@jbc.lol)',
            'Accept-Language': 'en-US,en;q=0.9'
        })

        await page.goto(button.url.replace(/\/$/, '') + (button.startPath ?? ''), {
            waitUntil: 'commit'
        });

        try {
            await page.waitForLoadState('domcontentloaded', {
                timeout: 60000
            })
            await page.waitForLoadState('networkidle', {
                timeout: 15000
            });
            if (button.clickElm) {
                page.click(button.clickElm);
                await page.waitForSelector(button.clickElm, { state: 'hidden', timeout: 5000 })
            } else {
                await page.waitForTimeout(2000)
            }
        } catch {
            console.log('Timeout exceeded, screenshoting while page isn\'t fully loaded yet...')
        }
        const imageBuf = await page.screenshot({
            type: 'png',
        })
        const avifBuf = await sharp(imageBuf)
            .resize(1280, 720)
            .toFormat('avif')
            .toBuffer();

        await page.close();
        return avifBuf;
    } finally {
        await context.close().catch(() => {});
    }
}

const inFlight = new Map<string, Promise<Buffer | null>>();

function renderOrCache(slug: string, button: SbrButtonEntry): Promise<Buffer | null> {
    let job = inFlight.get(slug);
    if (!job) {
        job = withRenderLimit(async () => {
            const fresh = readCache(slug);
            if (fresh) return fresh;
            try {
                const buf = await renderPreview(button);
                writeCache(slug, buf);
                return buf;
            } catch (e) {
                throw e;
            }
        }).finally(() => inFlight.delete(slug));
        inFlight.set(slug, job);
    }
    return job;
}

// --- failure page ----------------------------------------------------------------
const placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzM1M2I0MSIvPjxwYXRoIGZpbGw9IiMyMjI2MmEiIGQ9Ik0wIDBoMTB2MTBIMHpNMTAgMTBoMTB2MTBIMTB6Ii8+PC9zdmc+";

async function renderErrorPage(button: SbrButtonEntry, e: unknown): Promise<Response> {
    console.error(`Failed to render ${button?.url},`, e)
    const regex = /"(\w+)":/gm;
    const subst = `$1:`;
    const str = JSON.stringify(button, null, 4);
    const result = str.replace(regex, subst);
    const stack = e instanceof Error ? (e.stack ?? '') : String(e);
    let browser: Browser | undefined;
    try {
        browser = await getBrowser();
    } catch {
        browser = undefined;
    }
    let bg = await satoriAstroOG({
            template: html`
                <div class="container">
       		        <div class="placeholder"></div>
                    <div class="log">
                        <h3>Failed to load URL</h3>
                        <h1>${button?.url.replace(/\/$/, '') + (button?.startPath ?? '')}</h1>
                        <p>${e}</p>
                    </div>

                    <div class="log">
                        <h2>Debug output (poke jb plz)</h2>
                        <p>Recent rendered sites:${'\n'}    ${recentSites.slice(Math.max(recentSites.length - 5, 0)).join('\n    ')}</p>
                        <p>Stack trace:${'\n'}    ${stack.replace('Error: ', '').replace(`${`${e}`.replace('Error: ', '')}`, '').trim()}</p>
                        <p>Button entry: [object SbrButtonEntry] ${result}</p>
                        <p>Chromium version: ${browser?.version() ?? 'undefined'}</p>
                    </div>
                </div>

                <style slot="head">
                    div {
                        display: flex;
                    }

                    .log {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        max-width: 100vw;
                        gap: 6px;
                        padding-inline: 6px;
                    }

                    .log * {
                        margin: 0;
                        padding: 0;
                        white-space: pre;
                    }

                    .log p {
                        overflow-wrap: anywhere;
                        text-align: left;
                    }

                    .container {
                        position: relative;
                        background-color: #1d1f20;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content:center;
                        align-items: flex-start;
                        padding-top: 6px;
                        flex-direction: column;
                        font-size: 1.5em;
                        padding: 36px;
                        gap: 24px;
                    }

                    .placeholder {
                        position: absolute;
                        inset: 0;
                        background-image: url(${placeholder});
                        width: 100vw;
                        height: 100vh;
                        background-size: 150px 150px;
                        opacity: 0.5;
                    }

                    h1 {
                        font-size: 2em;
                        line-height: 1em;
                    }

                    h1 span {
                        font-size: 0.5em;
                        font-weight: normal;
                    }

                    .container > * {
                        padding: 0;
                        margin: 0;
                        color: #f1f3f5;
                    }
                </style>
            ` as any,
            width: 1920,
            height: 1080,
        }).toResponse({
            satori: {
                fonts: [
                    {
                        name: "Inter",
                        data: readFileSync('./public/fonts/Inter-Regular.woff'),
                        weight: 400,
                        style: "normal",
                    },
                    {
                        name: "Inter",
                        data: readFileSync('./public/fonts/Inter-SemiBold.woff'),
                        weight: 700,
                        style: "normal",
                    },
                ],

            },
        });

    return new Response(await sharp(await bg.arrayBuffer()).resize(1280, 720).toFormat('avif').toBuffer() as unknown as BodyInit, { headers: { 'Content-Type': 'image/avif', 'x-sbr-error': '1' } });
}

// --- route --------------------------------------------------------------------
export const GET: APIRoute = async ({ params }) => {
    const slug = params.slug?.replace('.avif', '') ?? '';
    const button = Buttons.find(x => x.url.includes(slug)) as SbrButtonEntry;
    if (!button) {
        return new Response('preview not found', { status: 404, statusText: 'preview not found' });
    }

    const cached = readCache(slug);
    if (cached) {
        return new Response(cached as unknown as BodyInit, { headers: { 'Content-Type': 'image/avif', 'x-sbr-cache': 'hit' } });
    }

    try {
        const buf = await renderOrCache(slug, button);
        if (buf) {
            return new Response(buf as unknown as BodyInit, { headers: { 'Content-Type': 'image/avif', 'x-sbr-cache': 'miss' } });
        }
        return new Response('preview render failed', { status: 500, statusText: 'preview render failed', headers: { 'x-sbr-error': '1' } });
    } catch (e) {
        return renderErrorPage(button, e);
    }
}
