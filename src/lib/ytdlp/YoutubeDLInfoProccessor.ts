import type { YoutubeDLJson } from "../../../types/youtubedl";
import { Logger } from "../../logger";
import type IProcessor from "../interfaces/IProcessor";

export default class YoutubeDLInfoProcessor implements IProcessor<YoutubeDLJson> {
    static logger = Logger.getLogger(['lib', 'ytdlp', 'YoutubeDLInfoProccessor']);
    
    constructor(
        private executor: string,
        private command: string[]
    ) {}

    async execute(): Promise<YoutubeDLJson> {
        YoutubeDLInfoProcessor.logger.debug(`Executing yt-dlp command with args: ${this.command.join(' ')}`);

        const json = await Bun.$`${this.executor} ${this.command}`.text();
        return JSON.parse(json);
    }
}