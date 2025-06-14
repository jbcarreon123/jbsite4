// src/pages/og.png.ts
import type { APIRoute } from "astro";
import { satoriAstroOG } from "satori-astro";
import { html } from "satori-html";
import { readFileSync, existsSync } from 'node:fs';
import { fromStore } from "svelte/store";

const posts = Object.values(import.meta.glob('../posts/**/*.md', { eager: true }));

export const trailingSlash = 'never';

export function getStaticPaths() {
	return posts.map((val) => {
		let path = val.url.split('/');
		let slug = path[path.length - 2];
		return { params: { slug: slug + '.png' } }
	})
}

export const GET: APIRoute = async ({ params }) => {
	const post = posts.find((val) => val.url.includes('posts/' + params.slug?.replace('.png', '')))
	let img = '';

	if (existsSync('./public/imgs/posts/' + params.slug?.replace('.png', '') + '/banner.png')) {
		img = 'data:image/png;base64,' + readFileSync('./public/imgs/posts/' + params.slug?.replace('.png', '') + '/banner.png', {encoding: 'base64'});
	}

	return await satoriAstroOG({
		template: html`
			<div class="container">
				<div class="bg-image"></div>
				<div class="info">
					<p class="tg">${post.frontmatter.tags.split(/, ?/).map((t) => `#${t}`).join(' ')}</p>
					<h1>${post.frontmatter.title}</h1>
					<p>${post.frontmatter.description}</p>
				</div>
			</div>

			<style slot="head">
				.container {
					position: relative;
					background-color: #1d1f20;
					width: 100%;
					height: 100%;
					display: flex;
				}

				.bg-image {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					display: flex;
					background-position:bottom;
					background-size: cover;
					background-repeat: no-repeat;
					opacity: 0.25;
					${img ? `background-image: url(${img});` : ''}
					z-index: 0;
				}

				.info {
					display: flex;
					z-index: 1;
					font-family: 'Inter', sans-serif;
					flex-direction: column;
					font-size: 2em;
					padding: 36px;
					height: 100%;
					justify-content: center;
				}

				h1 {
					font-size: 3em;
					line-height: 1em;
				}

				.info > * {
					padding: 0;
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
	}).toResponse({
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
};