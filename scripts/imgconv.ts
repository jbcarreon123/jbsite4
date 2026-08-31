import * as fsWalk from '@nodelib/fs.walk';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const imgsDir = fileURLToPath(new URL('../public/imgs/', import.meta.url));

const entries = fsWalk.walkSync(imgsDir);

const jobs = entries.map(e => {
    if (!e.path.includes('albums/') && !e.path.includes('gallery/') && !e.path.includes('id/')
        && !e.path.includes('posts/') && !e.path.includes('projs/') && !e.path.includes('selfhosted/')) return null;
    if (e.name.endsWith('webp') || e.name.endsWith('png') || e.name.endsWith('gif')
        || e.name.endsWith('jpg')) {
        return (async () => {
            const image = sharp(readFileSync(e.path));
            const buf = await image.toFormat('avif').toBuffer();
            writeFileSync(e.path.replace(/\.(?:png|webp|jpg|gif)$/, '.avif'), buf);
            rmSync(e.path);
            console.debug(e.path, 'converted to avif');
        })();
    }
    return null;
});

await Promise.all(jobs);
