import { basicEditor } from "prism-code-editor/setups";
import {
    searchWidget,
    highlightSelectionMatches,
    highlightCurrentWord,
    showInvisibles,
} from "prism-code-editor/search";
import { registerCompletions } from "prism-code-editor/autocomplete";
import { cssCompletion } from "prism-code-editor/autocomplete/css";
import "prism-code-editor/prism/languages/markup";
import "prism-code-editor/prism/languages/css";
import { minify } from "csso";
import cssbeautify from "cssbeautify";
import Parser, { type Item as RssItem } from "rss-parser";

declare global {
    // Defined in the inline script of src/components/NotifModal.astro
    function createNotif(title: string, desc: string): void;
}

const DEFAULT_CSS = `/*
    Don't use this file to edit your site style! Create a different CSS file for that.
    This file defines how custom elements (like sitebox) will look like.
    Setting CSS that breaks main nekoweb site on purpose is prohibited and may result in ban and site deletion!
*/

/* Must start with ".site-box". Change how your website will appear on main nekoweb site: https://lune.dimden.dev/405a44b7e5.png */
.site-box {
    text-align: center;
    background-image: url(/assets/cookiebox.png); /* Only nekoweb URLs allowed, use full url to your site like https://example.nekoweb.org/images/coolbg.png */
    background-repeat: no-repeat;
    color: #b08271;
    font-size: 12px;
}
.site-box > a > p {
    color: var(--darkbrown);
    font-weight: bold;
}
.site-box > a > span {
    color: var(--darkbrown);
}

/* Style for your post box (must start with ".post-box") */
.post-box {
    background-color: #fff2cc;
    border: 4px solid #ecbfa6;
    padding: 15px;
    border-radius: 5px;
    color: #634c53;
    font-weight: normal;
}

.post-box .post-title {
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 0px;
}`;

function q<T extends Element>(sel: string): T {
    return document.querySelector(sel) as T;
}

interface Metadata {
    domain: string;
    overflow: boolean;
    rss?: string;
    readonly readonly: boolean;
}

function loadMetadata(
    css: string,
): { data: Metadata; css: string } | null {
    const regex = /^\/\*!@nkb (.+) \*\/(?:\n?.*)*/dgimsvy;
    const excludeRegex = /^\/\*!@nkb .+ \*\/\n?/dgimsvy;
    try {
        return {
            data: JSON.parse(css.replace(regex, "{$1}")),
            css: unMinifyCss(css.replace(excludeRegex, "")),
        };
    } catch {
        return null;
    }
}

function exportMetadata(metadata: Metadata): string {
    const regex = /{(.+)}/;
    const data = JSON.stringify(metadata);
    return data.replace(regex, "/*!@nkb $1 */");
}

function getMetadata(): Metadata {
    return {
        domain: q<HTMLInputElement>('input[type="text"]#domain').value,
        rss: q<HTMLInputElement>('input[type="text"]#rss').value,
        overflow: q<HTMLInputElement>(
            'input[type="checkbox"]#overflow',
        ).checked,
        readonly: q<HTMLInputElement>(
            'input[type="checkbox"]#readonly',
        ).checked,
    };
}

function minifyCSS(css: string): string {
    try {
        return minify(css, {
            restructure: false,
        }).css;
    } catch (error) {
        console.error("Error minifying CSS:", error);
        return css;
    }
}

function unMinifyCss(css: string) {
    try {
        return cssbeautify(css);
    } catch (error) {
        console.error("Error minifying CSS:", error);
        return css;
    }
}

function htmlEscape(text: string) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function textToKilobytes(text: string) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text).length;
    const kilobytes = bytes / 1024;
    return kilobytes.toFixed(2);
}

