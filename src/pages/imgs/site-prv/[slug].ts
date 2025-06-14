import { chromium } from 'playwright';
import type { APIRoute } from "astro";
import Buttons from '../../../../public/buttons.json' with {type: 'json'};

const browser = await chromium.launch();

export function getStaticPaths() {
    return Buttons.map((val) => {
        let link = new URL(val.url);
        return { params: { slug: link.hostname + '.png' } }
    })
}

export const GET: APIRoute = async ({ params }) => {
    if (process.env.GITHUB_ACTIONS !== 'true') return new Response('test');

    const context = await browser.newContext({
        colorScheme: 'dark'
    });
    context.setDefaultTimeout(60000);
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    })

    try {
        await page.goto('https://' + params.slug?.replace('.png', ''));
        try {
            await page.waitForLoadState('domcontentloaded', {
                timeout: 15000
            });
        } catch {
            console.log('Timeout exceeded, screenshoting while page isn\'t fully loaded yet...')
        }
        const imageBuf = await page.screenshot({
            type: 'png',
        })

        await context.close()

        return new Response(imageBuf);
    } catch (e) {
        console.log('screenshot failed. returning nothing instead...', e)
        return new Response(null);
    }
}