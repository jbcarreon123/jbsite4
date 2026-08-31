import { readFileSync } from 'node:fs';
import Buttons from '../../../../public/buttons.json' with {type: 'json'};
import type { APIRoute } from "astro";
import sharp from 'sharp';

export const prerender = true;

let buttons: { slug: string, url: string, format?: string, placeholder: boolean, domain: string, title: string }[] = [];
const placeholderSvg = readFileSync('./public/imgs/buttons/placeholder.svg', 'utf-8');

export function getStaticPaths() {
    buttons = Buttons
        .filter((btn) => !btn.imgUrl || !btn.imgUrl?.startsWith('/imgs'))
        .map((btn) => {
            let dom = new URL(btn.url);
            let url = btn.imgUrl ? new URL(btn.imgUrl) : null;
            let spl = url ? url.pathname.split('/') : ['placeholder_button.svg'];
            let ext = spl[spl.length - 1]
            let fex = ext.split('.')

            return { domain: dom.hostname, title: btn.alt, slug: `${dom.hostname}.${fex[fex.length - 1]}`, url: btn.imgUrl, format: fex[fex.length - 1], placeholder: spl[0] === 'placeholder_button.svg' }
        });

    let btns = buttons.map((btn) => ({
        params: { slug: btn.slug }
    }))

    return btns
}

export const GET: APIRoute = async ({ params }) => {
    let btn = buttons.find((bt) => bt.slug === params.slug)
    try {
        if (btn) {
            if (!btn.placeholder) {
                let res = await fetch(btn.url)
                if (res.ok && !res.headers.get('Content-Type')?.includes('text/html')) {
                    return new Response(await res.arrayBuffer())
                }
            }

            let title = btn.title.match(/.{1,10}/g)?.map((t, i) => `<tspan x="2.6646481" y="${((i + 1) * 13)}">${t}</tspan>`).join('') ?? '';
            if (btn.format !== 'svg') {
                return new Response(await sharp(Buffer.from(placeholderSvg.replaceAll('BTN_NAME', title))).toBuffer(btn.format as unknown as { resolveWithObject: false }) as unknown as BodyInit)
            }
            return new Response(
                Buffer.from(placeholderSvg.replaceAll('BTN_NAME', title)) as unknown as BodyInit,
                {
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'User-Agent': 'jbSite4-SBR/2.0.0 (jb+sbr@jbc.lol)'
                    }
                }
            )
        } else {
            return new Response('button not found', {
                status: 404,
                statusText: 'button not found'
            })
        }
    } catch (e) {
        if (btn) {
            let title = btn.title.match(/.{1,9}/g)?.map((t, i) => `<tspan x="2.6646481" y="${((i + 1) * 13)}">${t}</tspan>`).join('') ?? '';
            if (btn.format !== 'svg') {
                return new Response(await sharp(Buffer.from(placeholderSvg.replaceAll('BTN_NAME', title))).toBuffer(btn.format as unknown as { resolveWithObject: false }) as unknown as BodyInit)
            }
            return new Response(
                Buffer.from(placeholderSvg.replaceAll('BTN_NAME', title)) as unknown as BodyInit,
                {
                    headers: {
                        'Content-Type': 'image/svg+xml'
                    }
                }
            )
        } else {
            return new Response('button fetch failed', {
                status: 500,
                statusText: 'button fetch failed'
            })
        }
    }
}