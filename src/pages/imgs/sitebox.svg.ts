import type { APIContext } from "astro";
import { readFileSync } from "fs";

function shuffleArray<T>(array: T[]): T {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array[0];
}

const arrays = [
    [
        "is this something? idk"
    ],
    [
        "maybe idk does this work"
    ],
    [
        "thank you dimden"
    ],
    [
        "may i copy this site in the name",
        "of love cuz copying is an act of",
        "love and stuff"
    ],
    [
        "can i follow this page, what do you",
        "love and everything I do"
    ],
    [
        "compiled in \"html\"",
        "because you'll love it"
    ]
]

export async function GET(context: APIContext) {
    let siteboxSvg = readFileSync('./src/lib/sitebox.svg', { encoding: 'utf-8' });

    const ent = shuffleArray(arrays);

    siteboxSvg = siteboxSvg.replaceAll('[MOTD]', ent.map((a, i) => `<tspan x="22.258781" y="${22.808296 + (3.12954052 * (i))}">${a}</tspan>`).join(''));
    
    return new Response(siteboxSvg, { headers: { 'Content-Type': 'image/svg+xml' } })
}