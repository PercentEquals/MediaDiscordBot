import { Logger } from "../../logger";

export namespace BlobCache {
    const logger = Logger.getLogger(['lib', 'cache', 'BlobCache']);
    const blobMap: Map<string, CacheItem> = new Map();
    const maxCacheItems = 10;

    class CacheItem {
        constructor(
            public url: URL, 
            public blobs: Blob[],
            public timestamp: number = performance.now()
        ) {}
    }

    export function get(url: URL): Blob[] {
        logger.trace(`Getting blob cache for ${url}`);

        if (blobMap.has(url.toString())) {
            logger.trace(`Blob cache for ${url} found`);
            return blobMap.get(url.toString())!.blobs;
        }

        logger.trace(`Blob cache miss for ${url}`);
        return [];
    }

    function removeOldestItems(): void {
        while (blobMap.size > maxCacheItems) {
            const oldestItem = Array.from(blobMap.values()).reduce((a, b) => a.timestamp < b.timestamp ? a : b);
            blobMap.delete(oldestItem.url.toString());
        }
    }


    export function set(url: URL, blobs: Blob[]): void {
        if (!blobMap.has(url.toString())) {
            removeOldestItems();

            logger.trace(`Setting blob cache for ${url}`);
            blobMap.set(url.toString(), new CacheItem(url, blobs));
        }
    }
}