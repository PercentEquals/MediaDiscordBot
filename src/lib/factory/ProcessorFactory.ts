import { DISCORD_LIMIT } from "../../consts/discord";

import type IProcessor from "../interfaces/IProcessor";
import BlobCacheProcessor from "../cache/BlobCacheProcessor";
import TiktokProcessor from "../tiktok/TiktokProcessor";
import YoutubeDLProcessor from "../ytdlp/YoutubeDLProcessor";
import SplitProccessor from "../split/SplitProccessor";

export enum ProcessorType {
    Cache,
    Tiktok,
    Youtube,
    Split
}

export default function ProcessorFactory(type: ProcessorType): (url: URL) => IProcessor<Blob[]> {
    switch (type) {
        case ProcessorType.Cache:
            return (url: URL) => new BlobCacheProcessor(url);
        case ProcessorType.Tiktok:
            return (url: URL) => new TiktokProcessor(url);
        case ProcessorType.Youtube:
            return (url: URL) => new YoutubeDLProcessor(url).filesize(DISCORD_LIMIT);
        case ProcessorType.Split:
            return (url: URL) => new SplitProccessor(url);
        default:
            throw new Error(`Unknown processor type: ${type}`);
    }
}