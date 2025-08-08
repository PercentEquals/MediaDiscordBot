import { YtDlp } from "ytdlp-nodejs";
import { DISCORD_LIMIT } from "../../consts/discord";
import { Logger } from "../../logger";
import type IProcessor from "../interfaces/IProcessor";

export default class YoutubeDLProcessor implements IProcessor<Blob[]> {
    private static logger = Logger.getLogger(['lib', 'ytdlp', 'YoutubeDLProcessor']);
    private blob: Blob | null = null;
    private command: string[] = [];

    constructor(
        private url: URL,
        private executor: string = "./node_modules/ytdlp-nodejs/bin/yt-dlp"
    ) {
        this.command.push(url.toString());

        this.command.push("--extractor-args", "youtube:player_client=android,web");

        this.command.push("--no-warnings");
        this.command.push("--no-check-certificate");

        this.command.push("-N", "10");
        this.command.push("--downloader", "aria2c");

        this.command.push("--quiet");
        this.command.push("--format", "mp4");

        this.command.push('-S', `filesize:${DISCORD_LIMIT}M`);
    }

    private trimEnd(buffer: Buffer) {
        let pos = 0;

        for (let i = buffer.length - 1; i >= 0; i--) {
            if (buffer[i] !== 0x00) {
                pos = i;
                break;
            }
        }

        return buffer.slice(0, pos + 1);
    }

    public async execute(): Promise<Blob[]> {        
        YoutubeDLProcessor.logger.debug(`Executing yt-dlp command with args: ${this.command}`);

        const buffer = Buffer.alloc(DISCORD_LIMIT * 1024 * 1024);
        await Bun.$`${this.executor} ${this.command} --output - > ${buffer}`;
        this.blob = new Blob([this.trimEnd(buffer)], { type: "video/mp4" });

        return [this.blob];
    }

    public static async setup() {
        YoutubeDLProcessor.logger.trace("Setting up YoutubeDLProcessor...");
        await new YtDlp().downloadFFmpeg();
        YoutubeDLProcessor.logger.trace("YoutubeDLProcessor setup complete.");
    }
}