import type { APIContext } from "astro";
import { generateFeed } from "../lib/feed.ts";
import { LinkObjs } from "../lib/links.ts";


export async function GET(context: APIContext) {
    const posts = Object.values(import.meta.glob('./posts/**/*.md', { eager: true }));
    const tutorials = Object.values(import.meta.glob('./tutorials/**/*.md', { eager: true }));
    let slugs: { path: string, slug: string, val: any }[] = []
    slugs = posts.concat(tutorials).map((val: any) => {
        let path = (val.url as string).replace(/\/$/, '').split('/');
        let slug = path[path.length - 1].split('-').map(x => x[0]).join('');
        return { path: path[path.length - 1], slug, val }
    })

    const links = LinkObjs.map(x => x.links.filter(x => x.mainSite).map(x => x.path)).filter(x => x.length > 0).flat(1)

    console.log(links)

    return new Response(
        slugs.map(x => 
            `/blogs/${x.path}    /posts/${x.path}/    301\n/blogs/${x.path}/    /posts/${x.path}/    301\n/${x.slug}    /posts/${x.path}/    301\n/${x.slug}/    /posts/${x.path}/    301`
        ).join('\n') + '\n' +
        links.map(x => `${x.replace(/\/$/, '')}    https://jbc.lol${x}    301\n${x}    https://jbc.lol${x}    301`).join('\n')

    )
}