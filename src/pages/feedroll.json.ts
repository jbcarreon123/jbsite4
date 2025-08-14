import type { APIContext } from "astro";
import { generateFeed } from "../lib/feed.ts";
import { generatefeedroll } from "../lib/feedroll.ts";


export async function GET(context: APIContext) {
    return new Response(
        (await generatefeedroll(context, 'json')).replace('\n    "home_page_url', `\n    "feed_url": "${new URL('feed.json', context.site)}",\n    "home_page_url`).replace('org/version/1', 'org/version/1.1'),
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
    )
}