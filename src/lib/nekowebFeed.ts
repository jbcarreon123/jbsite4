import type { APIContext } from 'astro';
import { Feed, type Item } from 'feed';
import RSS from 'rss';
import sanitize from 'sanitize-html';
import { minify } from 'html-minifier-terser';
import { Changelogs } from './changelogs.ts';

export async function generateFeed(context: APIContext, type: 'json' | 'rss' | 'atom'): Promise<string> {
    let posts = Object.values(import.meta.glob('../pages/posts/**/*.md', { eager: true }));
    let tutorials = Object.values(import.meta.glob('../pages/tutorials/**/*.md', { eager: true }));

    let merge = [
        ...(posts as {}[]).map(m => ({...m, type: 'posts'})),
        ...(tutorials as {}[]).map(m => ({...m, type: 'tutorials'})),
        ...(Changelogs as {}[]).map(m => ({...m, type: 'updates'}))
    ]

    const feed = new RSS({
        title: "jb's posts",
        description: "a platform where jb yaps on",
        site_url: context.site?.toString() ?? 'https://jbc.lol',
        copyright: 'Creative Commons Attribution-ShareAlike 4.0',
        generator: 'jbsite4',
        feed_url: new URL('feed.xml', context.site).toString(),
        managingEditor: 'Jb Carreon',
        webMaster: 'Jb Carreon',
    })

    const sortedPosts = merge.sort((a, b) => {
        const dateA = new Date(a.frontmatter?.published ?? a.date ?? '01/01/1980');
        const dateB = new Date(b.frontmatter?.published ?? b.date ?? '01/01/1980');
        return dateA.getTime() - dateB.getTime();
    }).reverse();

    const items = await Promise.all<RSS.ItemOptions>(sortedPosts.map(async (post: any) => {
        let cnt = ''
        try {
            cnt = await minify(sanitize(await post.compiledContent(), {
                allowedTags: sanitize.defaults.allowedTags.concat(['img', 'code', 'a', 'p', 'figure', 'figcaption']),
                disallowedTagsMode: 'discard'
            }).replace(/="(\/[a-zA-Z0-9\/_ \+\.]+)"/gm, '="https://jbc.lol$1"').replaceAll(' <span>open_in_new</span>', '').replaceAll('<span><span></span></span>', ''), {
                removeAttributeQuotes: true,
                removeEmptyElements: true,
                minifyCSS: false,
                removeRedundantAttributes: true,
            });
        } catch {}

        return ({
            title: post.frontmatter?.title ?? post.title,
            description: 
                (post.frontmatter?.category ? 'Tutorial on ' + post.frontmatter.category + ': ' : '') +
                (post.frontmatter?.description ?? post.description),
            url: !!post.url ? new URL(post.url, context.site).toString() : 'https://jbc.lol/updates/#' + post.title.replace(/(?! )\W/gm, '').replaceAll(' ', '-').toLocaleLowerCase(),
            date: new Date(post.frontmatter?.published ?? post.date),
            custom_elements: [
                {style: `.post-box{--badge-text:'${post.type.toUpperCase()}';--post-link:'${!!post.url ? new URL(post.url, context.site).toString() : 'https://jbc.lol/updates/#' + post.title.replace(/(?! )\W/gm, '').replaceAll(' ', '-').toLocaleLowerCase()}';}`},
                (!!cnt ? {'content:encoded': cnt} : {})
            ]
        })
    }));

    items.forEach(item => {
        feed.item(item);
    });;

    switch (type) {
        default:
            return feed.xml();
    }
}