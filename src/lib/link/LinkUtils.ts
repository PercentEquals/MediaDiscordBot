import { ALLOWED_HOSTS } from "../../consts/hosts";
import { Logger } from "../../logger";
import TiktokProcessor from "../tiktok/TiktokProcessor";

const logger = Logger.getLogger(['lib', 'link', 'LinkUtils']);

export namespace LinkUtils {
    export function getExtensionFromFileType(file: Blob) {
        return file.type.split('/')[1];
    }

    export async function getTiktokCanonicalUrl(url: URL) {
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

    export async function extractUrl(url: URL): Promise<URL> {
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
                const canonicalUrl = await getTiktokCanonicalUrl(url);

                if (canonicalUrl !== url) {
                    return extractUrl(canonicalUrl);
                }
            } catch (e) {
                logger.error(`Error extracting Tiktok canonical URL for ${url}: ${e}`);
            }
        }

        url.searchParams.delete('list');

        return url;
    }

    export function validateUrl(url: URL) {
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