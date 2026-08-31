import type { APIContext } from "astro";
import { generateFeed } from "../lib/feed.ts";
import { generatefeedroll } from "../lib/feedroll.ts";

export const prerender = true;


export async function GET(context: APIContext) {
    return new Response(
        (await generatefeedroll(context, 'atom')).replace('<?xml version="1.0" encoding="utf-8"?>', '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/atom.xsl"?>'),
        {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            }
        }
    )
}