function replaceInvalidCSS(cssString: string | null | undefined) {
    if (!cssString) return "";
    const urlRegex1 =
        /(url\("?'?(?:https:)?\/\/)((?:[\w\-]+).nekoweb.org\/([\S]+\)))/gm;
    const regex = /^(?!\.site-box|\.follow|\.post-box).*{/gm;
    let c = cssString.replace(
        regex,
        "/* This will not work in Nekoweb, unfortunately. */\n#WILL-NOT-WORK {",
    );
    c = c.replace(urlRegex1, "$1$3");
    return c;
}

function lint(css: string) {
    let lines: {
        line: number;
        entry: string;
        reason: "selector" | "link";
    }[] = [];
    const regex = /^(?!\.site-box|\.follow|\.post-box).*{/gm;
    const linkRegex =
        /(^.+url)\((?!["']?(?:(?:https?:)\/\/([a-z0-9A-Z\-]+\.)?nekoweb\.org)|(?:\/)).+(\);?)/gm;
    let clines = css.split("\n");
    clines.forEach((s, i) => {
        if (regex.test(s)) {
            if (/{ ?$/.test(s)) {
                lines.push({
                    line: i + 1,
                    entry: htmlEscape(s.match(regex)![0]),
                    reason: "selector",
                });
            }
        } else if (linkRegex.test(s)) {
            if (!/^\//.test(s.replace(linkRegex, "$1"))) {
                lines.push({
                    line: i + 1,
                    entry: htmlEscape(s.replace(linkRegex, "$1")),
                    reason: "link",
                });
            }
        }
    });
    if (lines.length > 0) {
        q<HTMLDivElement>("#nb-errors div").innerHTML = lines
            .map((v) => {
                switch (v.reason) {
                    case "link":
                        return `<p>(${v.line}) URL not allowed: ${v.entry}. Nekoweb elements.css does not support anything beyond [sitename].nekoweb.org.</p>`;
                    default:
                        if (v.entry.startsWith("@")) {
                            return `<p>(${v.line}) Unrecognized selector: ${v.entry.replace(/ { ?$/, "")}. Nekoweb does not support @at-rules as of now.</p>`;
                        } else {
                            return `<p>(${v.line}) Unrecognized selector: ${v.entry.replace(/ { ?$/, "")}. Please make sure that every entry on the elements.css starts with '.site-box' for the sitebox and '.post-box' for the postbox.</p>`;
                        }
                }
            })
            .join("");
    } else {
        q<HTMLDivElement>("#nb-errors div").innerHTML =
            `<p>No errors found for now.</p>`;
    }
    q<HTMLButtonElement>("#nb-error-btn").innerHTML =
        `Errors (${lines.length})`;
}

function renderPreview(css: string, value: string) {
    document.querySelector("#user-style")!.innerHTML = replaceInvalidCSS(css);
    lint(value);
    q<HTMLTextAreaElement>("textarea#nb-validate-textarea").value = value;
}

async function load() {
    let url = prompt("elements.css path?");
    if (url) {
        try {
            let res = await fetch(url);
            if (res.ok) {
                let isMetadata = applyLoadedCss(url, await res.text());
                createNotif(
                    "Loaded, reloading...",
                    isMetadata
                        ? "Loaded from Nekoweb Metadata Format"
                        : `Domain: ${new URL(url).hostname}`,
                );
                window.location.reload();
            } else {
                createNotif(
                    `Can't fetch ${url}`,
                    `Server returned ${res.status} (${res.statusText})`,
                );
            }
        } catch (e) {
            createNotif(
                `Can't fetch ${url}`,
                `${e}\n\nMost likely, this is a CORS error. Try setting jbc.lol on your Access-Control-Allow-Origin header.`,
            );
        }
    }
}

async function loadUrl(url: string) {
    if (url) {
        try {
            let res = await fetch(url);
            if (res.ok) {
                applyLoadedCss(url, await res.text());
                window.location.search = "";
            } else {
                createNotif(
                    `Can't fetch ${url}`,
                    `Server returned ${res.status} (${res.statusText})`,
                );
            }
        } catch (e) {
            createNotif(
                `Can't fetch ${url}`,
                `${e}\n\nMost likely, this is a CORS error. Try setting jbc.lol on your Access-Control-Allow-Origin header.`,
            );
        }
    }
}

// applies fetched elements.css to localStorage. true if it was the metadata format
function applyLoadedCss(url: string, css: string): boolean {
    let m = loadMetadata(css);
    if (m) {
        localStorage.setItem("nekobox:value", m.css);
        localStorage.setItem("nekobox:domain", m.data.domain);
        localStorage.setItem(
            "nekobox:overflow",
            `${m.data.overflow}`,
        );
        localStorage.setItem(
            "nekobox:readonly",
            `${m.data.readonly}`,
        );
        localStorage.setItem("nekobox:rss", `${m.data.rss}`);
    } else {
        localStorage.setItem("nekobox:value", unMinifyCss(css));
        localStorage.setItem("nekobox:domain", new URL(url).hostname);
        localStorage.setItem(
            "nekobox:overflow",
            `${!url.includes("nekoweb.org")}`,
        );
        localStorage.setItem("nekobox:readonly", `false`);
        localStorage.setItem("nekobox:rss", ``);
    }
    return !!m;
}

let params = new URLSearchParams(window.location.search);
if (params.has("load")) {
    void loadUrl(decodeURIComponent(params.get("load") ?? ""));
} else if (params.has("domain")) {
    void loadUrl(`https://${params.get("domain")}/elements.css`);
}

if (window.matchMedia("(display-mode: standalone)").matches) {
    document.querySelector(".nkb-info")?.remove();
    document.querySelector(".home")?.remove();
    document.querySelector("footer")?.remove();
    let h1 = document.querySelector("h1:not(.style-broken)") as
        | HTMLElement
        | null;
    console.log(h1);
    if (h1) h1.style = "font-size: 2em;";
    if (h1) h1.textContent = h1.textContent + " (via PWA)"
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/nekobox-service.js")
            .then((registration) => {
                console.log("Service Worker registered:", registration);
            })
            .catch((error) => {
                console.error(
                    "Service Worker registration failed:",
                    error,
                );
            });
    });
}

if (localStorage.getItem("nekobox:username")) {
    const result =
        confirm(`Do you want to migrate to the new Nekoweb routing system?
            
It will make your username (${localStorage.getItem("nekobox:username")}) to the domain (${localStorage.getItem("nekobox:username")}.nekoweb.org). If you have a custom domain, change it on Settings.

Are you okay?`);
    if (result) {
        let username = localStorage.getItem("nekobox:username");
        localStorage.setItem(
            "nekobox:domain",
            username + ".nekoweb.org",
        );
        localStorage.removeItem("nekobox:username");
        createNotif("Successfully migrated", "Reloading...");
        window.location.reload();
    }
}

let s =
    localStorage.getItem("nekobox:value") || cssbeautify(DEFAULT_CSS);

q<HTMLInputElement>('input[type="text"]#domain').value =
    localStorage.getItem("nekobox:domain") ?? "jbc.lol";
q<HTMLInputElement>('input[type="text"]#rss').value =
    localStorage.getItem("nekobox:rss") ?? "";
q<HTMLInputElement>('input[type="checkbox"]#overflow').checked =
    localStorage.getItem("nekobox:overflow") === "true";
q<HTMLElement>("#nkb-readonly").style.display =
    localStorage.getItem("nekobox:readonly") === "true"
        ? "block"
        : "none";

const editor = basicEditor(
    "#nekobox-editor",
    {
        language: "css",
        theme: "github-dark",
        value: s,
        readOnly: localStorage.getItem("nekobox:readonly") === "true",
    },
    () => {
        renderPreview(s, s);
    },
);

registerCompletions(["css"], {
    sources: [cssCompletion()],
});

editor.addExtensions(
    highlightSelectionMatches(),
    searchWidget(),
    highlightCurrentWord(),
    showInvisibles(),
);

editor.on("update", (value) => {
    let val = `${exportMetadata(getMetadata())}
${value}`;

    renderPreview(value.replaceAll(/\n.follow ?{/gm, "\n.no {"), value);
    document.querySelector("#cssSize")!.innerHTML =
        `${textToKilobytes(val)}KB used (${textToKilobytes(minifyCSS(val))}KB when minified)`;

    localStorage.setItem("nekobox:value", value);
});

function copy(el: Element, isMinified = false) {
    let val = `${exportMetadata(getMetadata())}
${editor.value}`;

    if (isMinified) {
        val = minifyCSS(val);
    }

    navigator.clipboard.writeText(val).then();
    let o = el.textContent;
    el.textContent = "Copied!";
    setTimeout(() => (el.textContent = o), 2000);
}

let timeout: ReturnType<typeof setTimeout> | undefined;
let rssItems: RssItem[] = [];
let rssOld = "";
let userOld = "";

function renderFeedItem(frs: RssItem) {
    document.querySelector("#feed-style")!.innerHTML = frs.style
        ? frs.style
        : "";
    document.querySelector("#NOTUSEDINNEKOWEB_feeddate")!.textContent =
        new Date(frs.isoDate as string).toLocaleDateString(undefined, {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
    document.querySelector("#NOTUSEDINNEKOWEB_feedtitle")!.textContent =
        frs.title as string;
    document.querySelector("#NOTUSEDINNEKOWEB_feeddesc")!.textContent =
        frs.content as string;
    q<HTMLAnchorElement>("#NOTUSEDINNEKOWEB_posturl").href =
        frs.link as string;
}

async function fChange(el: HTMLFormElement) {
    let overflow = (
        el.querySelector(
            'input[type="checkbox"]#overflow',
        ) as HTMLInputElement
    ).checked;

    let presite = document.querySelector(".pre-site") as HTMLDivElement;
    let prepost = document.querySelector(".pre-post") as HTMLDivElement;
    if (!overflow) {
        presite.style.overflow = "hidden";
        prepost.style.overflow = "hidden";
    } else {
        presite.style.removeProperty("overflow");
        prepost.style.removeProperty("overflow");
    }

    let domain = (
        el.querySelector('input[type="text"]#domain') as HTMLInputElement
    ).value;
    let rss = (
        el.querySelector('input[type="text"]#rss') as HTMLInputElement
    ).value;

    localStorage.setItem("nekobox:overflow", `${overflow}`);
    localStorage.setItem("nekobox:domain", domain ?? "");
    if (domain) {
        q<HTMLAnchorElement>("#NOTUSEDINNEKOWEB_url").href =
            "//" + domain;
        q<HTMLAnchorElement>("#NOTUSEDINNEKOWEB_posturl").href =
            "//" + domain;
        document.querySelector(
            "#NOTUSEDINNEKOWEB_siteurl",
        )!.textContent = `${domain}`;
    }

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
        if (domain !== userOld) {
            userOld = domain;
            let res = await fetch(
                "https://nekoweb.org/api/site/info/" + domain,
            );
            localStorage.setItem("nekobox:domain", domain);

            let json = await res.json();
            q<HTMLAnchorElement>("#NOTUSEDINNEKOWEB_url").href =
                domain ? "//" + domain : `//${domain}.nekoweb.org/`;
            q<HTMLAnchorElement>("#NOTUSEDINNEKOWEB_posturl").href =
                domain ? "//" + domain : `//${domain}.nekoweb.org/`;
            q<HTMLImageElement>("#NOTUSEDINNEKOWEB_screenshot").src =
                `//nekoweb.org/screenshots/${domain}/index_large.avif`;
            document.querySelector(
                "#NOTUSEDINNEKOWEB_siteurl",
            )!.textContent = domain
                ? `${domain}`
                : `${domain}.nekoweb.org`;
            document.querySelector(
                "#NOTUSEDINNEKOWEB_sitetitle",
            )!.textContent = json.title;
            document.querySelector(
                "#NOTUSEDINNEKOWEB_sitedomain",
            )!.textContent = domain;
        }

        if (rss && rssOld !== rss) {
            let f = await fetch(rss);
            rssOld = rss;
            if (f.ok) {
                let p = new Parser({
                    customFields: {
                        item: ["style"],
                    },
                });
                p.parseString(await f.text(), (error, feed) => {
                    rssItems = feed.items;
                    console.debug(feed);
                    renderFeedItem(feed.items[0]);

                    let rssopt = document.querySelector(
                        ".nb-form #rsspost",
                    ) as HTMLSelectElement;
                    rssopt.innerHTML = feed.items
                        .map(
                            (v, i) =>
                                `<option value="${i}">${v.title}</option>`,
                        )
                        .join("");
                    rssopt.value = "0";
                });
            }
        }

        localStorage.setItem("nekobox:rss", rss ?? "");
    }, 1000);

    let rssopt = document.querySelector(
        ".nb-form #rsspost",
    ) as HTMLSelectElement;
    let val = Number(rssopt.value);
    let frs = rssItems[val];
    if (frs) {
        renderFeedItem(frs);
    }
}

let form = document.querySelector("form.nb-form") as HTMLFormElement;
form?.addEventListener("change", () => fChange(form));

let cp = document.querySelector("#copy");
let cpMin = document.querySelector("#copyMin");
let sv = document.querySelector("#load");
cp?.addEventListener("click", () => copy(cp!));
cpMin?.addEventListener("click", () => copy(cpMin!, true));
sv?.addEventListener("click", async () => await load());

document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector("form.nb-form");
    setTimeout(() => fChange(form as HTMLFormElement), 250);

    const follow = document.querySelector(".follow") as
        | HTMLSpanElement
        | null;
    follow?.addEventListener("click", (ev) => {
        ev.preventDefault();
        follow.classList.toggle("following");
        if (follow.classList.contains("following")) {
            follow.textContent = "[-]";
            follow.title = "Unfollow";
        } else {
            follow.textContent = "[+]";
            follow.title = "Follow";
        }
    });
});

document.addEventListener("mousemove", (ev) => {
    let ins = document.querySelector("#inspect") as HTMLInputElement;
    if (!ins.checked) return;
    let tl = document.querySelector("#nkb-insp") as HTMLDivElement;
    let ov = document.querySelector("#nkb-insp-ovr") as HTMLDivElement;
    let brect = document
        .querySelector("#nekobox-tab-container")!
        .getBoundingClientRect();
    tl.style.top = ev.clientY + 10 + "px";
    tl.style.left = ev.clientX + 10 + "px";

    let sb = document.querySelector("#nb-sitebox");
    let pb = document.querySelector("#nb-postbox");
    let el = document.elementFromPoint(ev.clientX, ev.clientY);

    if (
        (sb?.contains(el) || pb?.contains(el)) &&
        !el?.id.includes("sitebox") &&
        !el?.id.includes("postbox")
    ) {
        tl.style.display = "block";
        ov.style.display = "block";
        let rect = el?.getBoundingClientRect();
        tl.innerHTML = `
                    <p class="small">${el?.tagName.toLowerCase()}${el?.id && !el.id.includes("NOTUSEDINNEKOWEB") ? `#${el.id}` : ""}${
            el?.className
                ? `${el?.className
                      .split(" ")
                      .map((e) =>
                          e.includes("post-jbcarreon123") ||
                          e.includes("noreset")
                              ? ""
                              : `.${e}`,
                      )
                      .join("")}`
                : ""
        }</p>
                    <p>${Math.round(rect?.width ?? NaN)}x${Math.round(rect?.height ?? NaN)}</p>
                `;
        if (rect) {
            ov.style.top = rect.top - brect.top + "px";
            ov.style.left = rect.left - brect.left + "px";
            ov.style.width = rect?.width + "px";
            ov.style.height = rect?.height + "px";
        }
    } else {
        tl.style.display = "none";
        ov.style.display = "none";
    }
});
