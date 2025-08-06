import { ALLOWED_HOSTS } from "../../consts/hosts";
import TiktokProcessor from "../tiktok/TiktokProcessor";
import YoutubeDLProcessor from "../ytdlp/YoutubeDLProcessor";
import { Logger } from "../../logger";
import { logger, type FileContent } from "discordeno";

export default class LinkProcessor {
    private static logger = Logger.getLogger(['lib', 'link', 'LinkProcessor']);
    private id: string = "";
    //@ts-ignore - URL should be undefined here
    private url: URL;

    constructor(private _url: string) {
        _url = _url.match(/\bhttps?:\/\/\S+/gi)?.[0] ?? _url;

        if (!_url.startsWith('http')) {
            _url = `https://${_url}`;
        }

        this.id = this.validateUrl(new URL(this._url));
    }

    public async execute(): Promise<FileContent[]> {
        this.url = await this.extractUrl(new URL(this._url));
        let files: Blob[] = [];

        if (this.url.hostname.includes('tiktok')) {
            try {
                files = await new TiktokProcessor(this.url).execute();
            } catch (e) {
                LinkProcessor.logger.warn(`Could not download using TiktokProcessor: ${e}`);
            }
        }

        if (files.length === 0) {
            files = await new YoutubeDLProcessor(this.url)
                .format("mp4")
                .execute();
        }

        return files.map((file) => {
            return {
                name: this.id + '.' + this.getExtensionFromFileType(file),
                blob: file,
            }
        });
    }

    private getExtensionFromFileType(file: Blob) {
        return file.type.split('/')[1];
    }

    private async getTiktokCanonicalUrl(url: URL) {
        const data = await fetch(url, {
            headers: { userAgent: TiktokProcessor.userAgent }
        });

        let text = await data.text();
        text = text.replace(/\\u002F/g, '/');
        const match = text.match(/{"canonical":"(https:\/\/www.tiktok.com\/[^"]+)"/);

        if (!match) {
            return url;
        }

        return new URL(match[1] ?? url);
    }

    private async extractUrl(url: URL): Promise<URL> {
        if (url.hostname.includes('tiktok')) {
            if (url.pathname.includes('/photo/')) {
                url.pathname = url.pathname.replace('/photo/', '/video/');
            }
        }

        if (url.hostname.startsWith('vx')) {
            url.hostname = url.hostname.replace('vx', '');
        }

        if (url.hostname.includes('vm.tiktok.com')) {
            try {
                const canonicalUrl = await this.getTiktokCanonicalUrl(url);

                if (canonicalUrl !== url) {
                    return this.extractUrl(canonicalUrl);
                }
            } catch(e) {
                logger.error(`Error extracting Tiktok canonical URL for ${url}: ${e}`);
            }
        }

        url.searchParams.delete('list');

        return url;
    }

    private validateUrl(url: URL) {
        if (!ALLOWED_HOSTS.includes(url.hostname)) {
            const allowedUrlsString = JSON.stringify(ALLOWED_HOSTS)
                .replace('[', '')
                .replace(']', '')
                .replace(/,/g, ', ')
                .replace(/"/g, '');

            throw new Error(`Not an allowed url:\n${allowedUrlsString}`);
        }

        const urlNoParams = url.href.split('?')[0] ?? "";
        let id = urlNoParams.split('/')[urlNoParams.split('/').length - 1];
        if (id === '') {
            id = urlNoParams.split('/')[urlNoParams.split('/').length - 2];
        }

        if (!id && url.hostname.includes('youtube')) {
            id = url.searchParams.get('v') as string;
        }

        if (!id) {
            throw new Error('No id found');
        }

        return id;
    }
}