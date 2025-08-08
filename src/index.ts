import bot from "./bot";
import commands from "./commands";
import YoutubeDLProcessor from "./lib/ytdlp/YoutubeDLProcessor";
import { Logger } from "./logger";

await Logger.setup();
const logger = Logger.getLogger(["bot", "index"]);

logger.info("Starting bot...");

await YoutubeDLProcessor.setup();

await bot.start();
await bot.rest.upsertGlobalApplicationCommands([...commands.values()]);