import * as fsWalk from '@nodelib/fs.walk';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import sharp from 'sharp';

const entries = fsWalk.walkSync('./dist');

entries.forEach(async e => {
    if (e.name.endsWith('.html')) {
        const htmlContent = readFileSync(e.path, 'utf8');
        /href="([\/\.\-\_:\w]+")(.+data-main-site="true")/gm.exec(htmlContent)?.forEach(e => console.log(e));
        let minifiedHTML = htmlContent.replace(/href="([\/\.\-\_:\w]+")(.+data-main-site="true")/gm, 'href="https://jbc.lol$1$2');
        minifiedHTML = minifiedHTML.replace(/href="([\/\.\-\_:\w]+")(.+data-gh-site="true")/gm, 'href="https://gh.jbc.lol$1$2');
        writeFileSync(e.path, minifiedHTML, 'utf8');
        console.log(`Converted urls for ${e.path}`);
    }
})