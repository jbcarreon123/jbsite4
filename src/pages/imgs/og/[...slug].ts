// src/pages/og.png.ts
import type { APIRoute } from "astro";
import { satoriAstroOG } from "satori-astro";
import { html } from "satori-html";
import { readFileSync, existsSync } from 'node:fs';
import { fromStore } from "svelte/store";
import { HTMLRewriter } from "@worker-tools/html-rewriter";
import { experimental_AstroContainer } from "astro/container";
import { getContainerRenderer as svelteContainerRenderer } from "@astrojs/svelte";
import { loadRenderers } from "astro:container";
import * as cheerio from 'cheerio';
import sharp from "sharp";
const renderers = await loadRenderers([svelteContainerRenderer()]);
const container = await experimental_AstroContainer.create({
    renderers
})

const posts = Object.values(import.meta.glob('../../posts/**/*.md', { eager: true }));
const pages = Object.values(import.meta.glob('../../**/*.astro', { eager: true }));
const pagesRendered = await Promise.all(pages.map(async (p) => ({ html: await container.renderToString(p.default), url: p.url })));
const pagesTitles = pagesRendered.map(v => ({ ...getTitle(v.html), url: (!!v.url ? v.url : '/index') }));

const placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzM1M2I0MSIvPjxwYXRoIGZpbGw9IiMyMjI2MmEiIGQ9Ik0wIDBoMTB2MTBIMHpNMTAgMTBoMTB2MTBIMTB6Ii8+PC9zdmc+";

console.log(pagesTitles);

function getTitle(html: string) {
	const c = cheerio.load(html);
	const t = c('title').text();
	const d = c('meta[name="description"]').attr('content');
	return { title: !!t ? t : "jb's site", description: !!d ? d : '' };
}

export const trailingSlash = 'never';

export function getStaticPaths() {
	const paths = [
		...posts.map((val) => {
			return { params: { slug: val.url + '.webp' } }
		}),
		...pagesTitles.map(v => {
			return { params: { slug: v.url + '.webp' } }
		})
	];
	return paths
}

export const GET: APIRoute = async ({ params }) => {
	let page = pagesTitles.find((val) => val.url.replace('/', '') === params.slug?.replace('.webp', ''));
	let post = posts.find((val) => val.url.replace('/', '') === params.slug?.replace('.webp', ''));
	let img = '';

	if ((!post || !post.frontmatter) && (!page)) return new Response(null);

	let chunk = post.frontmatter.background.split('.');
	let format = chunk[chunk.length - 1];
	if (existsSync('./public' + post.frontmatter.background)) {
		img = `data:image/png;base64,` + (await sharp(readFileSync('./public' + post.frontmatter.background)).png().toBuffer()).toString('base64');
	}

	let output = await satoriAstroOG({
	template: html`
			<div class="container">
				<div class="placeholder"></div>
				<img src="${!!img ? img : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}" />
				<div class="info">
					<p class="tg">https://<b>jbc.lol</b>${(page?.url === '/index' ? '/' : page?.url) ?? post.url}</p>
					<div class="title">
						<h1>${page?.title ?? post?.frontmatter.title}</h1>
					</div>
				</div>
			</div>

			<style slot="head">
				div {
					display: flex;
				}

				.title {
					display: flex;
					flex-direction: column;
				}

				.title > p {
					margin-top: 5px;
					margin-bottom: 0;
				}

				.container {
					position: relative;
					background-color: #1d1f20;
					width: 100vw;
					height: 100vh;
					display: flex;
					padding: 36px;
				}

				.placeholder { 
					position: absolute;
					inset: 0;
					background-image: url(${!!img ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' : placeholder});
					width: 100vw;
					height: 100vh;
					background-size: 150px 150px;
					opacity: 0.5;
				}

				img {
					height: auto;
					width: 100vw;
					height: 100vh;
					object-fit: cover;
					position: absolute;
					opacity: 0.25;
					left: 0;
					top: 0;
					image-rendering: pixelated;
				}

				.info {
					position:relative;
					display: flex;
					font-family: 'Inter', sans-serif;
					flex-direction: column;
					font-size: 2.5em;
					height: 100%;
					justify-content: space-between;
				}

				h1 {
					font-size: 2.5em;
					padding: 0;
					margin: 0;
					line-height: 1em;
				}

				.info > * {
					width: 100%;
					margin: 0;
					color: #f1f3f5;
				}

				.tg {
					font-size: 0.65em;
					color: #ced4da;
					text-transform: uppercase;
				}
			</style>
		`,
		width: 1200,
		height: 630,
	}).toImage({
		satori: {
			fonts: [
				{
					name: "Inter",
					data: readFileSync('./public/fonts/Inter-Regular.woff'),
					weight: 400,
					style: "normal",
				},
				{
					name: "Inter",
					data: readFileSync('./public/fonts/Inter-SemiBold.woff'),
					weight: 700,
					style: "normal",
				},
			],
			
		},
	});

	return new Response( await sharp(output).webp().toBuffer(), { headers: { 'Content-Type': 'image/webp' } } )
};