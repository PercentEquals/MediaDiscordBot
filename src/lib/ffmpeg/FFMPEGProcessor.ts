import { DISCORD_LIMIT } from "../../consts/discord";
import trim from "../file/buffer";
import type IProcessor from "../interfaces/IProcessor";

export default class FFMPEGProcessor implements IProcessor<Blob[]> {
    private commmand: string[] = [];
    private blob: Blob | undefined;

    constructor(
        private url: URL,
        private executor: string = "./node_modules/ytdlp-nodejs/bin/ffmpeg"
    ) {
        this.commmand.push('-i', 'pipe:0');
        this.commmand.push('-hide_banner');
        this.commmand.push('-loglevel', 'error');
        this.commmand.push('-c', 'copy');
    }

    input(blob: Blob) {
        this.blob = blob;
        return this;
    }

    startTime(startTime: number) {
        this.commmand.push('-ss', startTime.toString());
        return this;
    }

    time(time: number) {
        this.commmand.push('-t', time.toString());
        return this;
    }

    async execute(): Promise<Blob[]> {
        const proc = Bun.spawn(
            [this.executor, ...this.commmand, '-f', 'matroska', 'pipe:1'],
            {
                stdin: this.blob,
                stdout: "pipe",
            }
        )

        const blob = await new Response(proc.stdout).blob();
        return [new Blob([await blob.bytes()], { type: "video/mp4" })]
    }
}