export type ChangelogObj = {
    date: string,
    title: string,
    description: string,
    url?: string
}

export const Changelogs: ChangelogObj[] = [
    {
        date: "08/14/2025 23:40",
        title: "Added a new page, Feedroll!",
        description: "Basically just a curated feed aggregator lol, if you want to be here ping me (@jbcrn) on the nekoweb discord",
        url: "https://jbc.lol/feedroll/"
    },
    {
        date: "08/13/2025 21:45",
        title: "Added a new (handwriting) font in my site!",
        description: "and the first one too! Select 'Sheepish' on the Customize window if you want it, and thanks for sheep.nekoweb.org for sharing it!"
    },
    {
        date: "08/12/2025 23:00",
        title: "Added the updates page!",
        description: "which I probably won't maintain lol"
    },
    {
        date: "08/8/2025 23:00",
        title: "Site Button Repo v2!",
        description: "New site rendering pipeline, actually more lenient on screenshotting, and more!"
    },
    {
        date: "08/06/2025 20:00",
        title: "I got Nekoweb Supporter!!!*",
        description: "* Enoki helped me get it! also my domain isn't here without the help of Ellie on Nekoweb Discord! Currently I manually put in these kinds of updates but I'll probably put these on the nekoweb.RSS pipeline of my jbsite4 building system, but for now, fixing webrings... (oh yeah, if you want to see Enoki's site, just click this, and I helped him make it!)",
        url: "https://a.jbc.lol/enoki"
    },
    {
        date: "07/26/2025 20:00",
        title: "Nekoweb RSS now fixed... and migrated to the new system!",
        description: "...and also nekoweb-api and astro-adapter-nekoweb is now also fixed and using the new system (same goes to deploy2nekoweb!)"
    }
]