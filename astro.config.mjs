/**
 * @import {} from 'mdast-util-directive'
 * @import {} from 'mdast-util-to-hast'
 * @import {Root} from 'mdast'
 */

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
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import mdx from '@astrojs/mdx';
import rehypeSectionize from '@hbsnow/rehype-sectionize'
import expressiveCode from 'astro-expressive-code';
import htmlStyleMinify from './html-style-minify.ts';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import playformCompress from '@playform/compress';
import { transform } from 'lightningcss';
import rehypeToc from "@stefanprobst/rehype-extract-toc";
// @ts-ignore
import postcssColorConverter from 'postcss-color-converter';
// @ts-ignore
import lightningCss from 'postcss-lightningcss'
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import { h } from 'hastscript'
import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import { isElement } from 'hast-util-is-element';
import { parse } from 'url';
import { fromHtml } from 'hast-util-from-html'
import playformInline from '@playform/inline';
import playformFormat from '@playform/format';
import linkCard from "astro-link-card";
import ogCard from "rehype-og-card";
import embeds from 'astro-embed/integration';
import react from '@astrojs/react';
import rehypeOGCard from 'rehype-og-card';
import remarkLinkCard from 'remark-link-card';

let nkw = [];

function remarkQuoteDirective() {
  return (tree, file) => {
    function vEl(tree) {
      visit(tree, function (node) {
        if (node.type === 'element' || node.type === 'root') {
          if (node.children && node.children.length > 0) {
            vEl(node.children);
          }

          if (node.tagName === 'a') {
            if (node.properties.href.startsWith('http') || node.properties.href.startsWith('//')) {
              node.properties.target = '_blank';
              node.children.push({
                type: 'text', value: ' '
              },
                {
                  type: 'element', tagName: 'span',
                  properties: { className: ['ms'], dataIcon: ['open_in_new'] },
                })
            }
          }
        }
      })
      return tree;
    }

    visit(tree, function (node) {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'quote') return;

        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}

        data.hName = 'blockquote';
        data.hProperties = {
          class: [`quote`]
        }

        let labelNode = node.children.filter(c => c.data?.directiveLabel)[0];
        if (labelNode) {
          node.children.shift();
          let labelHast = toHast(labelNode);
          labelHast = vEl(labelHast);
          const footerNode = {
            type: 'html',
            value: toHtml(h('cite', { class: ['tg'] }, labelHast))
          };
          node.children.push(footerNode);
        }
      }
    })
  }
}

export function rehypeTargetBlank() {
  return (tree) => {
    function vEl(tree) {
      visit(tree, function (node) {
        if (node.type === 'element' || node.type === 'root') {
          if (node.children && node.children.length > 0) {
            vEl(node.children);
          }

          if (node.tagName === 'a') {
            if (node.properties.href.startsWith('http') || node.properties.href.startsWith('//')) {
              node.properties.target = '_blank';
              node.children.push({
                type: 'text', value: ' '
              },
                {
                  type: 'element', tagName: 'span',
                  properties: { className: ['ms'], dataIcon: ['open_in_new'] },
                })
            }
          }
        }
      })
      return tree;
    }

    tree = vEl(tree);
  };
}

if (process.env.GITHUB_ACTIONS === 'true') {
  nkw.push(nekoweb({
    apiKey: env.NEKOWEB_APIKEY,
    cookie: env.NEKOWEB_COOKIE,
    domain: 'jbc.lol',
    siteName: 'jbcrn',
    rssFeed: '/nekoweb.xml'
  }));
} else {
  console.debug(!(process.env.GITHUB_ACTIONS !== 'true'));
}

// https://astro.build/config
export default defineConfig({
  site: "https://jbc.lol",

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
        sourceMap: true
      }
    },
    Image: false // disable for now
  }), htmlStyleMinify(), ...nkw, react()],

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
      //rehypeFigure,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      rehypeToc,
      rehypeSectionize,
    ],
  },

  vite: {
    css: {
      postcss: {
        plugins: [
          lightningCss({ minify: true })
        ]
      }
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        minify: true
      }
    },
    build: {
      cssMinify: 'lightningcss',
      sourcemap: true
    },
    server: {
      allowedHosts: ['localhost', 'local.jbc.lol']
    },
  }
});