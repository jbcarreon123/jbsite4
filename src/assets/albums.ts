import type { BookmarkUrl } from "./bookmarks.ts"

export interface Album {
    name: string,
    artist: string,
    tracks: Track[],
    links: BookmarkUrl | BookmarkUrl[],
    genres?: string | string[],
    image: string
}

export interface Track {
    title: string,
    artists?: string[],
    discNumber?: number,
    songNumber: number,
    length: string
}

export const albums: Album[] = [
    {
        name: "SMILE! :D",
        artist: "Porter Robinson",
        tracks: [
            {
                title: "Knock Yourself Out XD",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 1,
                length: "2:48"
            },
            {
                title: "Cheerleader",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 2,
                length: "3:57"
            },
            {
                title: "Russian Roulette",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 3,
                length: "6:28"
            },
            {
                title: "Perfect Pinterest Garden",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 4,
                length: "2:28"
            },
            {
                title: "Year of the Cup",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 5,
                length: "4:22"
            },
            {
                title: "Kitsune Maison Freestyle",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 6,
                length: "3:54"
            },
            {
                title: "Easier to Love You",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 7,
                length: "4:10"
            },
            {
                title: "Mona Lisa",
                artists: [
                    "Porter Robinson",
                    "Frost Children"
                ],
                songNumber: 8,
                length: "3:45"
            },
            {
                title: "Is There Really No Happiness?",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 9,
                length: "3:19"
            },
            {
                title: "Everything to Me",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 10,
                length: "4:52"
            }
        ],
        links: [
            {
                name: "Amazon Music US",
                url: "https://music.amazon.com/albums/B0D1T9N5FP"
            },
            {
                name: "Apple Music US",
                url: "https://music.apple.com/us/album/1740856393"
            },
            {
                name: "Beatport",
                url: "https://www.beatport.com/release/-/4668584"
            },
            {
                name: "Juno Download",
                url: "https://www.junodownload.com/products/6717025-02/"
            },
            {
                name: "Qobuz",
                url: "https://www.qobuz.com/album/smile-d-porter-robinson/zqvg8putyovra"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/619179791"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/2iS4pBIiQf4sCTJLZ5n8dy"
            },
            {
                name: "Stream at Tidal",
                url: "https://tidal.com/album/376814627"
            }
        ],
        image: "https://coverartarchive.org/release/c4cfe4aa-4db1-4edf-b538-23ed4cfb550f/39185860508-250.png"
    },
    {
        name: "Nurture",
        artist: "Porter Robinson",
        tracks: [
            {
                title: "Lifelike",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 1,
                length: "1:34"
            },
            {
                title: "Look at the Sky",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 2,
                length: "5:10"
            },
            {
                title: "Get Your Wish",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 3,
                length: "3:39"
            },
            {
                title: "Wind Tempos",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 4,
                length: "6:04"
            },
            {
                title: "Musician",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 5,
                length: "3:58"
            },
            {
                title: "do-re-mi-fa-so-la-ti-do",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 6,
                length: "3:34"
            },
            {
                title: "Mother",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 7,
                length: "3:46"
            },
            {
                title: "dullscythe",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 8,
                length: "4:00"
            },
            {
                title: "Sweet Time",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 9,
                length: "4:11"
            },
            {
                title: "Mirror",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 10,
                length: "5:07"
            },
            {
                title: "Something Comforting",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 11,
                length: "4:42"
            },
            {
                title: "Blossom",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 12,
                length: "3:46"
            },
            {
                title: "Unfold",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson",
                    "Totally Enormous Extinct Dinosaurs"
                ],
                songNumber: 13,
                length: "4:45"
            },
            {
                title: "Trying to Feel Alive",
                artists: [
                    "Porter Robinson"
                ],
                songNumber: 14,
                length: "4:39"
            }
        ],
        links: [
            {
                name: "Beatport",
                url: "https://www.beatport.com/release/nurture/3374264"
            },
            {
                name: "iTunes US",
                url: "https://itunes.apple.com/us/album/id1550626757"
            },
            {
                name: "Qobuz",
                url: "https://www.qobuz.com/gb-en/album/nurture-porter-robinson/oz1f6jozdu8da"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/224054812"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/4Hjqdhj5rh816i1dfcUEaM"
            },
            {
                name: "Stream at Tidal",
                url: "https://tidal.com/album/181171322"
            },
            {
                name: "US: B08TZPYLJN",
                url: "https://www.amazon.com/gp/product/B08TZPYLJN?tag=musicbrainz0d-20"
            }
        ],
        image: "https://coverartarchive.org/release/a368a283-c070-42a0-bdd5-7974a7df1b9a/35536434577-250.png"
    },
    {
        name: "Worlds",
        artist: "Porter Robinson",
        tracks: [
            {
                title: "Divinity",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson",
                    "Amy Millan"
                ],
                songNumber: 1,
                length: "6:08"
            },
            {
                title: "Sad Machine",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 2,
                length: "5:50"
            },
            {
                title: "Years of War",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson",
                    "Breanne Düren",
                    "Sean Caskey"
                ],
                songNumber: 3,
                length: "3:56"
            },
            {
                title: "Flicker",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 4,
                length: "4:39"
            },
            {
                title: "Fresh Static Snow",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 5,
                length: "5:58"
            },
            {
                title: "Polygon Dust",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson",
                    "Lemaitre"
                ],
                songNumber: 6,
                length: "3:29"
            },
            {
                title: "Hear the Bells",
                artists: [
                    "Imaginary Cities",
                    "Porter Robinson",
                    "Porter Robinson",
                    "Imaginary Cities"
                ],
                songNumber: 7,
                length: "4:46"
            },
            {
                title: "Natural Light",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 8,
                length: "2:21"
            },
            {
                title: "Lionhearted",
                artists: [
                    "Porter Robinson",
                    "Urban Cone"
                ],
                songNumber: 9,
                length: "4:26"
            },
            {
                title: "Sea of Voices",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 10,
                length: "4:58"
            },
            {
                title: "Fellow Feeling",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 11,
                length: "5:50"
            },
            {
                title: "Goodbye to a World",
                artists: [
                    "Porter Robinson",
                    "Porter Robinson"
                ],
                songNumber: 12,
                length: "5:28"
            }
        ],
        links: [
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/8198764"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/7AJPV0L05IyIBid97AvwVD"
            }
        ],
        image: "https://coverartarchive.org/release/174e9cf8-4593-494f-bc34-96e898cd3108/33580932565-250.jpg"
    },
    {
        name: "Good Kid 3",
        artist: "Good Kid",
        tracks: [
            {
                title: "No Time to Explain",
                artists: [],
                songNumber: 1,
                length: "2:36"
            },
            {
                title: "Mimi's Delivery Service",
                artists: [],
                songNumber: 2,
                length: "2:58"
            },
            {
                title: "Osmosis",
                artists: [],
                songNumber: 3,
                length: "2:53"
            },
            {
                title: "First Rate Town",
                artists: [],
                songNumber: 4,
                length: "2:02"
            },
            {
                title: "Orbit",
                artists: [],
                songNumber: 5,
                length: "2:19"
            },
            {
                title: "Madeleine",
                artists: [],
                songNumber: 6,
                length: "2:53"
            }
        ],
        links: [
            {
                name: "Bandcamp",
                url: "https://goodkid.bandcamp.com/album/good-kid-3"
            }
        ],
        image: "https://coverartarchive.org/release/2a81e373-b913-4b4d-83b8-a8fc3dfbb714/37269768242-250.jpg"
    },
    {
        name: "Good Kid 4",
        artist: "Good Kid",
        tracks: [
            {
                title: "Bubbly",
                artists: [],
                songNumber: 1,
                length: "3:07"
            },
            {
                title: "From the Start",
                artists: [],
                songNumber: 2,
                length: "2:30"
            },
            {
                title: "Summer",
                artists: [],
                songNumber: 3,
                length: "2:27"
            },
            {
                title: "Break",
                artists: [],
                songNumber: 4,
                length: "2:32"
            },
            {
                title: "Dance Class",
                artists: [],
                songNumber: 5,
                length: "2:57"
            },
            {
                title: "Premier Inn",
                artists: [],
                songNumber: 6,
                length: "3:33"
            }
        ],
        links: [
            {
                name: "Apple Music GB",
                url: "https://music.apple.com/gb/album/1727814798"
            },
            {
                name: "Bandcamp",
                url: "https://goodkid.bandcamp.com/album/good-kid-4"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/538637352"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/20F08ugoumkxgU03ly7gMh"
            }
        ],
        image: "https://coverartarchive.org/release/7f307856-4828-481a-8687-aa6577749e10/38400202818-250.jpg"
    },
    {
        name: "Prefer not to say",
        artist: "Tanger",
        tracks: [
            {
                title: "wise mystical magical wizard fish",
                artists: [
                    "Tanger"
                ],
                songNumber: 1,
                length: "2:28"
            },
            {
                title: "Womp Womp",
                artists: [
                    "Tanger"
                ],
                songNumber: 2,
                length: "2:26"
            },
            {
                title: "IMPULSE!",
                artists: [
                    "Tanger",
                    "Inferno"
                ],
                songNumber: 3,
                length: "3:35"
            },
            {
                title: "this catnip aint shi-",
                artists: [
                    "Tanger",
                    "availax"
                ],
                songNumber: 4,
                length: "3:51"
            },
            {
                title: "I LIKE LOUD THINGS",
                artists: [
                    "Tanger"
                ],
                songNumber: 5,
                length: "3:05"
            },
            {
                title: "wan!",
                artists: [
                    "Tanger",
                    "Glitch Cat"
                ],
                songNumber: 6,
                length: "2:44"
            },
            {
                title: "sludgecrank",
                artists: [
                    "Tanger"
                ],
                songNumber: 7,
                length: "2:14"
            },
            {
                title: "cloud city",
                artists: [
                    "Tanger"
                ],
                songNumber: 8,
                length: "3:49"
            },
            {
                title: "head empty (interlude)",
                artists: [
                    "Tanger"
                ],
                songNumber: 9,
                length: "1:48"
            },
            {
                title: "tiny windows",
                artists: [
                    "Tanger",
                    "Frizk"
                ],
                songNumber: 10,
                length: "2:32"
            },
            {
                title: "dogbone (with sharkbarksss)",
                artists: [
                    "Tanger",
                    "sharkbarksss"
                ],
                songNumber: 11,
                length: "1:53"
            },
            {
                title: "depressed hermit girl touches grass.",
                artists: [
                    "Tanger",
                    "ISSBROKIE"
                ],
                songNumber: 12,
                length: "2:36"
            },
            {
                title: "BAD NUMBER!",
                artists: [
                    "Tanger",
                    "Disphing"
                ],
                songNumber: 13,
                length: "3:37"
            },
            {
                title: "Cereal Killer",
                artists: [
                    "Tanger",
                    "kaydotnet",
                    "gluzzo"
                ],
                songNumber: 14,
                length: "3:48"
            },
            {
                title: "takemehigher",
                artists: [
                    "Tanger"
                ],
                songNumber: 15,
                length: "2:00"
            },
            {
                title: "feltlikethis",
                artists: [
                    "Tanger",
                    "sponzi",
                    "Kyureta"
                ],
                songNumber: 16,
                length: "3:10"
            },
            {
                title: "முன்னுதாரணம்",
                artists: [
                    "Tanger",
                    "Treb",
                    "tiyu"
                ],
                songNumber: 17,
                length: "3:19"
            },
            {
                title: "weka sina",
                artists: [
                    "Tanger",
                    "jan Mika",
                    "stimkitten"
                ],
                songNumber: 18,
                length: "3:39"
            },
            {
                title: "+eravol+",
                artists: [
                    "Tanger",
                    "Drazically"
                ],
                songNumber: 19,
                length: "4:03"
            },
            {
                title: "shards",
                artists: [
                    "Tanger",
                    "JFXO"
                ],
                songNumber: 20,
                length: "3:38"
            },
            {
                title: "strangers once again",
                artists: [
                    "Tanger",
                    "Treb",
                    "Ofir Tabakov"
                ],
                songNumber: 21,
                length: "3:17"
            },
            {
                title: "running on a rope",
                artists: [
                    "Tanger",
                    "Treb",
                    "Ofir Tabakov"
                ],
                songNumber: 22,
                length: "3:43"
            },
            {
                title: "quiet time (interlude)",
                artists: [
                    "Tanger"
                ],
                songNumber: 23,
                length: "2:14"
            },
            {
                title: "somewhere, someday,",
                artists: [
                    "Tanger"
                ],
                songNumber: 24,
                length: "7:00"
            },
            {
                title: "megalovania (with junebug florum & Kyureta)",
                artists: [
                    "Tanger",
                    "junebug florum",
                    "Kyureta"
                ],
                songNumber: 25,
                length: "2:24"
            },
            {
                title: "unreality",
                artists: [
                    "Tanger"
                ],
                songNumber: 26,
                length: "1:36"
            }
        ],
        links: [
            {
                name: "Bandcamp",
                url: "https://tangermusic.bandcamp.com/album/prefer-not-to-say"
            },
            {
                name: "Play on YouTube",
                url: "https://www.youtube.com/watch?v=UbouNYelvoo"
            }
        ],
        image: "https://coverartarchive.org/release/48d783b4-603d-45cb-9770-bd895148db93/40460106817-250.jpg"
    },
    {
        name: "Mirage",
        artist: "Dutch Criminal Record",
        tracks: [
            {
                title: "Intro",
                artists: [],
                songNumber: 1,
                length: "1:23"
            },
            {
                title: "Cold Water",
                artists: [],
                songNumber: 2,
                length: "3:18"
            },
            {
                title: "Corona",
                artists: [],
                songNumber: 3,
                length: "5:51"
            },
            {
                title: "Socks & Sandals",
                artists: [],
                songNumber: 4,
                length: "3:29"
            },
            {
                title: "B-Side",
                artists: [],
                songNumber: 5,
                length: "3:59"
            },
            {
                title: "Southsea",
                artists: [],
                songNumber: 6,
                length: "4:33"
            }
        ],
        links: [
            {
                name: "Qobuz",
                url: "http://www.qobuz.com/album/mirage-dutch-criminal-record/5054227073533"
            }
        ],
        image: "https://coverartarchive.org/release/1ad22450-b0c2-4eaf-ac3a-487786d65dc5/12093268352-250.jpg"
    },
    {
        name: "Before the Night",
        artist: "HOME",
        tracks: [
            {
                title: "We’re Finally Landing",
                artists: [],
                songNumber: 1,
                length: "4:32"
            },
            {
                title: "Synchronize",
                artists: [],
                songNumber: 2,
                length: "4:00"
            },
            {
                title: "Overflow",
                artists: [],
                songNumber: 3,
                length: "5:22"
            },
            {
                title: "Without a Sound",
                artists: [],
                songNumber: 4,
                length: "3:33"
            },
            {
                title: "Above All",
                artists: [],
                songNumber: 5,
                length: "3:47"
            },
            {
                title: "Pyxis",
                artists: [],
                songNumber: 6,
                length: "3:37"
            },
            {
                title: "Before the Night",
                artists: [],
                songNumber: 7,
                length: "3:53"
            },
            {
                title: "If I’m Wrong",
                artists: [],
                songNumber: 8,
                length: "2:55"
            },
            {
                title: "Nosebleed",
                artists: [],
                songNumber: 9,
                length: "3:54"
            },
            {
                title: "Sun",
                artists: [],
                songNumber: 10,
                length: "2:36"
            },
            {
                title: "Sleep",
                artists: [],
                songNumber: 11,
                length: "4:34"
            }
        ],
        links: [
            {
                name: "Bandcamp",
                url: "https://midwestcollective.bandcamp.com/album/before-the-night"
            },
            {
                name: "Discogs",
                url: "https://www.discogs.com/release/9330774"
            },
            {
                name: "Discogs",
                url: "https://www.discogs.com/release/14960136"
            },
            {
                name: "Discogs",
                url: "https://www.discogs.com/release/16846446"
            },
            {
                name: "SoundCloud",
                url: "https://soundcloud.com/home-2001/sets/before-the-night"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/12677668"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/491kGL57gDkFdIPNvEjCNd"
            }
        ],
        image: "https://coverartarchive.org/release/f67bb4ba-6940-430b-b470-fb571631aba7/13026066383-250.jpg"
    },
    {
        name: "RAZZMATAZZ",
        artist: "I DONT KNOW HOW BUT THEY FOUND ME",
        tracks: [
            {
                title: "Leave Me Alone",
                artists: [],
                songNumber: 1,
                length: "3:36"
            },
            {
                title: "Mad IQs",
                artists: [],
                songNumber: 2,
                length: "3:03"
            },
            {
                title: "Nobody Likes the Opening Band",
                artists: [],
                songNumber: 3,
                length: "2:15"
            },
            {
                title: "New Invention",
                artists: [],
                songNumber: 4,
                length: "3:12"
            },
            {
                title: "From the Gallows",
                artists: [],
                songNumber: 5,
                length: "2:43"
            },
            {
                title: "Clusterhug",
                artists: [],
                songNumber: 6,
                length: "3:12"
            },
            {
                title: "Sugar Pills",
                artists: [],
                songNumber: 7,
                length: "3:07"
            },
            {
                title: "Kiss Goodnight",
                artists: [],
                songNumber: 8,
                length: "3:50"
            },
            {
                title: "Lights Go Down",
                artists: [],
                songNumber: 9,
                length: "3:24"
            },
            {
                title: "Need You Here",
                artists: [],
                songNumber: 10,
                length: "3:08"
            },
            {
                title: "Door",
                artists: [],
                songNumber: 11,
                length: "1:33"
            },
            {
                title: "Razzmatazz",
                artists: [],
                songNumber: 12,
                length: "4:19"
            }
        ],
        links: [
            {
                name: "Bandcamp",
                url: "https://idkhow.bandcamp.com/album/razzmatazz"
            },
            {
                name: "iTunes US",
                url: "https://itunes.apple.com/us/album/id1522943458"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/179885792"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/7q8hYYZgsIQCXibLzwiPll"
            }
        ],
        image: "https://coverartarchive.org/release/b9dba591-125d-4e52-977f-69e7c17396d7/26991661470-250.jpg"
    },
    {
        name: "this is what ____ feels like, Vol. 1-4",
        artist: "JVKE",
        tracks: [
            {
                title: "this is what falling in love feels like",
                artists: [],
                songNumber: 1,
                length: "2:00"
            },
            {
                title: "moon and back",
                artists: [],
                songNumber: 2,
                length: "2:28"
            },
            {
                title: "golden hour",
                artists: [
                    "JVKE"
                ],
                songNumber: 3,
                length: "3:29"
            },
            {
                title: "this is what heartbreak feels like",
                artists: [],
                songNumber: 4,
                length: "2:37"
            },
            {
                title: "i’m not okay",
                artists: [],
                songNumber: 5,
                length: "2:25"
            },
            {
                title: "ghost town",
                artists: [],
                songNumber: 6,
                length: "2:37"
            },
            {
                title: "this is what sadness feels like",
                artists: [],
                songNumber: 7,
                length: "3:11"
            },
            {
                title: "wonder if she loves me",
                artists: [],
                songNumber: 8,
                length: "2:40"
            },
            {
                title: "save your breath",
                artists: [],
                songNumber: 9,
                length: "2:45"
            },
            {
                title: "this is what falling out of love feels like",
                artists: [],
                songNumber: 10,
                length: "2:21"
            },
            {
                title: "catch me",
                artists: [],
                songNumber: 11,
                length: "2:57"
            },
            {
                title: "i can’t help it",
                artists: [],
                songNumber: 12,
                length: "2:57"
            }
        ],
        links: [
            {
                name: "Apple Music US",
                url: "https://music.apple.com/us/album/1640157064"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/347160717"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/0X1rJoOfFT7RfYYj9wG4G8"
            }
        ],
        image: "https://coverartarchive.org/release/e926d4a6-c308-460a-b6a1-0666e41eecb5/33758999232-250.jpg"
    },
    {
        name: "Good Kid 2",
        artist: "Good Kid",
        tracks: [
            {
                title: "Down With the King",
                artists: [],
                songNumber: 1,
                length: "2:56"
            },
            {
                title: "Everything Everything",
                artists: [],
                songNumber: 2,
                length: "2:46"
            },
            {
                title: "Slingshot",
                artists: [],
                songNumber: 3,
                length: "2:32"
            },
            {
                title: "Pox",
                artists: [],
                songNumber: 4,
                length: "2:38"
            },
            {
                title: "Aloe Lite",
                artists: [],
                songNumber: 5,
                length: "2:29"
            },
            {
                title: "Drifting",
                artists: [],
                songNumber: 6,
                length: "2:26"
            }
        ],
        links: [
            {
                name: "Apple Music GB",
                url: "https://music.apple.com/gb/album/1535818794"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/179562022"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/0hpImZxouzm2icIy4hsldV"
            }
        ],
        image: "https://coverartarchive.org/release/a2c90a50-4c8d-4cf8-8fbe-6dc447a1bea6/39623532050-250.jpg"
    },
    {
        name: "Good Kid",
        artist: "Good Kid",
        tracks: [
            {
                title: "Nomu",
                artists: [],
                songNumber: 1,
                length: "2:50"
            },
            {
                title: "Tell Me You Know",
                artists: [],
                songNumber: 2,
                length: "3:18"
            },
            {
                title: "Alchemist",
                artists: [],
                songNumber: 3,
                length: "2:53"
            },
            {
                title: "Witches",
                artists: [],
                songNumber: 4,
                length: "2:35"
            },
            {
                title: "Faster",
                artists: [],
                songNumber: 5,
                length: "2:37"
            },
            {
                title: "Atlas",
                artists: [],
                songNumber: 6,
                length: "2:24"
            }
        ],
        links: [
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/159460192"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/4gbZs8ssK4gtqnRGTFNBJo"
            }
        ],
        image: "https://coverartarchive.org/release/16a2acc1-b836-4a99-8b86-7736ed43702d/30013321928-250.jpg"
    },
    {
        name: "Forgotten Arcade",
        artist: "Frizk",
        tracks: [
            {
                title: "Fusion Core",
                artists: [],
                songNumber: 1,
                length: "2:34"
            },
            {
                title: "Gorveve",
                artists: [],
                songNumber: 2,
                length: "2:10"
            },
            {
                title: "Real Fellas",
                artists: [],
                songNumber: 3,
                length: "1:10"
            },
            {
                title: "Flashback",
                artists: [],
                songNumber: 4,
                length: "1:42"
            },
            {
                title: "Bright Stuff",
                artists: [],
                songNumber: 5,
                length: "1:45"
            },
            {
                title: "I Feel Alive",
                artists: [],
                songNumber: 6,
                length: "2:36"
            },
            {
                title: "Bitrate",
                artists: [],
                songNumber: 7,
                length: "1:28"
            },
            {
                title: "Please Hold",
                artists: [],
                songNumber: 8,
                length: "1:11"
            },
            {
                title: "I Feel Alright",
                artists: [],
                songNumber: 9,
                length: "2:09"
            },
            {
                title: "I Know, I Hear You",
                artists: [],
                songNumber: 10,
                length: "2:20"
            },
            {
                title: "Leave u GONE",
                artists: [],
                songNumber: 11,
                length: "1:42"
            },
            {
                title: "Closing Up",
                artists: [],
                songNumber: 12,
                length: "1:04"
            },
            {
                title: "Rainy Day",
                artists: [],
                songNumber: 13,
                length: "1:49"
            }
        ],
        links: [
            {
                name: "Apple Music GB",
                url: "https://music.apple.com/gb/album/1713085842"
            },
            {
                name: "SoundCloud",
                url: "https://soundcloud.com/prodfrizk/forgotten-arcade-full-album"
            },
            {
                name: "Stream at Deezer",
                url: "https://www.deezer.com/album/503522461"
            },
            {
                name: "Stream at Spotify",
                url: "https://open.spotify.com/album/6ARqHNLjBsMz438SUnLf1n"
            }
        ],
        image: "https://coverartarchive.org/release/4a703d66-8919-43a4-8eb8-a9b5679b7fea/37144424156-250.jpg"
    },
{
    name: "Now, Not Yet",
    artist: "half•alive",
    tracks: [
        {
            title: "ok ok?",
            artists: [
                "half•alive",
                "half•alive"
            ],
            songNumber: 1,
            length: "3:49"
        },
        {
            title: "RUNAWAY",
            artists: [
                "half•alive",
                "half•alive"
            ],
            songNumber: 2,
            length: "2:42"
        },
        {
            title: "Maybe",
            artists: [
                "half•alive"
            ],
            songNumber: 3,
            length: "3:13"
        },
        {
            title: "the notion",
            artists: [
                "half•alive"
            ],
            songNumber: 4,
            length: "0:37"
        },
        {
            title: "still feel.",
            artists: [
                "half•alive",
                "half•alive"
            ],
            songNumber: 5,
            length: "4:08"
        },
        {
            title: "TrusT",
            artists: [
                "half•alive"
            ],
            songNumber: 6,
            length: "4:17"
        },
        {
            title: "arrow",
            artists: [
                "half•alive",
                "half•alive"
            ],
            songNumber: 7,
            length: "3:43"
        },
        {
            title: "Pure Gold",
            artists: [
                "half•alive",
                "half•alive"
            ],
            songNumber: 8,
            length: "3:34"
        },
        {
            title: "ice cold.",
            artists: [
                "half•alive",
                "Kimbra"
            ],
            songNumber: 9,
            length: "2:58"
        },
        {
            title: "Rest",
            artists: [
                "half•alive",
                "Samm Henshaw"
            ],
            songNumber: 10,
            length: "3:29"
        },
        {
            title: "BREAKFAST",
            artists: [
                "half•alive",
                "half•alive"
            ],
            songNumber: 11,
            length: "3:31"
        },
        {
            title: "creature",
            artists: [
                "half•alive"
            ],
            songNumber: 12,
            length: "5:35"
        }
    ],
    links: [
        {
            name: "Apple Music US",
            url: "https://music.apple.com/us/album/1467958791"
        },
        {
            name: "Jaxsta",
            url: "https://jaxsta.com/release/8f86fe49-2d70-44cd-b8c6-3eaefb6c0320/ee73afee-33ab-4617-b9c6-b45e3e78d0eb/overview"
        },
        {
            name: "Stream at Deezer",
            url: "https://www.deezer.com/album/106079792"
        },
        {
            name: "Stream at Spotify",
            url: "https://open.spotify.com/album/2KSWrd22LGc0Hmqs2Z5i7z"
        },
        {
            name: "US: B07SV4WXQK",
            url: "https://www.amazon.com/gp/product/B07SV4WXQK?tag=musicbrainz0d-20"
        }
    ],
    image: "https://coverartarchive.org/release/fa86fb0d-9428-46ba-86ec-d8e803156b5a/23850615876-250.jpg"
}
]