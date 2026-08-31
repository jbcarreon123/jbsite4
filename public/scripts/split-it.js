const PRESETS = {
    "basic-span": { sep: "", tag: "span", attrs: "", void: false },
    "span-tag": { sep: "", tag: "span", attrs: "id='span-((i))'", void: false },
    "p-split": { sep: "\\n\\n", tag: "p", attrs: "", void: false },
    "wrap-div": { sep: "", tag: "div", attrs: "", void: false },
};

let splo;

function pChange() {
    const preset = PRESETS[document.querySelector("#pre")?.value];
    if (preset) {
        document.querySelector("#sep").value = preset.sep;
        document.querySelector("#tag").value = preset.tag;
        document.querySelector("#attrs").value = preset.attrs;
        document.querySelector("#void").checked = preset.void;
    }

    fChange();
}

function fChange() {
    const sep = document.querySelector("#sep")?.value;
    const spl = document
        .querySelector("#text-split")
        ?.value.split(sep.replaceAll("\\n", "\n"));
    const tag = document.querySelector("#tag")?.value;
    const att = document.querySelector("#attrs")?.value;
    const voi = document.querySelector("#void")?.checked;

    splo = spl.map((t, i) => {
        if (/^\s+$/.test(t)) {
            return t;
        }

        const open = `<${tag}${att ? ` ${att}` : ""}`;
        const out = voi ? `${open}/>` : `${open}>${t}</${tag}>`;
        return out.replaceAll("((i))", i).replaceAll("((v))", t);
    });

    const spli = splo.join("\n");
    const splc = splo.map((t) => (t === "" ? "\n" : t)).join("");

    document.querySelector("#out textarea#vis-t").value =
        splo ? spli : "Write something!";

    document.querySelector("#out textarea#hid-cp").value =
        splo ? splc : "Write something!";
}

function copy(el) {
    const area = document.querySelector("#hid-cp");

    area.select();
    area.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(area.value);

    el.innerHTML =
        '<span aria-hidden="true" class="ms" data-icon="check"></span> Copied to clipboard!';

    setTimeout(() => {
        el.innerHTML =
            '<span aria-hidden="true" class="ms" data-icon="content_copy"></span> Copy to Clipboard';
    }, 2500);
}
