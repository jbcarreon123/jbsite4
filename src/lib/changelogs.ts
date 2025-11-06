export type ChangelogObj = {
    date: string,
    title: string,
    description: string,
    url?: string
}

export const Changelogs: ChangelogObj[] = [
    {
        date: "11/06/2025 13:00",
        title: "New generator: DNI Generator!",
        description: "just check it, you'll find out what it does",
        url: "https://jbc.lol/dnigen/"
    },
    {
        date: "10/25/2025 11:00",
        title: "New 404 page background, again!",
        description: "Out the 404 texts which is difficult to get right, in the /links/ buttons!",
        url: "https://jbc.lol/not_found/"
    },
    {
        date: "10/18/2025 20:20",
        title: "New landing page!",
        description: "with some quick links and my socials, just like how a carrd shows up"
    },
    {
        date: "10/15/2025 00:20",
        title: "New font: Dann Inc!",
        description: "made by daneeko.nekoweb.org, now available in the nearest jbc.lol server near you!"
    },
    {
        date: "10/09/2025 20:15",
        title: "Modified my homepage widgets!",
        description: "Added a new widget which is my Wafrn woots! Speaking of Wafrn, I'm hosting an AMA on my instance! Click this if you want to ask me something!",
        url: "https://wf.jbc.lol/blog/jbcrn/ask"
    },
    {
        date: "09/08/2025 23:00",
        title: "New 404 page background!",
        description: "Out the 404 DVD screensaver, in the Matter.js physics simulation!",
        url: "https://jbc.lol/not_found/"
    },
    {
        date: "08/31/2025 01:30",
        title: "Contact form is now new, and I have a Patreon now!",
        description: "Thanks to Layercake (and Mars) for the code for the contact form! Oh yeah, you can now throw money at me.",
    },
    {
        date: "08/28/2025 16:00",
        title: "jbsite4 on Neocities!",
        description: "Want to see jbsite4 with fetch workarounds? See jbsite4 on Neocities, powered by POSTreq!",
        url: "https://jbcarreon123.neocities.org/"
    },
    {
        date: "08/15/2025 21:20",
        title: "Added a new page, Analytical!",
        description: "Basically just a stats page of how much you visited my site lol",
        url: "https://jbc.lol/analytical/"
    },
    {
        date: "08/15/2025 00:15",
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