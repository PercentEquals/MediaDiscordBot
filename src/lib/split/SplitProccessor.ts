import { DISCORD_LIMIT, DISCORD_LIMIT_KB } from "../../consts/discord";
import { Logger } from "../../logger";
import FFMPEGProcessor from "../ffmpeg/FFMPEGProcessor";
import type IProcessor from "../interfaces/IProcessor";
import YoutubeDLProcessor from "../ytdlp/YoutubeDLProcessor";

export default class SplitProccessor implements IProcessor<Blob[]> {
    private static logger = Logger.getLogger(['lib', 'ffmpeg', 'SplitProccessor']);

    constructor(
        private url: URL,
        private YoutubeDLProcessorFactory = (url: URL) => new YoutubeDLProcessor(url),
        private FFMPEGProcessorFactory = (url: URL) => new FFMPEGProcessor(url),
    ) {}

    async execute(): Promise<Blob[]> {
        SplitProccessor.logger.trace(`Executing split processor for URL: ${this.url}`);

        const json = await this.YoutubeDLProcessorFactory(this.url).filesize(DISCORD_LIMIT * 5).info().execute();
        const duration = json.duration;
        const filesize = json.filesize ?? json.filesize_approx;

        const chunks = Math.ceil(filesize / DISCORD_LIMIT_KB);
        const chunkDuration = Math.round(duration / chunks);
        const blobs: Blob[] = [];

        const fullfile = await this.YoutubeDLProcessorFactory(this.url)
                .filesize(DISCORD_LIMIT * 5)
                .execute();
        
        for (let i = 0; i < chunks; i++) {
            const startTime = Math.ceil(i * chunkDuration);
            const endTime = Math.min(startTime + chunkDuration, duration);

            const blob = await this.FFMPEGProcessorFactory(this.url)
                .input(fullfile[0]!)
                .startTime(startTime)
                .time(endTime - startTime)
                .execute();

            blobs.push(blob[0]!);
        }

        return blobs;
    }
}