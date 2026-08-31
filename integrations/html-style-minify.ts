import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { walkSync } from '@nodelib/fs.walk';
import { fileURLToPath } from "url";
import { transform } from "lightningcss";
import { readFileSync, writeFileSync, statSync } from "fs";

function minifyStyleTags(htmlContent: string, logger: AstroIntegrationLogger) {
    const styleTagRegex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;

    return htmlContent.replace(styleTagRegex, (match, attributes, cssContent) => {
        if (!cssContent.trim()) return match;

        try {
            const result = transform({
                filename: 'inline.css',
                code: Buffer.from(cssContent),
                minify: true,
                targets: { chrome: 95 << 16 }
            });

            const minifiedCSS = result.code.toString();
            return `<style${attributes}>${minifiedCSS}</style>`;
        } catch (error) {
            logger.warn('CSS minification failed, keeping original');
            return match;
        }
    });
}

function processHTMLFile(filePath: string, logger: AstroIntegrationLogger) {
    let htmlContent: string;
    try {
        htmlContent = readFileSync(filePath, 'utf8');
        if (!htmlContent.includes('<style')) return;
    } catch {
        return;
    }
    const minifiedHTML = minifyStyleTags(htmlContent, logger);
    if (minifiedHTML === htmlContent) return;
    writeFileSync(filePath, minifiedHTML, 'utf8');
    logger.info(`Minified style tags of ${filePath}`);
}

export default function createIntegration(): AstroIntegration {
    return {
        name: 'html-style-minify',
        hooks: {
            'astro:build:done': async ({ dir, logger }) => {
                const outDir = fileURLToPath(dir);
                walkSync(outDir, { entryFilter: (entry) => !statSync(entry.path).isDirectory() && entry.name.endsWith('.html') })
                    .forEach((v) => processHTMLFile(v.path, logger));
            },
        }
    }
}