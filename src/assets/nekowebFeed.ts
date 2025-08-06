import type { APIContext } from 'astro';
import { Feed, type Item } from 'feed';
import sanitize from 'sanitize-html';
import { minify } from 'html-minifier-terser';

export async function generateFeed(context: APIContext, type: 'json' | 'rss' | 'atom'): Promise<string> {
    let posts = Object.values(import.meta.glob('../pages/posts/**/*.md', { eager: true }));
    let tutorials = Object.values(import.meta.glob('../pages/tutorials/**/*.md', { eager: true }));

    let merge = [
        ...posts,
        ...tutorials
    ]

    const feed = new Feed({
        title: "jb's posts",
        description: "a platform where jb yaps on",
        link: context.site?.toString(),
        id: context.site?.toString() || 'https://jbc.lol',
        copyright: 'Source code: 2025 jbcarreon123. All rights reserved. Content: Creative Commons Attribution-ShareAlike 4.0',
        generator: 'jbsite4',
        author: {
            name: 'JB Carreon',
            link: context.site?.toString()
        },
        feedLinks: {
            json: new URL('feed.json', context.site).toString(),
            atom: new URL('feed.atom', context.site).toString(),
            rss: new URL('feed.xml', context.site).toString(),
        },
    })

    const sortedPosts = merge.sort((a, b) => {
        const dateA = new Date(a.frontmatter.published ?? '01/01/1980');
        const dateB = new Date(b.frontmatter.published ?? '01/01/1980');
        return dateA.getTime() - dateB.getTime();
    }).reverse();

    feed.items = await Promise.all<Item>(sortedPosts.map(async (post: any) => {
        let cnt = await minify(sanitize(await post.compiledContent(), {
            allowedTags: sanitize.defaults.allowedTags.concat(['img', 'code', 'a', 'p', 'figure', 'figcaption']),
            disallowedTagsMode: 'discard'
        }).replace(/="(\/[a-zA-Z0-9\/_ \+\.]+)"/gm, '="https://jbc.lol$1"').replaceAll(' <span>open_in_new</span>', '').replaceAll('<span><span></span></span>', ''), {
            removeAttributeQuotes: true,
            removeEmptyElements: true,
            minifyCSS: false,
            removeRedundantAttributes: true,
        });

        return ({
            id: new URL(post.url, context.site).toString(),
            title: post.frontmatter.title,
            description: 
                (post.frontmatter.category ? 'Tutorial on ' + post.frontmatter.category + ': ' : '') +
                post.frontmatter.description,
            link: new URL(post.url, context.site).toString(),
            date: new Date(post.frontmatter.published),
            content: cnt,
            image: `${context.site}post-og/${post.url.replace('/posts/', '').replace('/', '')}.png`,
            author: [{
                name: 'JB Carreon',
                link: context.site?.toString()
            }]
        })
    }));

    switch (type) {
        case 'atom':
            return feed.atom1();
        case 'json':
            return feed.json1();
        default:
            return feed.rss2();
    }
}