import type { MarkdownInstance } from "astro";
import ssgMembers from "../../public/webrings/ssgring/members.json" with { type: 'json' }
import rspMembers from "../../public/webrings/responeko/members.json" with { type: 'json' }
import yamMembers from "../../public/webrings/yamring/swr.json" with { type: 'json' }
import buttons from "../../public/buttons.json" with { type: 'json' }
import { Changelogs } from "./changelogs.ts";

export type LinkObj = {
    name?: string,
    reqJS?: boolean,
    links: {
        name: string,
        path: string,
        redirect: boolean,
        icon: string,
        id?: string,
        reqJS?: boolean,
        innerHTML?: string,
    }[]
}[]


export function getLinks(): LinkObj[] {
    interface Frontmatter {
        title: string;
        published: string;
        description: string;
        tags: string;
        background: string;
    }
    const posts = Object.values(
        import.meta.glob<MarkdownInstance<Frontmatter>>("../pages/posts/**/*.md", {
            eager: true,
        }),
    );

    const postData = posts.map(p => ({
        name: p.frontmatter.title,
        innerHTML: `<p>${p.frontmatter.description}</p>`,
        path: p.url ?? '/posts',
        icon: '',
        redirect: false
    }))

    const tutorials = Object.values(
        import.meta.glob<MarkdownInstance<Frontmatter>>("../pages/tutorials/**/*.md", {
            eager: true,
        }),
    );

    const tutorialData = tutorials.map(p => ({
        name: p.frontmatter.title,
        innerHTML: `<p>${p.frontmatter.description}</p>`,
        path: p.url ?? '/posts',
        icon: '',
        redirect: false
    }))

    return [
        {
            links: [
                {
                    name: "Landing",
                    path: "/",
                    redirect: false,
                    icon: "flight_takeoff",
                    id: "index"
                },
                {
                    name: "Home",
                    path: "/home/",
                    redirect: false,
                    icon: "home",
                    id: "index"
                },
                {
                    name: "Sign my guestbook!",
                    path: "/guestbook/",
                    redirect: false,
                    icon: "contract_edit",
                    reqJS: true,
                },
                {
                    name: "Contact me!",
                    path: "/contact/",
                    redirect: false,
                    icon: "contact_page"
                },
                {
                    name: "Analytical",
                    path: "/analytical/",
                    redirect: false,
                    icon: "analytics"
                },
                {
                    name: "Follow me on Nekoweb!",
                    path: "https://nekoweb.org/follow/jbc.lol",
                    redirect: true,
                    icon: "add"
                }
            ]
        },
        {
            name: "whereabouts",
            links: [
                {
                    name: "About JB",
                    path: "/about/",
                    redirect: false,
                    icon: "person"
                },
                {
                    name: "Time",
                    path: "/time/",
                    redirect: false,
                    icon: "schedule",
                    reqJS: true,
                },
                {
                    name: "Scrobbles",
                    path: "/scrobbles/",
                    redirect: false,
                    icon: "music_cast",
                    reqJS: true,
                },
                {
                    name: "Projects",
                    path: "/projects/",
                    redirect: false,
                    icon: "terminal"
                },
                {
                    name: "FAQs",
                    path: "/faq/",
                    redirect: false,
                    icon: "quick_reference"
                },
                {
                    name: "Updates",
                    path: "/updates/",
                    redirect: false,
                    icon: "update",
                    innerHTML: `<div class="flex-direction: column;"><h3 style="font-weight: 300;">${Changelogs[0].title}</h3><p>${Changelogs[0].description}</p></div>`
                },
                {
                    name: "RIIAtW",
                    path: "/riiatw/",
                    redirect: false,
                    icon: "language"
                },
                {
                    name: "Packages",
                    path: "/packages/",
                    redirect: false,
                    icon: "inventory_2"
                },
                {
                    name: "Gallery",
                    path: "/gallery/",
                    redirect: false,
                    icon: "photo_library"
                },
                {
                    name: "Album List",
                    path: "/albumlist/",
                    redirect: false,
                    icon: "library_music",
                    reqJS: true,
                },
            ]
        },
        {
            name: "tools & stuff",
            reqJS: true,
            links: [
                {
                    name: "\"AI\" Chat",
                    path: "/chat/",
                    redirect: false,
                    icon: "smart_toy"
                },
                {
                    name: "Split It!",
                    path: "/utils/split-it/",
                    redirect: false,
                    icon: "space_dashboard"
                },
                {
                    name: "Nekobox",
                    path: "/utils/nekobox/",
                    redirect: false,
                    icon: "inventory_2"
                }
            ]
        },
        {
            name: "posts",
            links: postData
        },
        {
            name: "tutorials",
            links: tutorialData
        },
        {
            name: "my webrings",
            reqJS: true,
            links: [
                {
                    name: "SSGRing",
                    path: "/webrings/ssgring/",
                    redirect: false,
                    icon: "build",
                    innerHTML: `<span>${ssgMembers.length}<span style="font-size:0.35em;"> members</span></span>`
                },
                {
                    name: "Responeko",
                    path: "/webrings/responeko/",
                    redirect: false,
                    icon: "phone_android",
                    innerHTML: `<span>${rspMembers.length}<span style="font-size:0.35em;"> members</span></span>`
                },
                {
                    name: "Wafring",
                    path: "https://wafring.jbc.lol/",
                    redirect: true,
                    icon: "dns"
                }
            ]
        },
        {
            name: "outlinks",
            links: [
                {
                    name: "Links",
                    path: "/links/",
                    redirect: false,
                    icon: "link"
                },
                {
                    name: "Other sites",
                    path: "/other-sites/",
                    redirect: false,
                    icon: "link",
                    innerHTML: `<span><span style="font-size:0.35em;">has </span>${buttons.length}<span style="font-size:0.35em;"> other sites</span></span>`
                },
                {
                    name: "Feedroll",
                    path: "/feedroll/",
                    redirect: false,
                    icon: "measuring_tape"
                },
                {
                    name: "Webrings",
                    path: "/webrings/",
                    redirect: false,
                    icon: "donut_large",
                    reqJS: true,
                    innerHTML: `<span><span style="font-size:0.35em;">on </span>29<span style="font-size:0.35em;"> webrings</span></span>`
                },
                {
                    name: "Bookmarks",
                    path: "/bookmarks/",
                    redirect: false,
                    icon: "bookmark"
                }
            ]
        },

    ]
}