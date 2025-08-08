import { createBot, createDesiredPropertiesObject, Intents } from '@discordeno/bot'
import events from './events';
import { Logger } from './logger';

const desiredProperties = createDesiredPropertiesObject({
    interaction: {
        id: true,
        data: true,
        type: true,
        token: true,
        channelId: true,
    },
    message: {
        id: true,
        author: true,
        content: true,
        bot: true,
        channelId: true,
    },
    user: {
        id: true,
        toggles: true,
    }
})

interface BotDesiredProperties extends Required<typeof desiredProperties> { }

const bot = createBot({
    token: Bun.env.TOKEN!,
    intents: Intents.GuildMessages | Intents.MessageContent,
    desiredProperties: desiredProperties as BotDesiredProperties,
    loggerFactory: (name) => Logger.getDenoLogger([name]),
})

bot.events = events;

export default bot;