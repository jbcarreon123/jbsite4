import Members from '../../../../public/webrings/responeko/members.json' with {type: 'json'};
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
    let m = {
        name: 'Responeko Ring',
        description: 'A webring for Nekoweb sites that is responsive by design',
        url: 'https://wf.jbc.lol/webrings/responeko/',
        members: Members.map((m) => ({
            username: m.host,
            url: `//${m.host}`
        }))
    };
    return new Response(JSON.stringify(m), {
        headers: {'Content-Type': 'application/json'}
    });
}