export type LinkObj = {
    name?: string,
    reqJS?: boolean,
    links: {
        name: string,
        path: string,
        redirect: boolean,
        icon: string,
        id?: string,
        reqJS?: boolean
    }[]
}[]

export const LinkObjs: LinkObj = [
    {
        links: [
            {
                name: "Home",
                path: "/",
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
                name: "Sitemap",
                path: "/sitemap/",
                redirect: false,
                icon: "map"
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
                icon: "update"
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
        name: "writing",
        links: [
            {
                name: "Posts",
                path: "/posts/",
                redirect: false,
                icon: "article"
            },
            {
                name: "Tutorials",
                path: "/tutorials/",
                redirect: false,
                icon: "help"
            }
        ]
    },
    {
        name: "my webrings",
        reqJS: true,
        links: [
            {
                name: "SSGRing",
                path: "/webrings/ssgring/",
                redirect: false,
                icon: "build"
            },
            {
                name: "Responeko",
                path: "/webrings/responeko/",
                redirect: false,
                icon: "phone_android"
            },
            {
                name: "YAMring",
                path: "/webrings/yamring/",
                redirect: false,
                icon: "tag"
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
                icon: "link"
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