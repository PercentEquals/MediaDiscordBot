import { Logger } from "../../logger";
import fs from "fs";

export namespace StoredCache {
    const logger = Logger.getLogger(['lib', 'cache', 'StoredCache']);

    const fileMap = new Map<string, Blob>();

    export function getAvailableFiles() {
        const files = fs.readdirSync('cache');

        for (const file of files) {
            if (file.startsWith('.')) {
                continue;
            }

            logger.trace(`Found available file: ${file}`);
            fileMap.set(file, new Blob([fs.readFileSync(`cache/${file}`)]));
        }

        return files;
    }

    export function get(fileName: string): Blob {
        return fileMap.get(fileName)!;
    }

}