import { readFileSync } from 'node:fs';
import { results } from '../../../lib/webringtest-results.ts';
import type { APIRoute } from "astro";
import sharp from 'sharp';

export const prerender = true;

let res: { slug: string, url: string, format?: string, domain: string }[] = [];

export function getStaticPaths() {
    res = results
        .filter((r) => !r.favicon || !r.favicon?.startsWith('/imgs'))
        .map((r) => {
            let dom = new URL(r.url);
            let url = new URL(r.favicon);
            let spl = url.pathname.split('/')
            let ext = spl[spl.length - 1]
            let fex = ext.split('.')

            return { domain: dom.hostname, slug: `${dom.hostname}.${fex[fex.length - 1]}`, url: r.favicon, format: fex[fex.length - 1] }
        });

    let rs = res.map((r) => ({
        params: { slug: r.slug }
    }))

    return rs
}

export const GET: APIRoute = async ({ params }) => {
    let r = res.find((bt) => bt.slug === params.slug)
    try {
        if (r) {
            let res = await fetch(r.url)
            if (res.ok && !res.headers.get('Content-Type')?.includes('text/html')) {
                return new Response(await res.arrayBuffer())
            }

            return new Response('favicon not found', {
                status: 404,
                statusText: 'favicon not found'
            })
        } else {
            return new Response('favicon not found', {
                status: 404,
                statusText: 'favicon not found'
            })
        }
    } catch (e) {
        console.error(e);
        return new Response('favicon fetch failed', {
            status: 500,
            statusText: 'favicon fetch failed'
        })
    }
}