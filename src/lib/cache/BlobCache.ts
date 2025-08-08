import { Logger } from "../../logger";

export namespace BlobCache {
    const logger = Logger.getLogger(['lib', 'cache', 'BlobCache']);
    const blobMap: Map<string, Blob[]> = new Map();

    // TODO: Limit blob cache size to x items

    export function get(url: URL): Blob[] {
        logger.trace(`Getting blob cache for ${url}`);

        if (blobMap.has(url.toString())) {
            logger.trace(`Blob cache for ${url} found`);
            return blobMap.get(url.toString())!;
        }

        logger.trace(`Blob cache miss for ${url}`);
        return [];
    }

    export function set(url: URL, blobs: Blob[]): void {
        if (!blobMap.has(url.toString())) {
            logger.trace(`Setting blob cache for ${url}`);
            blobMap.set(url.toString(), blobs);
        }
    }
}