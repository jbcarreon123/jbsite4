import type { APIContext } from "astro";
import { generateFeed } from "../lib/nekowebFeed.ts";
import { getSearchData } from "../lib/search.ts";


export async function GET(context: APIContext) {
    return new Response(
        JSON.stringify(getSearchData()),
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
    )
}