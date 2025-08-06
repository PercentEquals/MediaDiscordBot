import { configure, getConsoleSink, getLogger as getLoggerInternal } from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";

export namespace Logger {
    export async function setup() {
        await configure({
            sinks: { console: getConsoleSink({ formatter: prettyFormatter }), },
            loggers: [
                { category: ["logtape", "meta"], sinks: [] },
                { category: "Deno", lowestLevel: "info", sinks: ["console"] },
                { category: "DiscordBot", lowestLevel: "info", sinks: ["console"] }
            ]
        });
    }

    export function getLogger(namespaces: string[]) {
        return getLoggerInternal(["DiscordBot", ...namespaces]);
    }

    export function getDenoLogger(namespaces: string[]) {
        return getLoggerInternal(["Deno", ...namespaces]);
    }
}