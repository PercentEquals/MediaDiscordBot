import BlobCacheProcessor from "../cache/BlobCacheProcessor";
import type IProcessor from "../interfaces/IProcessor";
import TiktokProcessor from "../tiktok/TiktokProcessor";
import YoutubeDLProcessor from "../ytdlp/YoutubeDLProcessor";

export enum ProcessorType {
    BlobCache,
    Tiktok,
    YoutubeDL
}

export default function ProcessorFactory(type: ProcessorType): (url: URL) => IProcessor<Blob[]> {
    switch (type) {
        case ProcessorType.BlobCache:
            return (url: URL) => new BlobCacheProcessor(url);
        case ProcessorType.Tiktok:
            return (url: URL) => new TiktokProcessor(url);
        case ProcessorType.YoutubeDL:
            return (url: URL) => new YoutubeDLProcessor(url);
        default:
            throw new Error(`Unknown processor type: ${type}`);
    }
}