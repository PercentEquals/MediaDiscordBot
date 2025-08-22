import { YtDlp } from "ytdlp-nodejs";
import { DISCORD_LIMIT_KB } from "../../consts/discord";
import { Logger } from "../../logger";
import type IProcessor from "../interfaces/IProcessor";
import YoutubeDLInfoProcessor from "./YoutubeDLInfoProccessor";
import trim from "../file/buffer";

export default class YoutubeDLProcessor implements IProcessor<Blob[]> {
    private static logger = Logger.getLogger(['lib', 'ytdlp', 'YoutubeDLProcessor']);

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
        this.command.push('-I', '0');
    }

    public filesize(size: number) {
        this.command.push('-S', `filesize:${size}M`);

        return this;
    }

    public info() {
        this.command.push('--dump-json', '--skip-download');
        return new YoutubeDLInfoProcessor(this.executor, this.command);
    }

    public async execute(): Promise<Blob[]> {        
        YoutubeDLProcessor.logger.debug(`Executing yt-dlp command with args: ${this.command.join(' ')}`);

        const buffer = Buffer.alloc(DISCORD_LIMIT_KB);
        await Bun.$`${this.executor} ${this.command} --output - > ${buffer}`;
        const blob = new Blob([trim(buffer)], { type: "video/mp4" });

        return [blob];
    }

    public static async setup() {
        YoutubeDLProcessor.logger.trace("Setting up YoutubeDLProcessor...");
        await new YtDlp().downloadFFmpeg();
        YoutubeDLProcessor.logger.trace("YoutubeDLProcessor setup complete.");
    }
}