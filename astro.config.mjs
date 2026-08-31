import { defineConfig, passthroughImageService } from 'astro/config';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mdx from '@astrojs/mdx';
import rehypeSectionize from '@hbsnow/rehype-sectionize'
import expressiveCode from 'astro-expressive-code';
import htmlStyleMinify from './integrations/html-style-minify.ts';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import playformCompress from '@playform/compress';
import rehypeToc from "@stefanprobst/rehype-extract-toc";
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import playformFormat from '@playform/format';
import linkCard from "astro-link-card";
import remarkLinkCard from 'remark-link-card';
import { rehypeTargetBlank, remarkQuoteDirective } from './src/lib/markdown.ts';
import { execSync } from 'node:child_process';

let commitHash = process.env.COMMIT_HASH;
try {
    if (!commitHash) commitHash = execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
} catch {
    if (!commitHash) commitHash = "unknown";
}

// https://astro.build/config
export default defineConfig({
  site: "https://jbc.lol",

  security: {
    // trust caddy's X-Forwarded-* so urls render https behind the proxy
    allowedDomains: [{ hostname: "jbc.lol" }, { hostname: "**.jbc.lol" }]
  },

  output: 'server',
  adapter: node({ mode: 'standalone' }),

  prefetch: {
    prefetchAll: true
  },

  build: {
    concurrency: 6
  },

  image: {
    service: passthroughImageService()
  },

  integrations: [linkCard(), expressiveCode({
    styleOverrides: {
      codeFontFamily: "'Commit Mono', monospace",
      codeFontSize: '1.125rem'
    }
  }), mdx(), sitemap({
    xslURL: '/sitemap.xsl',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
    serialize(item) {
      if (/blogs\//.test(item.url)) {
        return undefined;
      }
      if (/wip-posts\//.test(item.url)) {
        return undefined;
      }
      return item;
    },
  }), svelte(), playformFormat(), playformCompress({
    SVG: false,
    CSS: {
      'csso': false,
      'lightningcss': {
        minify: true,
        targets: { chrome: 95 << 16 }
      }
    },
    HTML: {
      'html-minifier-terser': {
        minifyCSS: false,
        conservativeCollapse: true,
        removeComments: false
      }
    },
    JavaScript: {
      'terser': {
        keep_classnames: false,
        keep_fnames: false,
        mangle: true,
        toplevel: true,
        sourceMap: true,
        module: true,
        compress: { ecma: 2022 },
        format: { ecma: 2022 }
      }
    },
    Image: false // disable for now
  }), htmlStyleMinify()],

  trailingSlash: 'ignore',

  markdown: {
    remarkPlugins: [
      remarkLinkCard,
      remarkParse,
      remarkDirective,
      remarkQuoteDirective
    ],
    rehypePlugins: [
      rehypeAccessibleEmojis,
      rehypeTargetBlank,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      rehypeToc,
      rehypeSectionize,
    ],
  },

  vite: {
    define: {
      "import.meta.env.COMMIT_HASH": JSON.stringify(commitHash)
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        minify: true
      }
    },
    build: {
      cssMinify: 'lightningcss',
      sourcemap: true,
      rollupOptions: {
        external: ['fsevents', 'vite', 'rollup', /^@rollup\//]
      }
    },
    server: {
      allowedHosts: ['localhost', 'local.jbc.lol']
    },
  }
});
