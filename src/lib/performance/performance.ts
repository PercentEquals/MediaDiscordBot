import { Logger } from "../../logger";

const logger = Logger.getLogger(["performance"]);

export default async function performance<T>(context: Object, fn: (...args: unknown[]) => T, ...args: unknown[]) {
    const start = process.hrtime();
    const result = await fn.bind(context)(...args);
    const end = process.hrtime(start);

    logger.debug(`Function ${context.constructor.name}.${fn.name}() took: ${end[0]}s and ${end[1] / 1000000}ms`);
    return result;
}