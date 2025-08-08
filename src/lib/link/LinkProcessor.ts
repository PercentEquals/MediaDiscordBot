import { Logger } from "../../logger";
import { type FileContent } from "discordeno";
import { LinkUtils } from "./LinkUtils";
import ProcessorFactory, { ProcessorType } from "../factory/ProcessorFactory";
import type IProcessor from "../interfaces/IProcessor";
import { BlobCache } from "../cache/BlobCache";

export default class LinkProcessor implements IProcessor<FileContent[]> {
    private static logger = Logger.getLogger(['lib', 'link', 'LinkProcessor']);
    private id: string = "";
    private url: URL;

    constructor(
        url: string,
        private processorFactory: typeof ProcessorFactory = ProcessorFactory,
        private processors: ProcessorType[] = [
            ProcessorType.BlobCache,
            ProcessorType.Tiktok,
            ProcessorType.YoutubeDL
        ]
    ) {
        url = url.match(/\bhttps?:\/\/\S+/gi)?.[0] ?? url;

        if (!url.startsWith('http')) {
            url = `https://${url}`;
        }

        this.id = LinkUtils.validateUrl(new URL(url));
        this.url = new URL(url);
    }

    public async execute(): Promise<FileContent[]> {
        const url = await LinkUtils.extractUrl(this.url);

        for (const processor of this.processors) {
            try {
                const processorInstance = this.processorFactory(processor);
                const result = await processorInstance(url).execute();
                
                if (result.length === 0) {
                    continue;
                }

                BlobCache.set(url, result);

                return result.map((file) => {
                    return {
                        name: this.id + '.' + LinkUtils.getExtensionFromFileType(file),
                        blob: file,
                    }
                });
            } catch (e) {
                LinkProcessor.logger.warn(`Error processing URL ${url}: ${e}`);
            }
        }

        throw new Error('No processors found for the given URL');
    }
}