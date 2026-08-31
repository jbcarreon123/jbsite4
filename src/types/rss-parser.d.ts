// ambient types for rss-parser (ships none). kept loose, items carry custom fields
declare module "rss-parser" {
    export interface Item {
        title?: string;
        link?: string;
        isoDate?: string;
        content?: string;
        contentSnippet?: string;
        summary?: string;
        [key: string]: string | undefined;
    }

    export interface Output {
        title?: string;
        link?: string;
        items: Item[];
    }

    export interface Options {
        customFields?: {
            feed?: string[];
            item?: string[];
        };
    }

    export default class Parser {
        constructor(options?: Options);
        parseString(data: string): Promise<Output>;
        parseString(
            data: string,
            callback: (err: Error | null, feed: Output) => void,
        ): void;
        parseURL(url: string): Promise<Output>;
    }
}
