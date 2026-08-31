import { experimental_AstroContainer } from "astro/container";
import { getContainerRenderer as svelteContainerRenderer } from "@astrojs/svelte";
import { loadRenderers } from "astro:container";
import sanitize from "sanitize-html";
import * as cheerio from 'cheerio';
// @ts-ignore
import strip from 'strip';

const renderers = await loadRenderers([svelteContainerRenderer()]);
const container = await experimental_AstroContainer.create({
    renderers
})

type ModuleEntry = { default: any; url: string; frontmatter?: any };

const posts = Object.values(import.meta.glob('../pages/posts/**/*.md', { eager: true })) as ModuleEntry[];
const tutorials = Object.values(import.meta.glob('../pages/tutorials/**/*.md', { eager: true })) as ModuleEntry[];
const pages = Object.values(import.meta.glob('../pages/**/*.astro', { eager: true })) as ModuleEntry[];
const pagesRendered = await Promise.all(pages.map(async (p) => {
    try {
        return { html: await container.renderToString(p.default), url: p.url }
    } catch { return undefined }
}));
const postsRendered = await Promise.all(posts.map(async (p) => {
    try {
        return { html: await container.renderToString(p.default, { props: { frontmatter: p.frontmatter } }), url: p.url }
    } catch { return undefined }
}));
const tutorialsRendered = await Promise.all(tutorials.map(async (p) => {
    try {
        return { html: await container.renderToString(p.default, { props: { frontmatter: p.frontmatter } }), url: p.url }
    } catch { return undefined }
}));

const allPages = [
    ...pagesRendered,
    ...postsRendered,
    ...tutorialsRendered
].map(x => {
    const p = cheerio.load(x?.html ?? '');
    const text = strip(sanitize(p('#content').html() ?? ''));
    return {
        ...x,
        html: text
    }
}).filter(x => x && x?.html && x?.url)

export function getSearchData() {
    return allPages
}