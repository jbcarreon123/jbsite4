# jbsite4
jb's site - version 4. the one currently at the apex (jbc.lol).

## notes
this is not a template. it has a lot of stuff specific to my site, so don't base your site on it.
and the build is heavy (it generates a lot of images and burns as many cores as it can). i am serious.

## self host
you should prob not host someone else's indie site.

but if you're crazy:
- the docker image is built by ci (`.github/workflows/ci.yml`) and pushed to `ghcr.io/jbcarreon123/jbsite4`, tag `latest` (amd64 + arm64)
- docker compose is right here in the repo, exposes port 4321
- on the host you need the playwright browsers for the site previews, see the volumes in the compose file

```sh
docker compose pull && docker compose up -d
```

if ci isn't an option you can also build it on the server with `docker compose up -d --build` (needs the `dist/` from a local `pnpm run build`).

## develop
```sh
pnpm install
pnpm run dev
```

## build
it's server-side rendered (astro + @astrojs/node). the heavy pages (feeds, search index, og images, buttons, /updates) are made at build time, everything else renders when you visit it. so the build is slow, that's just how it is.

```sh
pnpm run build
pnpm run start    # runs dist/server/entry.mjs, port 4321 (set PORT to change it)
```

`pnpm run preview` works too (runs the built server).

## site previews (SBR)
the other-sites button previews are NOT made at build time. the running server renders them with chromium (via playwright) when someone asks for one, and caches each one for 12 hours in `.cache/site-prv/`. so the build doesn't need chromium, the server does.

```sh
pnpm exec playwright install chromium   # run where the server runs
```

to keep the cache warm i cron a script that just asks the running server for every preview (it does no rendering itself):

```sh
pnpm run warm:site-prv
```

```cron
17 * * * * cd /path/to/jbsite4 && node scripts/warm-site-prv.ts >> /var/log/sbr-warm.log 2>&1
```

env vars: `SBR_TTL_HOURS` (how long a preview stays cached, 12), `SBR_CONCURRENCY` (max parallel renders, 5), `SBR_BASE_URL` (which server the warmer talks to), `SBR_WARM_HOSTS` (only warm these hosts).

## typecheck
```sh
pnpm run typecheck
```

## misc
- `scripts/imgconv.ts` — one-off: converts the images under `public/imgs/` to avif
