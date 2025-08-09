import { chromium, type Browser } from 'playwright';
import type { APIRoute } from "astro";
import Buttons from '../../../../public/buttons.json' with {type: 'json'};
import sharp from 'sharp';
import { satoriAstroOG } from 'satori-astro';
import { html } from "satori-html";
import { readFileSync } from 'fs';

let browser: Browser;

try {
    browser = await chromium.launch();
} catch (e) {
    console.error(e);
}

export function getStaticPaths() {
    return Buttons.map((val) => {
        let link = new URL(val.url);
        return { params: { slug: link.hostname + '.webp' } }
    })
}

export const GET: APIRoute = async ({ params }) => {
    const button = Buttons.find(x=>x.url.includes(params.slug?.replace('.webp', '') ?? ''));
    try {
        if (process.env.GITHUB_ACTIONS !== 'true') throw new Error('In development mode; not rendering SBR previews');

        const context = await browser.newContext({
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

        const response = await page.goto(button?.url.replace(/\/$/, '') + (button?.startPath ?? ''),  {
            waitUntil: 'domcontentloaded'
        });
        if (response?.status() ?? 0 >= 400) {
            throw new Error(`SBR Page Load failed with status code ${response.status()}`);
        }
        try {
            await page.waitForLoadState('networkidle', {
                timeout: 15000
            });
            if (button?.clickElm) {
                page.click(button.clickElm);
                await page.waitForSelector(button?.clickElm ?? '', { state: 'hidden' })
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
        let bg = await satoriAstroOG({
                template: html`
                    <div class="container">
                        <h1>${button?.url.replace(/\/$/, '') + (button?.startPath ?? '')} failed to load!</h1>
                        <p>${e}</p>
                    </div>
        
                    <style slot="head">
                        .container {
                            position: relative;
                            background-color: #1d1f20;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content:center;
                            align-items: center;
                            padding-top: 6px;
                            flex-direction: column;
                            font-size: 1.5em;
                            gap: 6px;
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
                            text-align:center;
                        }
                    </style>
                `,
                width: 1280,
                height: 720,
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

        return new Response(await sharp(await bg.arrayBuffer()).toBuffer('webp'));
    }
}