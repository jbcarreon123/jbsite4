import * as fsWalk from '@nodelib/fs.walk';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import sharp from 'sharp';

const entries = fsWalk.walkSync('./public/imgs/');

entries.forEach(async e => {
    if (!e.path.includes('albums\\') && !e.path.includes('gallery\\') && !e.path.includes('id\\') && !e.path.includes('posts\\') && !e.path.includes('projs\\')) return;
    if (e.name.endsWith('webp') || e.name.endsWith('png') || e.name.endsWith('gif') || e.name.endsWith('jpg')) {
        const image = sharp(readFileSync(e.path));
        const buf = await image.toFormat('avif').toBuffer();
        writeFileSync(e.path.replace(/\.(?:png|webp|jpg|gif)$/, '.avif'), buf);
        rmSync(e.path);
        console.log(e.path, 'converted to avif');
    }
})