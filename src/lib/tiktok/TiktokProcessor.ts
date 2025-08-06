import parse from "node-html-parser";
import { downloadFileStream } from "../file/download";

export default class TiktokProcessor {
    static userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    private cookies: string = "";
    private canonical: string = "";
    private data: TiktokRehydrationApi | null = null;
    private audioOnly: boolean = false;

    constructor(private url: URL) {
        
    }

    public async getInfo() {
        let response = await fetch(this.url, { headers: { userAgent: TiktokProcessor.userAgent }});

        this.cookies = "";
        this.cookies += response.headers.get("set-cookie")?.match(/ttwid=[^;]*; /);
        this.cookies += response.headers.get("set-cookie")?.match(/tt_csrf_token=[^;]*; /);
        this.cookies += response.headers.get("set-cookie")?.match(/tt_chain_token=[^;]*; /);

        const body = await response.text();
        const dom = parse(body);
        const script = dom.querySelector('#__UNIVERSAL_DATA_FOR_REHYDRATION__');

        this.data = JSON.parse(script?.innerHTML!).__DEFAULT_SCOPE__["webapp.video-detail"];
        this.canonical = JSON.parse(script?.innerHTML!).__DEFAULT_SCOPE__["seo.abtest"].canonical;

        return this;
    }

    public audio() {
        this.audioOnly = true;
        return this;
    }

    public async execute(): Promise<Blob[]> {
        await this.getInfo();

        const videoUrl = this.data!.itemInfo.itemStruct.video.downloadAddr ??
                         this.data!.itemInfo.itemStruct.video.playAddr;

        const audioUrl = this.data?.itemInfo?.itemStruct?.music?.playUrl!;
        const downloadAddr = this.audioOnly ? audioUrl : videoUrl;

        if (this.isSlideshow()) {
            const slideshow = this.getSlideshowData();
            const files = [];

            for (const slide of slideshow) {
                files.push(await this.download(slide));
            }

            return files;
        }

        return [await this.download(downloadAddr)];
    }

    private async download(url: string) {
        return downloadFileStream(
            url,
            {
                headers: {
                    "User-Agent": TiktokProcessor.userAgent,
                    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Sec-Fetch-Mode": "navigate",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Referer": this.canonical,
                    "Cookie": this.cookies
                },
                credentials: "include",
                method: "GET"
            }
        )
    }

    private isSlideshow(): boolean {
        return this.data?.itemInfo?.itemStruct?.imagePost?.images.length! > 0;
    }

    private getSlideshowData(): string[] {
        const images = this.data?.itemInfo?.itemStruct?.imagePost?.images;

        if (!images) {
            return [];
        }

        return images.map(image => image.imageURL.urlList.find(
            (url) => url.includes('.jpeg')
        ) ?? image.imageURL.urlList[0]!);
    }
}