import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { walkSync } from '@nodelib/fs.walk';
import { fileURLToPath } from "url";
import { transform } from "lightningcss";
import { readFileSync, statSync, writeFileSync } from "fs";

// @ts-ignore
function minifyStyleTags(htmlContent, logger) {
    const styleTagRegex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;

    // @ts-ignore
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
    const htmlContent = readFileSync(filePath, 'utf8');
    const minifiedHTML = minifyStyleTags(htmlContent, logger);
    writeFileSync(filePath, minifiedHTML, 'utf8');
    return minifiedHTML;
}

function processCid(filePath: string) {
    try {
        const htmlContent = readFileSync(filePath, 'utf8');
        const minifiedHTML = htmlContent.replaceAll('data-astro-cid-', 'data-jbsite-');
        writeFileSync(filePath, minifiedHTML, 'utf8');
        return minifiedHTML;
    } catch {
        return "";
    }
}

export default function createIntegration(): AstroIntegration {
    return {
        name: 'html-style-minify',
        hooks: {
            'astro:build:done': async ({ dir, assets, logger }) => {
                const outDir = fileURLToPath(dir);

                let files = walkSync(outDir);
                files.forEach((v) => {
                    if (v.name.endsWith('.html')) {
                        processHTMLFile(v.path, logger);
                        logger.info(`Minified style tags of ${v.path}`);
                    }
                    if (!statSync(v.path).isDirectory() || !v.stats?.isDirectory()) {
                        processCid(v.path);
                        logger.info(`Processed scoped classes of ${v.path}`);
                    }
                })
            }
        }
    }
}