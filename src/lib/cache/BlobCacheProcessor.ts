import type IProcessor from "../interfaces/IProcessor";
import { BlobCache } from "./BlobCache";

export default class BlobCacheProcessor implements IProcessor<Blob[]> {
    constructor(
        private url: URL,
    ) {

    }

    public async execute(): Promise<Blob[]> {
        return BlobCache.get(this.url);
    }
}