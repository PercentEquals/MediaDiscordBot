import { createBotHelpers, type Interaction, type InteractionCallbackData } from 'discordeno';
import bot from '../bot.js'

import { Logger } from '../logger.js'
import media, { type MediaArgs } from '../commands/media.js';
import { LinkUtils } from '../lib/link/LinkUtils.js';
import { ALLOWED_HOSTS } from '../consts/hosts.js';

const logger = Logger.getLogger(["events", "messageCreate"]);
const SUPRESS_EMBEDS = 4; // https://discord.com/developers/docs/resources/message#message-object

export const event: typeof bot.events.messageCreate = async (message) => {
    if (message.author.bot) {
        return;
    }

    const url = LinkUtils.extractUrl(message.content);
    const allowed = ALLOWED_HOSTS.some((host) => message.content.includes(host));

    if (!url || !allowed) {
        return;
    }

    const interactionAdapter = {
        respond: (data: InteractionCallbackData) => {
            bot.helpers.sendMessage(message.channelId, {
                messageReference: {
                    messageId: message.id,
                    failIfNotExists: true
                },
                allowedMentions: {
                    users: [message.author.id],
                },
                ...data
            });
        },
        defer: () => {
            bot.helpers.triggerTypingIndicator(message.channelId);
        }
    } as unknown as Interaction;

    try {
        await bot.rest.patch(`/channels/${message.channelId}/messages/${message.id}`, {
            body: {
                flags: SUPRESS_EMBEDS
            }
        }).catch();

        await media.execute(interactionAdapter, { get: {
            url: { link: url }
        } } as MediaArgs);
    } catch (e) {
        await bot.rest.patch(`/channels/${message.channelId}/messages/${message.id}`, {
            body: {
                flags: 0
            }
        }).catch();

        logger.trace(`Error executing media command: ${e}`);
    }
}