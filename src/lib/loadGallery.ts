import { fstat, readdirSync, readFileSync, statSync } from 'node:fs';
import ExifReader from 'exifreader';

export function loadGallery() {
    let files = readdirSync('./public/imgs/gallery');
    return files
        .map(fileName => ({
            name: fileName,
            data: ExifReader.load(readFileSync(`./public/imgs/gallery/${fileName}`))
        })).map(f => ({
            ...f,
            time: Date.parse(`${f.data.DateTime?.description.replace(':', '-').replace(':', '-')} ${f.data.OffsetTime?.value}`)
        })).sort((a, b) => {
            return b.time - a.time;
        });
}