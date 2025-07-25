import { readFileSync } from 'node:fs';
import Buttons from '../../../../public/buttons.json' with {type: 'json'};
import type { APIRoute } from "astro";
import sharp from 'sharp';

let buttons: {slug: string, url: string, format?: string}[] = [];
const placeholder = sharp(readFileSync('./public/imgs/buttons/placeholder.png'));

export function getStaticPaths() {
    buttons = Buttons
        .filter((btn) => !btn.imgUrl.startsWith('/imgs'))
        .map((btn) => {
            let url = new URL(btn.imgUrl)
            let spl = url.pathname.split('/')
            let ext = spl[spl.length - 1]
            let nme = url.hostname.replace('www', '').split('.')[0]
            let fex = ext.split('.')

            return { slug: `${nme}-${ext}`, url: btn.imgUrl, format: fex[fex.length - 1] }
        });

    let btns = buttons.map((btn) => ({
        params: { slug: btn.slug }
    }))

    return btns
}

export const GET: APIRoute = async ({ params }) => {
    try {
        let btn = buttons.find((bt) => bt.slug === params.slug)
        if (btn) {
            let res = await fetch(btn.url)
            if (!res.ok || res.headers.get('Content-Type')?.includes('text/html')) {
                return new Response(await placeholder.toFormat(btn.format ?? 'png').toBuffer())
            }
            return new Response(await res.arrayBuffer())
        } else {
            return new Response('button not found', {
                status: 404,
                statusText: 'button not found'
            })
        }
    } catch (e) {
        return new Response(`button fetch failed: ${e}`, {
            status: 500,
            statusText: 'button fetch failed'
        })
    }
}