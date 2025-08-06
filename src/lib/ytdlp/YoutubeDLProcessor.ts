import { YtDlp, type FormatOptions } from "ytdlp-nodejs";
import { Logger } from "../../logger";

export namespace YoutubeDLProcessor {
    const instance = new YtDlp();
    const logger = Logger.getLogger(["lib", "ytdlp", "YoutubeDLProcessor"]);

    export async function setup() {
        logger.debug("Initializing yt-dlp");

        let isInstalled = false;
        
        try {
            isInstalled = instance.checkInstallation({ ffmpeg: true });
        } catch (_) {
            isInstalled = false;
        }

        if (!isInstalled) {
            await instance.downloadFFmpeg();
        }

        logger.debug("yt-dlp setup complete");
    }

    export async function getFile(url: string, options: FormatOptions<"audioandvideo"> = {}) {
        return instance.stream(url, { 
            ...options,
        });
    }
}