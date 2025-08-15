import { Logger } from "../../logger";
import { LinkUtils } from "./LinkUtils";
import ProcessorFactory, { ProcessorType } from "../factory/ProcessorFactory";
import type IProcessor from "../interfaces/IProcessor";
import { BlobCache } from "../cache/BlobCache";
import YoutubeDLProcessor from "../ytdlp/YoutubeDLProcessor";

export default class LinkProcessor implements IProcessor<Blob[]> {
    private static logger = Logger.getLogger(['lib', 'link', 'LinkProcessor']);
    public readonly id: string = "";
    private url: URL;

    constructor(
        url: string,
        private processorFactory: typeof ProcessorFactory = ProcessorFactory,
        private processors: ProcessorType[] = [
            ProcessorType.Cache,
            ProcessorType.Tiktok,
            ProcessorType.Youtube,
            ProcessorType.Split
        ]
    ) {
        url = url.match(/\bhttps?:\/\/\S+/gi)?.[0] ?? url;

        if (!url.startsWith('http')) {
            url = `https://${url}`;
        }

        this.id = LinkUtils.validateUrl(new URL(url));
        this.url = new URL(url);
    }

    public async execute(): Promise<Blob[]> {
        const url = await LinkUtils.preprocessUrl(this.url);

        for (const processor of this.processors) {
            try {
                const processorProvider = this.processorFactory(processor);
                const processorInstance = processorProvider(url);
                const result = await processorInstance.execute();
                
                if (result.length === 0) {
                    continue;
                }

                BlobCache.set(url, result);
                return result;
            } catch (e) {
                LinkProcessor.logger.warn(`Error processing URL ${url}: ${e}`);
            }
        }

        throw new Error('No processors found for the given URL');
    }
}