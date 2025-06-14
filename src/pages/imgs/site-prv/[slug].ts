import { chromium } from 'playwright';
import type { APIRoute } from "astro";
import Buttons from '../../../../public/buttons.json' with {type: 'json'};

export function getStaticPaths() {
    return Buttons.map((val) => {
        let link = new URL(val.url);
        return { params: { slug: link.hostname + '.png' } }
    })
}

export const GET: APIRoute = async ({ params }) => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto('https://' + params.slug?.replace('.png', ''));
        await page.waitForLoadState('domcontentloaded');
        const imageBuf = await page.screenshot({
            type: 'png',
        })

        await context.close()

        return new Response(imageBuf);
    } catch (e) {
        throw Error(e);
    }

    return new Response('test');
}