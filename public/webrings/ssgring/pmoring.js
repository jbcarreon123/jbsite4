; (async (s) => {
    let config = (await import('https://jbcarreon123.github.io/webrings/ssgring/pmoring.config.js')).default,
        h = config.value,
        i = config.list.findIndex(v => v[config.match] === h);

    function extractAllContentBetweenBraces(str) {
        const contents = [];
        let current = '';
        let depth = 0;

        for (const char of str) {
            if (char === '{') {
                if (depth > 0) {
                    current += char;
                }
                depth++;
                if (depth === 1) {
                    current = '';
                }
            } else if (char === '}') {
                depth--;
                if (depth === 0) {
                    contents.push(current);
                } else {
                    current += char;
                }
            } else if (depth > 0) {
                current += char;
            }
        }

        return contents;
    }

    const generateB64UniqueIDBrowser = () => {
        console.log('%c WARNING', 'color: yellow; font-size: 32px;')
        console.log('%c SSGRing detected that crypto.randomUUID() is not defined. It will still work, albeit it\'ll use a fallback (which is from UUID to now Base64 randomness). This is likely caused by you visiting this page in HTTP, not HTTPS, and note that some webring scripts might not work in HTTP.', 'font-size: 16px;')
        return btoa(Date.now().toString(36) + Math.random().toString(36).substr(2))
    };

    async function asyncReplace(str, asyncFn) {
        const matches = extractAllContentBetweenBraces(str);
        console.log(matches)
        const replacements = await Promise.all(matches.map(m => asyncFn(m.trim())));
        for (let i = 0; i < matches.length; i++) {
            str = str.replace(`{${matches[i]}}`, replacements[i]);
        }
        return str;
    }

    let widgetHtml = config.defaultWidget;
    if (i > -1) {
        const ctx = {
            prev: config.list.at(i - 1) ?? config.list.at(config.list.length - 1),
            next: config.list.at(i + 1) ?? config.list.at(0),
            index: i,
            random: config.list[Math.floor(Math.random() * config.list.length)],
            list: config.list,
            item: config.list[i]
        };

        async function evaluateExpression(expr) {
            const keys = Object.keys(ctx);
            const values = Object.values(ctx);
            try {
                const asyncFunc = new Function(...keys, `return (async () => { return ${expr} })();`);
                return await asyncFunc(...values);
            } catch (error) {
                console.error("Error evaluating expression:", expr, error);
                return "";
            }
        }

        widgetHtml = await asyncReplace(config.widget, evaluateExpression);
    }

    const widget = document.createElement('div');
    widget.id = 'pmoring';
    widget.dataset.pmoId = crypto.randomUUID ? crypto.randomUUID() : generateB64UniqueIDBrowser();
    widget.innerHTML = widgetHtml;
    widget.classList.value = `${s?.classList.value}`
    s?.parentElement?.insertBefore(widget, s);

    const style = document.createElement('style');
    style.innerHTML = config.style.replace(/:webring/g, `*[data-pmo-id="${widget.dataset.pmoId}"]`);
    document.head.appendChild(style);

    s?.remove();
})(document.currentScript);