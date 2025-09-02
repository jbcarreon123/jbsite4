import { chromium, type Browser, type BrowserContext } from 'playwright';
import type { APIRoute } from "astro";
import Buttons from '../../../../public/buttons.json' with {type: 'json'};
import sharp from 'sharp';
import { satoriAstroOG } from 'satori-astro';
import { html } from "satori-html";
import { readFileSync } from 'fs';

let recentSites: string[] = [];
let browser: Browser;

type SbrButtonEntry = {
    url: string,
    title: string,
    alt: string,
    imgUrl: string,
    startPath?: string,
    clickElm?: string,
    eighteen?: boolean
}

try {
    //browser = await chromium.launch();
} catch (e) {
    console.error(e);
}

export function getStaticPaths() {
    return Buttons.map((val) => {
        let link = new URL(val.url);
        return { params: { slug: link.hostname + '.webp' } }
    })
}

const placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzM1M2I0MSIvPjxwYXRoIGZpbGw9IiMyMjI2MmEiIGQ9Ik0wIDBoMTB2MTBIMHpNMTAgMTBoMTB2MTBIMTB6Ii8+PC9zdmc+";

export const GET: APIRoute = async ({ params }) => {
    throw new Error("SBR is currently disabled while I'm looking on a solution of why its crashing")

    const button = Buttons.find(x=>x.url.includes(params.slug?.replace('.webp', '') ?? '')) as SbrButtonEntry;
    recentSites.push(`${button?.url} (${button?.imgUrl})`)
    let context: BrowserContext;
    try {
        if (process.env.GITHUB_ACTIONS !== 'true') throw new Error('In development mode; not rendering SBR previews');

        context = await browser.newContext({
            colorScheme: 'dark',
            viewport: {
                width: 1600,
                height: 900
            }
        });
        context.setDefaultTimeout(60000);
        const page = await context.newPage();
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 jbSite4-SBR/2.0.0 (jb+sbr@jbc.lol)',
            'Accept-Language': 'en-US,en;q=0.9'
        })

        await page.goto(button?.url.replace(/\/$/, '') + (button?.startPath ?? ''),  {
            waitUntil: 'commit'
        });

        try {
            await page.waitForLoadState('domcontentloaded', {
                timeout: 60000
            })
            await page.waitForLoadState('networkidle', {
                timeout: 15000
            });
            if (button?.clickElm) {
                page.click(button.clickElm);
                await page.waitForSelector(button?.clickElm ?? '', { state: 'hidden', timeout: 5000 })
            } else {
                await page.waitForTimeout(2000)
            }
        } catch {
            console.log('Timeout exceeded, screenshoting while page isn\'t fully loaded yet...')
        }
        const imageBuf = await page.screenshot({
            type: 'png',
        })
        const webpBuf = await sharp(imageBuf)
            .resize(1280, 720)
            .toFormat('webp')
            .toBuffer();

        await page.close();
        await context.close();

        return new Response(webpBuf);
    } catch (e) {
        //@ts-ignore
        if (context) await context.close();
        console.error(`Failed to render ${button?.url},`, e)
        const regex = /"(\w+)":/gm;
        const subst = `$1:`;
        const str = JSON.stringify(button, null, 4);
        const result = str.replace(regex, subst);
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
                            <p>Stack trace:${'\n'}    ${e.stack.replace('Error: ', '').replace(`${`${e}`.replace('Error: ', '')}`, '').trim()}</p>
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
                `,
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

        return new Response(await sharp(await bg.arrayBuffer()).resize(1280, 720).toFormat('webp').toBuffer());
    }
}