import * as fsWalk from '@nodelib/fs.walk';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import sharp from 'sharp';

const entries = fsWalk.walkSync('./dist');

entries.forEach(async e => {
    if (e.name.endsWith('.html')) {
        const htmlContent = readFileSync(e.path, 'utf8');
        let minifiedHTML = htmlContent.replaceAll('data-main-site="true" href="', 'data-main-site="true" href="https://jbc.lol');
        minifiedHTML = minifiedHTML.replaceAll('data-gh-site="true" src="', 'data-gh-site="true" src="https://gh.jbc.lol');
        writeFileSync(e.path, minifiedHTML, 'utf8');
        console.log(`Converted urls for ${e.path}`);
    }
})