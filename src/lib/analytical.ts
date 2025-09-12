// Analytical by jbcarreon123
// Analytics, without phoning home

export class AnalyticalData {
    dateFirstViewed: Date = new Date();
    totalTimeVisited: number = 0;
    streaks: number = 0;
    linksClicked: AnalyticalLinksClicked[] = [];
    pagesViewed: AnalyticalPagesViewed[] = [];
    internal: {
        streakData: Date[]
    } = {
            streakData: []
        }
}

export class AnalyticalLinksClicked {
    url: URL;
    times: number = 0;
    lastClicked: Date = new Date();

    constructor(url: URL) {
        this.url = url;
    }
}

export class AnalyticalPagesViewed {
    url: URL;
    times: number = 0;
    lastViewed: Date = new Date();
    pageData?: any;

    constructor(url: URL) {
        this.url = url;
    }
}

export class Analytical {
    data: AnalyticalData;

    constructor() {
        try {
            this.data = JSON.parse(localStorage.getItem('alyt:analytics') ?? '');
            this.data.dateFirstViewed = new Date(this.data.dateFirstViewed);
            this.data.linksClicked = this.data.linksClicked.map(l => ({
                ...l,
                url: new URL(l.url),
                lastClicked: new Date(l.lastClicked)
            } as AnalyticalLinksClicked))
            this.data.pagesViewed = this.data.pagesViewed.map(p => ({
                ...p,
                url: new URL(p.url),
                lastViewed: new Date(p.lastViewed)
            } as AnalyticalPagesViewed))
            this.data.internal.streakData = this.data.internal.streakData.map(d => new Date(d));
        } catch {
            this.data = new AnalyticalData();
            this.saveData();
        }

        setInterval(() => {
            document.querySelectorAll('a').forEach(el => {
                const url = this.stripQueriesAndHashes(new URL(el.href));
                if (el.dataset.alytEvent || this.stripQueriesAndHashes(new URL(window.location.href)) === url) return;
                el.addEventListener('click', () => this.linkClicked(url));
                el.dataset.alytEvent = 'true';

                // ext
                if (new URL(el.href).hostname !== window.location.hostname && !el.hasAttribute('target') && /\/posts\/\w/.test(window.location.pathname)) {
                    el.setAttribute('target', '_blank');
                }

                if (el.dataset.mainSite === "true") {
                    el.href = "https://jbc.lol" + new URL(el.href).pathname
                }
            })
        }, 500)
    }

    private addDays(date: Date, days: number) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    private saveData() {
        localStorage.setItem('alyt:analytics', JSON.stringify(this.data));
        console.log("analytical, saved:", this.data);
    }

    private stripQueriesAndHashes(u: URL) {
        const url = u;
        if (!!url.hash) url.hash = '';
        if (!!url.search) url.search = '';
        return url;
    }

    private handleStreaks() {
        const dateRn = new Date();
        const latestDate = this.data.internal.streakData.findLast(() => true);
        if (
            !latestDate ||
            dateRn.toLocaleDateString() === this.addDays(latestDate, 1).toLocaleDateString()
        ) {
            this.data.streaks += 1;
            this.data.internal.streakData.push(dateRn);
        } else if (dateRn.getTime() > this.addDays(latestDate, 2).getTime()) {
            this.data.streaks = 0;
            this.data.internal.streakData = [];
        }

        this.saveData();
    }

    pageLoad(url: URL, data?: any) {
        const lastPage = this.data.pagesViewed.findLast(() => true);
        const dateRn = new Date();
        /*if (
            !lastPage ||
            (
                dateRn.getTime() < (new Date(lastPage.lastViewed).getTime() + 600000) &&
                this.stripQueriesAndHashes(url) === lastPage.url
            ) || (
                dateRn.getTime() < (new Date(lastPage.lastViewed).getTime() + 30000) &&
                this.stripQueriesAndHashes(url) !== lastPage.url
            )
        ) {*/
            const page = this.data.pagesViewed.find(p => new URL(p.url).href === this.stripQueriesAndHashes(url).href) ?? new AnalyticalPagesViewed(this.stripQueriesAndHashes(url));
            const pageIndex = this.data.pagesViewed.indexOf(page);
            page.times += 1;
            page.lastViewed = new Date();
            page.pageData = data;

            console.log("page saved", pageIndex, this.data.pagesViewed[pageIndex], page);

            if (pageIndex > -1)
                this.data.pagesViewed[pageIndex] = page;
            else
                this.data.pagesViewed.push(page);

            this.data.totalTimeVisited += 1;

            this.handleStreaks();
            this.saveData();
        //}
    }

    linkClicked(url: URL) {
        const lastPage = this.data.linksClicked.findLast(() => true);
        const dateRn = new Date();
        /*if (
            !lastPage ||
            (
                this.stripQueriesAndHashes(url) !== lastPage.url &&
                (
                    dateRn.getTime() < (new Date(lastPage.lastClicked).getTime() + 30000) &&
                    this.stripQueriesAndHashes(url) !== lastPage.url
                )
            )
        ) {*/
            const page = this.data.linksClicked.find(p => new URL(p.url).href === this.stripQueriesAndHashes(url).href) ?? new AnalyticalLinksClicked(this.stripQueriesAndHashes(url));
            const pageIndex = this.data.linksClicked.indexOf(page);
            page.times += 1;
            page.lastClicked = new Date();

            if (pageIndex > -1)
                this.data.linksClicked[pageIndex] = page;
            else
                this.data.linksClicked.push(page);

            this.data.totalTimeVisited += 1;

            this.saveData();
        //}
    }
}

// so i can debug analytical lol
//@ts-ignore
window.Analytical = Analytical