import { createBot } from '@discordeno/bot'
import events from './events';
import { Logger } from './logger';

const bot = createBot({
    token: Bun.env.TOKEN!,
    desiredProperties: {
        interaction: {
            id: true,
            data: true,
            type: true,
            token: true,
            channelId: true,
        }
    },
    loggerFactory: (name) => Logger.getDenoLogger([name]),
})

bot.events = events;

export default bot;