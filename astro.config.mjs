// @ts-check
import { defineConfig, envField, passthroughImageService } from 'astro/config';
import { loadEnv } from "vite";
import nekoweb from "@indiefellas/astro-adapter-nekoweb";
import svelte from '@astrojs/svelte';
// import remarkToc from 'remark-toc';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { env } from 'node:process';
// @ts-ignore
import rehypeFigure from 'rehype-figure';
import serviceWorker from "astrojs-service-worker";
import mdx from '@astrojs/mdx';
import rehypeSectionize from '@hbsnow/rehype-sectionize'
import expressiveCode from 'astro-expressive-code';
import htmlStyleMinify from './html-style-minify.ts';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import playformCompress from '@playform/compress';
import { transform } from 'lightningcss';
import rehypeToc from "@stefanprobst/rehype-extract-toc";

let nkw = [];

if (process.env.GITHUB_ACTIONS === 'true') {
  nkw.push(nekoweb({
    apiKey: env.NEKOWEB_APIKEY,
    cookie: env.NEKOWEB_COOKIE,
    folder: 'jbsite4_test'
  }));
} else {
  console.log(!(process.env.GITHUB_ACTIONS !== 'true'));
}

// https://astro.build/config
export default defineConfig({
  site: "https://jbcarreon123.nekoweb.org",

  scopedStyleStrategy: 'class',

  prefetch: {
    prefetchAll: true
  },

  build: {
    concurrency: 6,
    assets: '_jbsite4'
  },

  image: {
    service: passthroughImageService()
  },

  integrations: [expressiveCode({
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
      return item;
    },
  }), svelte(), playformCompress({
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
        toplevel: true
      }
    },
    Image: (process.env.GITHUB_ACTIONS === 'true')
  }), htmlStyleMinify(), ...nkw],

  trailingSlash: 'always',

  markdown: {
    rehypePlugins: [
      rehypeAccessibleEmojis,
      [rehypeExternalLinks, {
        rel: ['nofollow'], target: '_blank',
        content: {
          type: 'element', tagName: 'span',
          properties: { ariaHidden: "true" },
          children: [
            {
              type: 'text', value: ' '
            },
            {
              type: 'element', tagName: 'span',
              properties: { className: ['ms'], dataIcon: ['open_in_new'] },
            }
          ]
        }
      }
      ],
      rehypeFigure,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      rehypeToc,
      rehypeSectionize,
    ],
  },

  vite: {
    css: {
      transformer: 'lightningcss'
    }
  }
});