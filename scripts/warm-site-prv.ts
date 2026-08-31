// asks the running server for every preview in public/buttons.json so cron can keep the cache warm.
// does no rendering itself. env: SBR_BASE_URL, SBR_WARM_HOSTS, SBR_WARM_CONCURRENCY, SBR_WARM_TIMEOUT_MS
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type ButtonEntry = { url: string; eighteen?: boolean };
type Outcome = 'hit' | 'rendered' | 'failed' | 'not-found' | 'other' | 'error';

const BASE = (process.env.SBR_BASE_URL ?? 'http://localhost:4321').replace(/\/+$/, '');
const CONCURRENCY = Math.max(1, Number(process.env.SBR_WARM_CONCURRENCY) || 5);
const TIMEOUT_MS = Number(process.env.SBR_WARM_TIMEOUT_MS) || 15 * 60 * 1000;
const HOST_FILTER = (process.env.SBR_WARM_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter((h) => h.length > 0);

const here = dirname(fileURLToPath(import.meta.url));
const buttons = JSON.parse(readFileSync(join(here, '../public/buttons.json'), 'utf8')) as ButtonEntry[];

// The preview slug is the hostname of the button url (see other-sites.astro).
const hosts = new Map<string, { eighteen: boolean }>();
for (const b of buttons) {
    let host: string;
    try {
        host = new URL(b.url).hostname;
    } catch {
        console.error(`[warm] skipping entry with invalid url: ${b.url}`);
        continue;
    }
    const prev = hosts.get(host);
    if (!prev || b.eighteen) hosts.set(host, { eighteen: b.eighteen ?? false });
}

const list = [...hosts.entries()].filter(([host]) => HOST_FILTER.length === 0 || HOST_FILTER.includes(host));
if (HOST_FILTER.length > 0) {
    const known = new Set(hosts.keys());
    for (const h of HOST_FILTER) {
        if (!known.has(h)) console.error(`[warm] host filter entry not in buttons.json: ${h}`);
    }
}

console.log(`[warm] ${list.length} unique hosts (${buttons.length} buttons), server ${BASE}, concurrency ${CONCURRENCY}`);

try {
    const probe = await fetch(BASE + '/', { signal: AbortSignal.timeout(10_000) });
    await probe.body?.cancel();
} catch (e) {
    console.error(`[warm] server at ${BASE} is unreachable: ${e instanceof Error ? e.message : e}`);
    console.error('[warm] start it first, e.g. `node dist/server/entry.mjs`');
    process.exitCode = 1;
    process.exit(1);
}

type Result = { host: string; outcome: Outcome; ms: number };

async function warmOne(host: string, eighteen: boolean): Promise<Result> {
    const t0 = Date.now();
    const tag = eighteen ? ' (18+)' : '';
    try {
        const res = await fetch(`${BASE}/imgs/site-prv/${host}.avif`, {
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        const ms = Date.now() - t0;
        let outcome: Outcome;
        let label: string;
        if (res.status === 404) {
            outcome = 'not-found';
            label = 'not found';
        } else if (res.status === 200 && res.headers.get('x-sbr-error') !== null) {
            outcome = 'failed';
            label = 'render failed (error page served)';
        } else if (res.status === 200) {
            outcome = res.headers.get('x-sbr-cache') === 'hit' ? 'hit' : 'rendered';
            label = outcome === 'hit' ? 'cache hit' : 'rendered';
        } else {
            outcome = 'other';
            label = `http ${res.status}`;
        }
        await res.body?.cancel();
        console.log(`[warm] ${host}${tag} -> ${label} (${ms}ms)`);
        return { host, outcome, ms };
    } catch (e) {
        const ms = Date.now() - t0;
        const isTimeout = e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError');
        const msg = isTimeout ? `timeout after ${ms}ms` : `error: ${e instanceof Error ? e.message : e}`;
        console.error(`[warm] ${host}${tag} -> ${msg}`);
        return { host, outcome: 'error', ms };
    }
}

const results: Result[] = new Array(list.length);
let next = 0;
async function worker() {
    while (next < list.length) {
        const i = next++;
        const [host, info] = list[i];
        results[i] = await warmOne(host, info.eighteen);
    }
}
const t0 = Date.now();
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, Math.max(1, list.length)) }, worker));
const totalMs = Date.now() - t0;

const count = (o: Outcome) => results.filter((r) => r.outcome === o).length;
const hits = count('hit');
const rendered = count('rendered');
const failed = count('failed') + count('other');
const missing = count('not-found');
const errors = count('error');
const min = Math.floor(totalMs / 60000);
const sec = Math.round((totalMs % 60000) / 1000);
console.log(
    `[warm] done in ${min}m${sec}s: ${hits} cached, ${rendered} re-rendered, ${failed} failed, ${missing} not found, ${errors} errors`
);

if (failed + missing + errors > 0) process.exitCode = 2;
