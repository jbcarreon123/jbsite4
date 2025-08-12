import { readdirSync } from 'node:fs';
import path from 'node:path';

export async function loadMusic() {
    let files = readdirSync('./public/music').filter((v) => v.endsWith('mp3') || v.endsWith('it') || v.endsWith('mod'));
    return files
}