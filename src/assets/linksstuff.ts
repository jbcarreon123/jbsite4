export interface LinksStuff {
    author?: string,
    name: string,
    url: string,
    description: string,
    button?: string,
    tags?: string[]
}

export const linksStuff: LinksStuff[] = [
    {
        name: 'Nekoweb',
        url: 'https://nekoweb.org',
        description: 'The host of this webbed site',
        button: 'https://nekoweb.org/assets/buttons/button5.gif',
        tags: ['hosts', 'indieweb']
    },
    {
        author: 'thepersonever',
        name: 'PSFL Adventures',
        url: 'https://psfla.net',
        description: 'thepersonever\'s mspaint adventures',
        tags: ['mspa'],
        button: 'https://psfla.net/resc/img/psflabutton.png'
    },
    {
        author: 'sen.fish',
        name: 'The Ad Archive',
        url: 'https://ads.sen.fish/',
        description: 'An archive of static image ads from the late 1990s to the early 2000s',
        tags: ['ads', 'old-net'],
        button: '/imgs/buttons/ad-archive-88x31-mosaic.png'
    },
    {
        name: 'IndieSeas',
        url: 'https://indieseas.net',
        description: 'An indie web search engine',
        tags: ['search', 'indieweb'],
        button: 'https://indieseas.net/indieseas_button.png'
    }
]
