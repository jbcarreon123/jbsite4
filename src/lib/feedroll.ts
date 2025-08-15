import { Feed } from "feed";
import Parser from "rss-parser";

const feedrolls = [
    "https://layercake.moe/misc/feed.xml",
    "https://reduxflakes.nekoweb.org/blog/feed.xml",
    "https://dimden.dev/rss.xml",
    "https://blog.yoyle.city/feed/",
    "https://duducat.moe/blarbs/feed.xml",
    "https://medjed.nekoweb.org/rss.xml",
    "https://dreamscape.place/rss.xml",
    "https://nyscyra.nekoweb.org/rss.xml",
    "https://jbc.lol/feed.xml",
    "https://blog.adamngshrine.com/rss.xml",
    "https://blog.xavierhm.com/feed/",
    "https://32enoki.net/rss.xml",
    "https://sandwich.nekoweb.org/updates.xml"
];

export async function loadFeeds() {
    try {
        const parser = new Parser();
        const feedrollDatas = (await Promise.all(
            feedrolls.map(async (f) => {
                const res = await fetch(f);
                const data = await res.text();

                try {
                    const rss = await parser.parseString(data);

                    return rss;
                } catch {
                    console.log(data);
                    return null;
                }
            }),
        )).filter(a => a !== null);
        const mappedData = feedrollDatas.map((v) => {
            return v.items.map((i) => ({
                siteTitle: v.title,
                siteLink: v.link,
                ...i,
            }));
        });
        const mergedData = mappedData.flatMap((v) => [...v]);

        return mergedData.sort((a, b) => {
            const dateA = new Date(a.isoDate);
            const dateB = new Date(b.isoDate);
            return dateA.getTime() - dateB.getTime();
        }).reverse();
    } catch {
        return []
    }
}

export async function generatefeedroll(context: APIContext, type: 'json' | 'rss' | 'atom'): Promise<string> {
    const posts = Object.values(import.meta.glob('../pages/posts/**/*.md', { eager: true }));

    const feedroll = new Feed({
        title: "jb's curated feedroll",
        description: "curated feed posts from the finest sources",
        link: new URL('feedroll', context.site).toString(),
        id: context.site?.toString() || 'https://jbc.lol',
        copyright: 'idk',
        generator: 'jbsite4',
        feedLinks: {
            json: new URL('feedroll.json', context.site).toString(),
            atom: new URL('feedroll.atom', context.site).toString(),
            rss: new URL('feedroll.xml', context.site).toString(),
        },
    })

    const items = await loadFeeds();

    feedroll.items = items.map(i => {
        const { siteTitle, siteLink, ...rest } = i;

        return {
            ...rest,
            link: `${rest.link}`,
            title: `[${siteTitle}] ${rest.title}`,
            date: new Date(rest.isoDate ?? 0),
            author: [{
                name: siteTitle,
                link: siteLink
            }],
            description: rest.summary ?? rest.contentSnippet,
            content: (rest['content:encoded'] as string)
        }
    })

    switch (type) {
        case 'atom':
            return feedroll.atom1();
        case 'json':
            return feedroll.json1();
        default:
            return feedroll.rss2();
    }
}