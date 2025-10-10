import * as fsWalk from '@nodelib/fs.walk';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import sharp from 'sharp';

const entries = fsWalk.walkSync('./dist');

entries.forEach(async e => {
    if (e.name.endsWith('.html') || e.name.endsWith('.css')) {
        const htmlContent = readFileSync(e.path, 'utf8');
        let minifiedHTML = htmlContent.replace(/href=([\/\.\-\_:\w]+)([\w =-]+data-main-site=true)/g, 'href=https://jbc.lol$1$2');
        minifiedHTML = minifiedHTML.replaceAll('/music/', 'https://gh.jbc.lol/music/');
        minifiedHTML = minifiedHTML.replaceAll("#REMOVE_THIS::", '::');
        if (htmlContent !== minifiedHTML) {
            writeFileSync(e.path, minifiedHTML, 'utf8');
            console.debug(`Converted urls for ${e.path}`);
        }
    }
})