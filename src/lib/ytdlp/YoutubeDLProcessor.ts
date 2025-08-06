import { YtDlp } from "ytdlp-nodejs";
import { DISCORD_LIMIT } from "../../consts/discord";
import { Logger } from "../../logger";

export default class YoutubeDLProcessor {
    private static logger = Logger.getLogger(['lib', 'ytdlp', 'YoutubeDLProcessor']);
    private buffer: Buffer = Buffer.alloc(DISCORD_LIMIT * 1024 * 1024);
    private command: string[] = [];

    constructor(private url: URL) {
        this.command.push(url.toString());

        this.command.push("--extractor-args", "youtube:player_client=android,web");

        this.command.push("--no-warnings");
        this.command.push("--no-check-certificate");

        this.command.push("-N", "10");
        this.command.push("--downloader", "aria2c");

        this.command.push("--quiet");

        this.command.push('-S', `filesize:${DISCORD_LIMIT}M`);
    }

    public format(format: string) {
        this.command.push("--format", format);
        return this;
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
        await Bun.$`./node_modules/ytdlp-nodejs/bin/yt-dlp ${this.command} --output - > ${this.buffer}`;
        return [new Blob([this.trimEnd(this.buffer)], { type: "video/mp4" })]
    }

    public static async setup() {
        YoutubeDLProcessor.logger.debug("Setting up YoutubeDLProcessor...");
        await new YtDlp().downloadFFmpeg();
        YoutubeDLProcessor.logger.debug("YoutubeDLProcessor setup complete.");
    }
}